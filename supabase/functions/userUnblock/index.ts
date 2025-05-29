// userUnblock.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getStreamClient } from '../_shared/getStreamClient.ts';

serve(async (req) => {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId fehlt' }), {
        status: 400,
      });
    }

    const client = getStreamClient(req);
    await client.unblockUser(userId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('❌ userUnblock error:', err);
    return new Response(JSON.stringify({ error: 'Entblocken fehlgeschlagen' }), {
      status: 500,
    });
  }
});