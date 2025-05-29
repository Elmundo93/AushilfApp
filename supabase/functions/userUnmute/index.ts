// userUnmute.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getStreamClient } from '../_shared/getStreamClient.ts';

serve(async (req) => {
  try {
    const { userId } = await req.json();
    if (!userId) return new Response('Missing userId', { status: 400 });

    const client = getStreamClient(req);
    const currentUser = client.userId;

    await client.unmuteUser(userId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ userUnmute error:', err);
    return new Response(JSON.stringify({ error: 'Unmute fehlgeschlagen' }), {
      status: 500,
    });
  }
});