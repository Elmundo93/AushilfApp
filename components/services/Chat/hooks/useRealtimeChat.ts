// components/services/Chat/hooks/useRealtimeChat.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getDB } from '@/components/Crud/SQLite/bridge';
import { backfillMessages } from '@/components/services/Chat/chatSync';
import { uploadOutbox } from '@/components/services/Chat/chatOutbox';
import { supabase } from '@/components/config/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

type LocalMsg = {
  id: string;
  channel_id: string;
  sender_id: string;
  body: string;
  created_at: number; 
};

export function useRealtimeChat(channelId: string) {
  const db = getDB();
  const [messages, setMessages] = useState<LocalMsg[]>([]);
  const lastTsRef = useRef<number | null>(null);
  const lastMsgIdRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<'active' | 'background' | 'inactive'>('active');
  const isMountedRef = useRef(true);
  const uidRef = useRef<string | null>(null);
  const subRef = useRef<RealtimeChannel | null>(null);

  // effiziente Read-Funktion (stabil durch useCallback)
  const readLocal = useCallback(async () => {
    const rows = await db.getAllAsync<LocalMsg>(
      `select * from messages_local where channel_id = ? order by created_at asc`,
      [channelId]
    );
    return rows;
  }, [db, channelId]);

  // Einmal UID laden & cachen
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && !cancelled) {
        uidRef.current = data.user?.id ?? null;
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Initial backfill + lokaler Load
  useEffect(() => {
    isMountedRef.current = true;

    (async () => {
      const local = await readLocal();
      if (!isMountedRef.current) return;

      setMessages(local);
      lastTsRef.current = local.length ? local[local.length - 1].created_at : null;
      lastMsgIdRef.current = local.length ? local[local.length - 1].id : null;

      await backfillMessages(channelId, lastTsRef.current ?? undefined);
      if (!isMountedRef.current) return;

      const updated = await readLocal();
      setMessages(updated);
      lastTsRef.current = updated.length ? updated[updated.length - 1].created_at : null;
      lastMsgIdRef.current = updated.length ? updated[updated.length - 1].id : null;
    })();

    return () => {
      isMountedRef.current = false;
      if (subRef.current) {
        try { subRef.current.unsubscribe(); } catch {}
        subRef.current = null;
      }
    };
  }, [channelId, readLocal]);

  // Realtime-Subscribe (nur dieser Channel) — dedupe + sauberes Cleanup
  useEffect(() => {
    // bei Channel-Wechsel: alte Subscription aufräumen
    if (subRef.current) {
      try { subRef.current.unsubscribe(); } catch {}
      subRef.current = null;
    }
    if (!channelId) return;

    const channel = supabase.channel(`realtime:messages:${channelId}`);

    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` },
      async (payload: any) => {
        if (!isMountedRef.current) return;
        const newId = payload?.new?.id as string | undefined;
        if (newId && newId === lastMsgIdRef.current) return; // keine unnötigen Reloads

        // Nur nachladen, wenn sich wirklich etwas geändert hat
        const updated = await readLocal();
        const newLastId = updated.length ? updated[updated.length - 1].id : null;
        if (newLastId !== lastMsgIdRef.current) {
          lastMsgIdRef.current = newLastId;
          setMessages(updated);
          lastTsRef.current = updated.length ? updated[updated.length - 1].created_at : null;
        }
      }
    );

    channel.subscribe((status) => {
      // Optional: könnte hier ein initiales Delta-Pull auslösen
      // if (status === 'SUBSCRIBED') { /* no-op */ }
    });

    subRef.current = channel;

    return () => {
      try { channel.unsubscribe(); } catch {}
      if (subRef.current === channel) subRef.current = null;
    };
  }, [channelId, readLocal]);

  // Outbox-Loop: nur im Vordergrund, UID gecached
  useEffect(() => {
    const start = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(async () => {
        if (appStateRef.current !== 'active') return;
        const uid = uidRef.current;
        if (!uid) return; // UID noch nicht da
        await uploadOutbox(uid);
      }, 5000);
    };

    const stop = () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    // AppState steuern
    const sub = AppState.addEventListener('change', (state) => {
      appStateRef.current = state as any;
      if (state === 'active') start(); else stop();
    });

    // beim Mount in den aktiven Zustand
    start();

    return () => {
      sub.remove();
      stop();
    };
  }, []);

  return { messages };
}