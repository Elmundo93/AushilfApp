// supabase/functions/createIdentitySession/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0';
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2023-08-16'
});
serve(async (req)=>{
  console.log('🆔 Neue Identity-Verifikationsanfrage erhalten');
  try {
    const { user_id } = await req.json();
    const appUrl = Deno.env.get('APP_URL');
    console.log('📥 Eingangsdaten:', {
      user_id
    });
    if (!user_id || !appUrl) {
      console.error('❌ Fehlende Parameter');
      return new Response(JSON.stringify({
        error: 'user_id oder APP_URL fehlt'
      }), {
        status: 400
      });
    }
    console.log('🔐 Erstelle Identity-Verifikationssession...');
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id
      },
      return_url: `${appUrl}/identity-success`
    });
    console.log('🌍 appUrl:', appUrl);
    console.log('📨 Stripe Session Request Metadata:', {
      user_id,
      success_url: `${appUrl}/identity-success`,
      cancel_url: `${appUrl}/identity-canceled`
    });
    if (!verificationSession?.url) {
      console.error('❌ Keine Session-URL erhalten');
      return new Response(JSON.stringify({
        error: 'Fehler beim Erstellen der Verifikationssession'
      }), {
        status: 500
      });
    }
    console.log('✅ Identity-Session erfolgreich erstellt:', {
      sessionId: verificationSession.id,
      url: verificationSession.url
    });
    return new Response(JSON.stringify({
      url: verificationSession.url
    }), {
      status: 200
    });
  } catch (e) {
    console.error('❌ Fehler beim Erstellen der Session:', {
      message: e.message,
      stack: e.stack,
      type: e.type
    });
    return new Response(JSON.stringify({
      error: 'Serverfehler bei Identity-Session'
    }), {
      status: 500
    });
  }
});
