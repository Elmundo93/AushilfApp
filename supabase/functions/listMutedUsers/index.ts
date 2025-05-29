// listMutedUsers.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { getStreamClient } from '../_shared/getStreamClient.ts';

serve(async (req) => {
  try {
    const client = getStreamClient(req);
    const currentUser = client.userId;

    const response = await client.queryUsers({ id: { $in: [] } }); // leeres Default-Query

    const mutedResponse = await client.getMutedUsers();
    const mutedUsers = mutedResponse?.muted_users?.map((entry) => {
      return {
        userId: entry.target.id,
        name: entry.target.name || '',
      };
    }) || [];

    return new Response(JSON.stringify({ mutes: mutedUsers }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ listMutedUsers error:', err);
    return new Response(JSON.stringify({ error: 'Mute-Liste konnte nicht geladen werden' }), {
      status: 500,
    });
  }
});