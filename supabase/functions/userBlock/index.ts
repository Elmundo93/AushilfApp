// supabase/functions/userBlock.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getStreamClient } from '../_shared/getStreamClient.ts';

serve(async (req) => {
  try {
    const { userId, reason } = await req.json();

    if (!userId || typeof userId !== 'string') {
      return new Response(JSON.stringify({ error: 'Ungültige oder fehlende userId' }), {
        status: 400,
      });
    }

    console.log('🔒 Anfrage zum Blockieren:', { userId, reason });

    const client = getStreamClient(req);

    const blockResult = await client.blockUser(userId, {
      reason: reason || 'Kein Grund angegeben',
    });

    console.log('✅ Erfolgreich blockiert:', blockResult);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Fehler beim Blockieren:', err);

    return new Response(JSON.stringify({ error: 'Blockieren fehlgeschlagen', details: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});