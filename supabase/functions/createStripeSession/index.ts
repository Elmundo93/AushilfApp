// supabase/functions/createStripeSession/index.ts
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
  console.log('🔄 createStripeSession: Neue Anfrage erhalten');
  
  try {
    const { user_id, email } = await req.json();
    console.log('📝 Eingangsdaten:', { user_id, email });
    
    const appUrl = Deno.env.get('APP_URL');
    console.log('🔗 App URL:', appUrl);

    if (!user_id || !email) {
      console.error('❌ Fehlende Parameter:', { user_id, email });
      return new Response(JSON.stringify({ error: 'user_id oder email fehlt' }), { status: 400 });
    }

    if (!appUrl) {
      console.error('❌ APP_URL nicht konfiguriert');
      return new Response(JSON.stringify({ error: 'APP_URL fehlt' }), { status: 500 });
    }

    console.log('💳 Erstelle Stripe Checkout Session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1RjNseRo1tSBJy4Lla0KtKr4', // ID deines monatlichen 0,99€-Preises
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: { user_id },
      success_url: `${appUrl}/payment-success`,
      cancel_url: `${appUrl}/payment-cancelled`,
    });
  
    console.log('✅ Stripe Session erstellt:', { 
      sessionId: session.id,
      url: session.url,
      customerEmail: session.customer_email
    });

    if (!session?.url) {
      console.error('❌ Keine Stripe URL in der Session');
      return new Response(JSON.stringify({ error: 'Stripe URL fehlt' }), { status: 500 });
    }

    console.log('💾 Speichere Session-ID in Supabase...');
    const { error: updateError } = await supabase
      .from('Users')
      .update({ stripe_session_id: session.id })
      .eq('id', user_id);

    if (updateError) {
      console.error('❌ Fehler beim Update:', {
        error: updateError,
        user_id,
        session_id: session.id,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      });
      return new Response(JSON.stringify({ 
        error: 'Fehler beim Speichern der Session-ID',
        details: updateError.message
      }), { status: 500 });
    }
    console.log('✅ Session-ID erfolgreich gespeichert');

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err: any) {
    console.error('❌ Unerwarteter Fehler:', {
      message: err.message,
      stack: err.stack,
      type: err.type
    });
    return new Response(JSON.stringify({ error: 'Serverfehler bei Stripe-Checkout' }), { status: 500 });
  }
});