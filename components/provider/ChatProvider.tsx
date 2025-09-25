// components/services/Chat/ChatProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AppState } from 'react-native';
import { supabase } from '@/components/config/supabase';
import { getDB } from '@/components/Crud/SQLite/bridge';
import { liveBus, TOPIC } from '@/components/lib/liveBus';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { syncChannelsOnce, backfillMessages } from '@/components/services/Chat/chatSync';

type Ctx = {
  ready: boolean;
  memberChannelIds: Set<string>;
  unreadByChannel: Record<string, number>;
  refreshNow(): Promise<void>;
};

const ChatCtx = createContext<Ctx | null>(null);
export const useChat = () => {
  const v = useContext(ChatCtx);
  if (!v) throw new Error('useChat must be used within <ChatProvider/>');
  return v;
};

async function fetchMemberChannelIds(uid: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('channel_members')
    .select('channel_id')
    .eq('user_id', uid);
  if (error) throw error;
  return (data ?? []).map((r: any) => r.channel_id);
}

async function mirrorMembershipLocal(uid: string, channelIds: string[]) {
  const db = getDB();
  await db.execAsync('BEGIN');
  try {
    await db.runAsync(`delete from channel_members_local where user_id = ?`, [uid]);
    const now = Date.now();
    for (const cid of channelIds) {
      await db.runAsync(
        `insert or replace into channel_members_local (channel_id, user_id, role, muted, joined_at)
         values (?, ?, 'member', 0, ?)`,
        [cid, uid, now],
      );
    }
    await db.execAsync('COMMIT');
  } catch (e) {
    await db.execAsync('ROLLBACK');
    throw e;
  }
}

async function computeUnread(currentUserId: string): Promise<Record<string, number>> {
  const db = getDB();
  // Unread = msgs im Channel mit created_at > last_read_at, die NICHT vom aktuellen User stammen
  const rows = await db.getAllAsync<{ channel_id: string; unread: number }>(
    `
    with lr as (
      select channel_id, coalesce(last_read_at, 0) as last_read_at
      from channel_members_local
      where user_id = ?
    )
    select m.channel_id, count(*) as unread
      from messages_local m
      join lr on lr.channel_id = m.channel_id
     where m.created_at > lr.last_read_at
       and m.sender_id != ?
     group by m.channel_id
    `,
    [currentUserId, currentUserId]
  );
  const out: Record<string, number> = {};
  for (const r of rows) out[r.channel_id] = Number(r.unread) || 0;
  return out;
}

type SubRefs = { membership?: RealtimeChannel | null; channels?: RealtimeChannel | null; messages?: RealtimeChannel | null; };

export function ChatProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [memberChannelIds, setMemberChannelIds] = useState<Set<string>>(new Set());
  const [unreadByChannel, setUnreadByChannel] = useState<Record<string, number>>({});
  const subs = useRef<SubRefs>({});
  const uidRef = useRef<string | null>(null);
  const db = getDB();

  // UID laden
  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!cancel) uidRef.current = data.user?.id ?? null;
    })();
    return () => { cancel = true; };
  }, []);

  // Re-subscribe helper
  const resubscribe = async (ids: string[], currentUserId: string) => {
    // cleanup
    for (const k of Object.keys(subs.current) as (keyof SubRefs)[]) {
      try { subs.current[k]?.unsubscribe(); } catch {}
      subs.current[k] = null;
    }
    if (!ids.length) { setReady(true); return; }

    const list = ids.join(',');

    // Channels Preview
    subs.current.channels = supabase
      .channel(`ch:channels:in:${Date.now()}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'channels', filter: `id=in.(${list})`
      }, async (payload: any) => {
        if (payload.eventType === 'DELETE') {
          const id = payload.old?.id;
          if (id) await db.runAsync(`delete from channels_local where id=?`, [id]);
          liveBus.emit(TOPIC.CHANNELS);
          return;
        }
        const c = payload.new;
        await db.runAsync(
          `insert or replace into channels_local
           (id, custom_type, custom_category, updated_at, last_message_at, last_message_text, last_sender_id, meta)
           values (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.id,
            c.custom_type ?? null,
            c.custom_category ?? null,
            new Date(c.updated_at).getTime(),
            c.last_message_at ? new Date(c.last_message_at).getTime() : null,
            c.last_message_text ?? null,
            c.last_sender_id ?? null,
            typeof c.meta === 'string' ? (c.meta || '{}') : JSON.stringify(c.meta ?? {}),
          ],
        );
        liveBus.emit(TOPIC.CHANNELS);
      })
      .subscribe();

    // Messages aller Member-Channels
    subs.current.messages = supabase
      .channel(`ch:messages:in:${Date.now()}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'messages', filter: `channel_id=in.(${list})`
      }, async () => {
        liveBus.emit(TOPIC.MESSAGES('*'));
        setUnreadByChannel(await computeUnread(currentUserId));
      })
      .subscribe();

    setReady(true);
  };

  // RefreshNow = Boot-Strap + lokale Spiegel + gezielte Subs
  const refreshNow = async () => {
    const uid = uidRef.current;
    if (!uid) return;

    const ids = await fetchMemberChannelIds(uid);
    await mirrorMembershipLocal(uid, ids);
    await syncChannelsOnce(); // nutzt jetzt serverseitig: nur eigene Channels
    setMemberChannelIds(new Set(ids));
    setUnreadByChannel(await computeUnread(uid));
    await resubscribe(ids, uid);
  };

  // Initial
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let i = 0; i < 60 && !uidRef.current && !cancelled; i++) await new Promise(r => setTimeout(r, 50));
      if (cancelled || !uidRef.current) return;
      await refreshNow();
    })();
    return () => { cancelled = true; for (const k of Object.keys(subs.current) as (keyof SubRefs)[]) { try { subs.current[k]?.unsubscribe(); } catch {} subs.current[k] = null; } };
  }, []);

  // Mitgliedschaften Realtime (damit Set dynamisch bleibt)
  useEffect(() => {
    let membershipSub: RealtimeChannel | null = null;
    (async () => {
      if (!uidRef.current) return;
      membershipSub = supabase
        .channel(`ch:members:${uidRef.current}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'channel_members', filter: `user_id=eq.${uidRef.current}` }, async () => {
          await refreshNow();
        })
        .subscribe();
    })();
    return () => { try { membershipSub?.unsubscribe(); } catch {} };
  }, []);

  // App-Focus: Catchup
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (s) => {
      if (s === 'active') { try { await refreshNow(); } catch {} }
    });
    return () => sub.remove();
  }, []);

  const value = useMemo<Ctx>(() => ({
    ready, memberChannelIds, unreadByChannel, refreshNow,
  }), [ready, memberChannelIds, unreadByChannel]);

  return <ChatCtx.Provider value={value}>{children}</ChatCtx.Provider>;
}