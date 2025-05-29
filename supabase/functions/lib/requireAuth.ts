import { supabaseAdmin } from './supabaseClient.ts';
import { decode } from 'https://deno.land/x/djwt@v2.8/mod.ts';

export async function requireAuth(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('Kein Auth-Header übergeben');

  try {
    const payload = (await decode(token))[1] as { user_id: string };
    const userId = payload?.user_id;
    if (!userId) throw new Error('Kein User-ID im Token gefunden');

    const { data, error } = await supabaseAdmin.auth.getUserById(userId);
    if (error || !data?.user) throw new Error('Benutzer nicht gefunden');

    return data.user;
  } catch (e) {
    throw new Error('Token ungültig oder fehlerhaft: ' + String(e));
  }
}