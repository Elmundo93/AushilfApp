import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getDB } from '@/components/Crud/SQLite/bridge';
import { backfillMessages } from '@/components/services/Chat/chatSync';
import { uploadOutbox } from '@/components/services/Chat/chatOutbox';
import { subscribeChannels } from '@/components/services/Chat/chatRealtime';
import { supabase } from '@/components/config/supabase';

type LocalMsg = {
  id: string;
  channel_id: string;
  sender_id: string;
  body: string;
  created_at: number; // ms epoch
  // ... weitere Felder optional
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
    };
  }, [channelId, readLocal]);

  // Realtime-Subscribe (nur dieser Channel)
  useEffect(() => {
    const unsub = subscribeChannels(async (m: any) => {
      // throttle: nur aktualisieren, wenn sich wirklich was geändert hat
      const updated = await readLocal();
      const newLastId = updated.length ? updated[updated.length - 1].id : null;
      if (newLastId !== lastMsgIdRef.current) {
        lastMsgIdRef.current = newLastId;
        setMessages(updated);
        lastTsRef.current = updated.length ? updated[updated.length - 1].created_at : null;
      }
    });
    return () => { unsub(); };
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