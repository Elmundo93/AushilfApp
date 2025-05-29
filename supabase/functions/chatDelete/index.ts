// supabase/functions/chatDelete.ts
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { StreamChat } from 'npm:stream-chat';
import { requireAuth } from '../lib/requireAuth.ts';

serve(async (req) => {
  try {
    const user = await requireAuth(req);
    const { channelType, channelId } = await req.json();

    const client = StreamChat.getInstance(
      Deno.env.get('GETSTREAM_API_KEY')!,
      Deno.env.get('GETSTREAM_API_SECRET')!
    );

    const channel = client.channel(channelType, channelId);
    await channel.delete();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 401 });
  }
});