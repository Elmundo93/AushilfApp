// components/stores/useChannelLocalStore.ts
import { create } from 'zustand';
import type { ChannelRow } from '@/components/types/chat';
import { getDB } from '@/components/Crud/SQLite/bridge';
import { syncChannelsOnce } from '@/components/services/Chat/chatSync';
import { subscribeChannels, type ChannelEvent, type ChannelRowLocal } from '@/components/services/Chat/chatRealtime';

type State = {
  channels: ChannelRow[];
  loading: boolean;
  initialized: boolean;
  activeChannelId: string | null;
};

type Actions = {
  setActiveChannelId: (id: string | null) => void;
  loadLocal: () => Promise<void>;
  syncOnce: () => Promise<void>;
  startRealtime: () => () => void;
  // snappy:
  upsertFromRealtime: (row: ChannelRowLocal) => void;
  removeFromRealtime: (id: string) => void;
  setInitialized: (initialized: boolean) => void;
  setChannels: (channels: ChannelRow[]) => void;
};

function compareChannels(a: ChannelRow, b: ChannelRow) {
  // ORDER BY (last_message_at IS NULL), last_message_at DESC
  const aNull = a.last_message_at == null ? 1 : 0;
  const bNull = b.last_message_at == null ? 1 : 0;
  if (aNull !== bNull) return aNull - bNull; // 0 (has ts) before 1 (null)
  const aTs = a.last_message_at ?? 0;
  const bTs = b.last_message_at ?? 0;
  return bTs - aTs;
}

export const useChannelLocalStore = create<State & Actions>((set, get) => ({
  channels: [],
  loading: false,
  initialized: false,
  activeChannelId: null,

  setActiveChannelId: (id) => set({ activeChannelId: id }),

  loadLocal: async () => {
    const db = getDB();
    set({ loading: true });
    const rows = await db.getAllAsync<ChannelRow>(
      `select id, custom_type, custom_category, updated_at, last_message_at, last_message_text, last_sender_id, meta
         from channels_local
       order by (last_message_at is null), last_message_at desc`
    );
    set({ channels: rows, loading: false, initialized: true });
  },

  syncOnce: async () => {
    await syncChannelsOnce();
    await get().loadLocal();
  },

  // snappy upsert (ohne Full-Reload)
  upsertFromRealtime: (row) => {
    set((state) => {
      const idx = state.channels.findIndex((c) => c.id === row.id);
      const next: ChannelRow = {
        id: row.id,
        custom_type: row.custom_type,
        custom_category: row.custom_category,
        updated_at: row.updated_at,
        last_message_at: row.last_message_at,
        last_message_text: row.last_message_text,
        last_sender_id: row.last_sender_id,
        meta: row.meta, // als JSON-string lokal ok; dein Typ erlaubt string | json später
      } as any;

      let channels: ChannelRow[];
      if (idx === -1) {
        channels = [next, ...state.channels];
      } else {
        channels = state.channels.slice();
        channels[idx] = next;
      }
      channels.sort(compareChannels);
      return { channels };
    });
  },

  // snappy remove
  removeFromRealtime: (id) => {
    set((state) => {
      const channels = state.channels.filter((c) => c.id !== id);
      return { channels };
    });
  },

  startRealtime: () => {
    const unsub = subscribeChannels((row, event: ChannelEvent) => {
      if (event === 'DELETE') {
        get().removeFromRealtime(row.id);
      } else {
        get().upsertFromRealtime(row);
      }
    });
    return unsub;
  },
  setInitialized: (initialized: boolean) => set({ initialized }),
  setChannels: (channels: ChannelRow[]) => set({ channels }),
}));

