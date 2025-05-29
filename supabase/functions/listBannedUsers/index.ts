import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { StreamChat } from 'npm:stream-chat';
import { requireAuth } from '../lib/requireAuth.ts';

serve(async (req) => {
  try {
    const user = await requireAuth(req);

    const client = StreamChat.getInstance(
      Deno.env.get('GETSTREAM_API_KEY')!,
      Deno.env.get('GETSTREAM_API_SECRET')!
    );

    const res = await client.queryBannedUsers({
      banned_by_id: user.id,
    });

    // Rückgabe auf relevante Felder begrenzen
    const sanitized = res.bans.map((ban) => ({
      userId: ban.user.id,
      name: ban.user.name || '',
      reason: ban.reason || '',
    }));

    return new Response(JSON.stringify({ bans: sanitized }), { status: 200 });
  } catch (e) {
    console.error('❌ listBannedUsers Error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 401 });
  }
});