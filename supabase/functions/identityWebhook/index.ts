import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const STRIPE_SECRET = Deno.env.get('STRIPE_IDENTITY_WEBHOOK_SECRET')!;
const IS_DEV = Deno.env.get('ENV') === 'dev';

async function isValidStripeSignature(rawBody: string, signatureHeader: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const timestamp = signatureHeader.split(',').find(s => s.startsWith('t='))?.split('=')[1];
    const v1 = signatureHeader.split(',').find(s => s.startsWith('v1='))?.split('=')[1];
    if (!timestamp || !v1) return false;

    const signedPayload = `${timestamp}.${rawBody}`;
    const payloadUint8 = encoder.encode(signedPayload);
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, payloadUint8);
    const signatureHex = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (IS_DEV) {
      console.log('🧾 Erwartete Signatur:', signatureHex.slice(0, 10) + '...');
      console.log('🔏 Gelieferte Signatur:', v1.slice(0, 10) + '...');
    }

    return signatureHex === v1;
  } catch (err) {
    console.error('❌ Fehler bei Signaturprüfung:', err);
    return false;
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig || !STRIPE_SECRET) {
    return new Response(JSON.stringify({ error: 'Missing signature or secret' }), { status: 400 });
  }

  const rawBody = await req.text();
  const isValid = await isValidStripeSignature(rawBody, sig, STRIPE_SECRET);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const session = event.data.object;
  const userId = session.metadata?.user_id;
  const name = session.verified_outputs?.document?.name ?? null;

  if (!userId) {
    console.warn('⚠️ Webhook received without user_id');
    return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 });
  }

  if (event.type === 'identity.verification_session.verified') {
    const { error: updateError } = await supabase
      .from('Users')
      .update({
        is_id_verified: true,
        id_verified_name_match: !!name,
        id_verified_name: name ?? { first_name: 'Demo', last_name: 'User' },
        verification_canceled: false,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
    }

    console.log(`✅ Verifikation abgeschlossen für ${userId} (Name vorhanden: ${!!name})`);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  if (event.type === 'identity.verification_session.canceled') {
    const { error } = await supabase
      .from('Users')
      .update({
        verification_canceled: true,
        is_id_verified: false,
      })
      .eq('id', userId);

    if (error) {
      console.error('❌ Update failed (canceled):', error);
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
    }

    console.log(`🚫 Verifikation abgebrochen für ${userId}`);
    return new Response(JSON.stringify({ canceled: true }), { status: 200 });
  }

  return new Response('Ignored event', { status: 200 });
});