// components/services/Chat/chatApi.ts
import { supabase } from '@/components/config/supabase';
import { getDB } from '@/components/Crud/SQLite/bridge';

export const ALLOWED_CATEGORIES = ['gastro','garten','haushalt','soziales','handwerk','bildung'] as const;
export type AllowedCategory = typeof ALLOWED_CATEGORIES[number];

export async function ensure1on1Channel(userB: string) {
  const { data, error: eUser } = await supabase.auth.getUser();
  if (eUser) throw eUser;
  const userA = data.user?.id!;
  const { data: ch, error } = await supabase.rpc('ensure_1on1_channel', {
    p_user_a: userA,
    p_user_b: userB,
  });
  if (error) throw error;
  return ch as string;
}


export async function fetchChannelPage(limit = 100) {
  const { data, error } = await supabase
    .from('channels')
    .select('id, custom_type, custom_category, updated_at, last_message_at, last_message_text, last_sender_id, meta, channel_members!inner(user_id)')
    .eq('channel_members.user_id', (await supabase.auth.getUser()).data.user?.id ?? '')
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(({ channel_members, ...c }) => c);
}

/** Legacy-Backfill (aufsteigend) – bleibt für ersten Sync nützlich */
export async function fetchMessages(channelId: string, sinceIso?: string, limit = 500) {
  let q = supabase
    .from('messages')
    .select('*')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (sinceIso) q = q.gte('created_at', sinceIso);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

/** Neue Seek-Pagination: ältere Nachrichten seitenweise nach oben laden */
export async function pageMessages(channelId: string, beforeCreated?: string, beforeId?: string, limit = 50) {
  const { data, error } = await supabase.rpc('page_messages', {
    p_channel_id: channelId,
    p_limit: limit,
    p_before_created: beforeCreated ?? null,
    p_before_id: beforeId ?? null,
  });
  if (error) throw error;
  // Server liefert absteigend; für UI (inverted FlatList) kannst du absteigend lassen
  return (data ?? []) as any[];
}

export async function sendMessageRpc(channelId: string, body: string, clientId: string, meta: any = {}) {
  const { data, error } = await supabase.rpc('send_message_rpc', {
    p_channel_id: channelId,
    p_body: body,
    p_client_id: clientId,
    p_meta: meta,
  });
  if (error) throw error;
  return data as string;
}

export async function markRead(channelId: string) {
  const { error } = await supabase.rpc('mark_read_rpc', { p_channel_id: channelId });
  if (error) throw error;
}

export async function updateChannelCategory(channelId: string, newCategory: string) {
  if (!ALLOWED_CATEGORIES.includes(newCategory as AllowedCategory)) {
    throw new Error(`Invalid category: ${newCategory}`);
  }

  // return updated row incl. updated_at → helps “apply-if-newer”
  const { data, error } = await supabase
    .from('channels')
    .update({ custom_category: newCategory })
    .eq('id', channelId)
    .select('id, custom_category, updated_at')
    .single();

  if (error) throw error;
  return data as { id: string; custom_category: string; updated_at: string };
}

export async function markReadLocal(channelId: string, ts?: number) {
  const db = getDB();
  const now = ts ?? Date.now();
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;
  if (!uid) return;

  await db.runAsync(
    `update channel_members_local
        set last_read_at = ?
      where channel_id = ? and user_id = ?`,
    [now, channelId, uid]
  );

  // Optional: wenn kein Row existiert (Edge-Case nach Migration)
  await db.runAsync(
    `insert into channel_members_local (channel_id, user_id, role, muted, joined_at, last_read_at)
     select ?, ?, 'member', 0, ?, ?
     where not exists (select 1 from channel_members_local where channel_id=? and user_id=?)`,
    [channelId, uid, now, now, channelId, uid]
  );
}

export async function setChannelMeta(
  channelId: string,
  meta: { custom_type?: string; custom_category?: string; meta?: any } = {}
) {
  const { error } = await supabase.rpc('upsert_channel_meta', {
    p_channel_id: channelId,
    p_custom_type: meta.custom_type ?? null,
    p_custom_category: meta.custom_category ?? null,
    p_meta: meta.meta ?? null,
  });
  if (error) throw error;
}