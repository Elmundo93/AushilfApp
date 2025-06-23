// supabase/functions/stripeWebhook/index.ts
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const STRIPE_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const IS_DEV = Deno.env.get('ENV') === 'dev';

async function isValidStripeSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
): Promise<boolean> {
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
    return new Response(JSON.stringify({ error: 'Missing signature or secret' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const bodyBuffer = await new Response(req.body).arrayBuffer();
    const rawBody = new TextDecoder().decode(bodyBuffer);

    if (IS_DEV) {
      console.log('📜 Stripe Payload:', rawBody.slice(0, 150) + '...');
    }

    const isValid = await isValidStripeSignature(rawBody, sig, STRIPE_SECRET);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const event = JSON.parse(rawBody);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.user_id;

      if (!userId) {
        return new Response(JSON.stringify({ error: 'Missing user_id' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Check if already verified
      const { data: existingUser, error: fetchError } = await supabase
        .from('Users')
        .select('is_verified')
        .eq('id', userId)
        .single();

      if (fetchError || !existingUser) {
        return new Response(JSON.stringify({ error: 'User fetch failed' }), { status: 500 });
      }

      if (existingUser.is_verified) {
        return new Response(JSON.stringify({ message: 'Already verified' }), { status: 200 });
      }

      const { error: updateError } = await supabase
        .from('Users')
        .update({ is_verified: true })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Update failed:', updateError);
        return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
      }

      return new Response(JSON.stringify({ message: 'User verified' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Event ignored', type: event.type }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Webhook Verarbeitung fehlgeschlagen:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
});