import { supabase } from '@/components/config/supabase';
import { getDB } from '@/components/Crud/SQLite/bridge'; // deine Expo-SQLite Instanz
import { withAsync } from '@/components/lib/withAsync';

export type Partner = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  stripe_verified: boolean | null;
};

export async function getPartnerForChannel(channel: { member_a: string; member_b: string }, currentUserId: string) {
  const partnerId = channel.member_a === currentUserId ? channel.member_b : channel.member_a;

  // 1) lokal
  const local = await getDB().getFirstAsync<Partner>(
    'SELECT id, display_name, avatar_url, stripe_verified FROM users WHERE id = ?',
    [partnerId]
  );
  if (local) return local;

  // 2) remote (+ cache)
  return withAsync('loadPartner', async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, avatar_url, stripe_verified')
      .eq('id', partnerId)
      .maybeSingle();

    const fallback: Partner = { id: partnerId, display_name: null, avatar_url: null, stripe_verified: null };
    if (error || !data) return fallback;

    await getDB().runAsync(
      'INSERT OR REPLACE INTO users (id, display_name, avatar_url, stripe_verified) VALUES (?,?,?,?)',
      [data.id, data.display_name, data.avatar_url, !!data.stripe_verified]
    );
    return data as Partner;
  });
}