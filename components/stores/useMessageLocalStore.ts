import { create } from 'zustand';
import type { MessageRow } from '@/components/types/chat';
import { getDB } from '@/components/Crud/SQLite/bridge';
import { backfillMessages, loadOlderMessages } from '@/components/services/Chat/chatSync';
import { subscribeChannels } from '@/components/services/Chat/chatRealtime';
import { uploadOutbox } from '@/components/services/Chat/chatOutbox';
import { markRead } from '@/components/services/Chat/chatApi';

type State = {
  channelId: string | null;
  messages: MessageRow[];
  loading: boolean;
  hasMore: boolean;
};

type Actions = {
  initChannel: (channelId: string) => Promise<void>;
  loadOlder: (limit?: number) => Promise<number>; // returns loaded count
  sendTick: (currentUserId: string) => Promise<void>;
  markAsRead: () => Promise<void>;
  stopRealtime: () => void;
  setChannelId: (channelId: string | null) => void;
  setMessages: (messages: MessageRow[]) => void;
};

let currentUnsub: (() => void) | null = null;

export const useMessageLocalStore = create<State & Actions>((set, get) => ({
  channelId: null,
  messages: [],
  loading: false,
  hasMore: true,

  initChannel: async (channelId) => {
    const db = getDB();
    if (currentUnsub) { currentUnsub(); currentUnsub = null; }

    set({ channelId, loading: true, hasMore: true });

    const readLocalAsc = async () =>
      await db.getAllAsync<MessageRow>(
        `select * from messages_local where channel_id = ? order by created_at asc, id asc`,
        [channelId]
      );

    const local = await readLocalAsc();
    set({ messages: local });

    const lastTs = local.length ? local[local.length - 1].created_at : undefined;
    await backfillMessages(channelId, lastTs);
    const after = await readLocalAsc();
    set({ messages: after, loading: false });

    // Realtime only for this channel
    currentUnsub = subscribeChannels(async () => {
      set({ messages: await readLocalAsc() });
    });
  },

  loadOlder: async (limit = 50) => {
    const { channelId, messages, hasMore } = get();
    if (!channelId || !hasMore) return 0;

    // Ältestes Element im Array (weil aufsteigend sortiert)
    const oldest = messages[0];
    const beforeCreated = oldest ? oldest.created_at : undefined;
    const beforeId = oldest ? oldest.id : undefined;

    const page = await loadOlderMessages(channelId, beforeCreated, beforeId, limit);
    const loaded = page.length;

    if (loaded === 0) {
      set({ hasMore: false });
      return 0;
    }

    // Lokale Liste neu lesen – konsistent
    const db = getDB();
    const updated = await db.getAllAsync<MessageRow>(
      `select * from messages_local where channel_id = ? order by created_at asc, id asc`,
      [channelId]
    );

    set({
      messages: updated,
      hasMore: loaded >= limit, // wenn weniger als limit, wahrscheinlich Ende erreicht
    });

    return loaded;
  },

  sendTick: async (currentUserId: string) => {
    await uploadOutbox(currentUserId);
  },

  markAsRead: async () => {
    const cid = get().channelId;
    if (cid) await markRead(cid);
  },

  stopRealtime: () => {
    if (currentUnsub) { currentUnsub(); currentUnsub = null; }
  },

  setChannelId: (channelId) => set({ channelId }),
  setMessages: (messages) => set({ messages }),
}));