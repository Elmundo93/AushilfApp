// supabase/functions/identityWebhook/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-08-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      Deno.env.get('STRIPE_IDENTITY_WEBHOOK_SECRET')!
    );
  } catch (err) {
    console.error('❌ Invalid signature:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const session = event.data.object;
  const userId = session.metadata?.user_id;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 });
  }

  // ✅ Verifikation erfolgreich
  if (event.type === 'identity.verification_session.verified') {
    const name = session.verified_outputs?.document?.name;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Missing verified name' }), { status: 400 });
    }

    const { data: user, error: fetchError } = await supabase
      .from('Users')
      .select('vorname, nachname')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      console.error('❌ User not found or fetch error:', fetchError);
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const match =
      user.vorname?.toLowerCase() === name.first_name?.toLowerCase() &&
      user.nachname?.toLowerCase() === name.last_name?.toLowerCase();

    const { error: updateError } = await supabase
      .from('Users')
      .update({
        is_id_verified: match,
        id_verified_name_match: match,
        id_verified_name: name,
        verification_canceled: false,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Failed to update user after verification:', updateError);
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
    }

    console.log(`✅ Verifikation abgeschlossen für ${userId} (Match: ${match})`);
    return new Response(JSON.stringify({ match }), { status: 200 });
  }

  // ❌ Verifikation abgebrochen
  if (event.type === 'identity.verification_session.canceled') {
    const { error } = await supabase
      .from('Users')
      .update({
        verification_canceled: true,
        is_id_verified: false,
      })
      .eq('id', userId);

    if (error) {
      console.error('❌ Failed to mark verification canceled:', error);
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
    }

    console.log(`🚫 Verifikation abgebrochen für ${userId}`);
    return new Response(JSON.stringify({ message: 'Verifikation abgebrochen gespeichert' }), { status: 200 });
  }

  return new Response('OK', { status: 200 });
});