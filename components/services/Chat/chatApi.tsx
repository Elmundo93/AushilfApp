// components/services/Chat/chatApi.ts
import { supabase } from '@/components/config/supabase';

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

/** Basis: Liste der Channels inkl. Preview-Felder */
export async function fetchChannelPage(limit = 100) {
  const { data, error } = await supabase
    .from('channels')
    .select('id, custom_type, custom_category, updated_at, last_message_at, last_message_text, last_sender_id, meta')
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
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