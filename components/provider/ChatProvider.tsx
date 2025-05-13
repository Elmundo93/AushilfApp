// components/provider/ChatProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import {  Channel, FormatMessageResponse, Event, DefaultGenerics } from 'stream-chat';
import NetInfo from '@react-native-community/netinfo';
import { useSQLiteContext } from 'expo-sqlite';
import { AppState } from 'react-native';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useChannelServices } from '@/components/Crud/SQLite/Services/channelServices';
import {
  useMessagesService,
  StoredMessage,
} from '@/components/Crud/SQLite/Services/messagesService';
import { ChatMessage, StoredChannel } from '@/components/types/stream';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';

interface ChatContextType {
  channels: StoredChannel[];
  activeMessages: ChatMessage[];
  loading: boolean;
  sendMessage: (cid: string, text: string) => Promise<void>;
  loadMoreMessages: (cid: string, limit?: number) => Promise<void>;
  syncChannels: () => Promise<void>;
  getMessages: (cid: string) => Promise<StoredMessage[]>;
  syncMessagesForChannel: (cid: string, initialLimit?: number) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  channels: [],
  activeMessages: [],
  loading: false,
  sendMessage: async () => {},
  loadMoreMessages: async () => {},
  syncChannels: async () => {},
  getMessages: async () => [],
  syncMessagesForChannel: async () => {},
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }: PropsWithChildren<{}>) => {
  const { user, streamChatClient } = useAuthStore();
  const db = useSQLiteContext();

  const {
    setCid,
    setMessages: setActiveMessages,
    messages: activeMessages,
    cid: activeCid,
  } = useActiveChatStore();

  const {
    mapChannelToDbValues,
    saveChannelsToDb,
    getChannelsFromDb,
  } = useChannelServices();

  const {
    mapMessageToDbValues,
    saveMessagesToDb,
    getMessagesForChannel,
  } = useMessagesService(db);

  const channels = useStreamChatStore((s) => s.channels);
  const setZustandChannels = useStreamChatStore((s) => s.setChannels);
  const setChannelsReady = useStreamChatStore((s) => s.setChannelsReady);
  const setStoreLoading = useStreamChatStore((s) => s.setLoading);

  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Helper: single‐row upsert without transaction
  const insertMessageLocally = async (msg: StoredMessage) => {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO messages_fetched (
          id, cid, sender_id, sender_vorname, sender_nachname,
          sender_image, content, created_at, read
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        Object.values(msg)
      );
    } catch (e) {
      console.error('❌ Insert message failed:', e);
    }
  };

  const upsertChannelLocally = async (channel: Channel) => {
    try {
      const vals = mapChannelToDbValues(channel);
      await db.runAsync(
        `INSERT OR REPLACE INTO channels_fetched (
          cid, channel_id, channel_type, custom_post_category,
          custom_post_id, custom_post_user_id, custom_user_vorname,
          custom_user_nachname, custom_user_profileImage, custom_user_userBio,
          last_message_text, last_message_at, updated_at, created_at,
          unread_count, partner_user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        Object.values(vals)
      );
    } catch (e) {
      console.error('❌ Upsert channel failed:', e);
    }
  };

  // Re‐sync channel list on reconnect or focus
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) syncChannels();
    });
    return () => unsub();
  }, [streamChatClient]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') syncChannels();
    });
    return () => sub.remove();
  }, []);

  // Real‐time subscription: new messages & channel updates
  useEffect(() => {
    if (!streamChatClient) return;
  
    const handleNewMessage = async (event: Event<DefaultGenerics>) => {
      try {
        const msg = event.message as unknown as FormatMessageResponse;
        const [type, id] = event.cid?.split(':') || [];
        const channel = streamChatClient.channel(type, id);
  
        // 1) map & persist
        const stored = await mapMessageToDbValues(msg, channel);
        await insertMessageLocally(stored);
  
        // 2) append only if this channel is open, but skip dupes & keep chronological order
        if (event.cid === activeCid) {
          setActiveMessages((prev) => {
            if (prev.some((m) => m.id === stored.id)) return prev;
            const next = [...prev, stored as unknown as ChatMessage];
            next.sort((a, b) =>
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            return next;
          });
        }
  
        // 3) update your channel list preview in SQLite + Zustand store
        await upsertChannelLocally(channel);
        const localChs = await getChannelsFromDb(db);
        setZustandChannels(localChs);
      } catch (e) {
        console.error('Subscription New Message Error:', e);
      }
    };
  
    const handleChannelUpdate = async (event: Event) => {
      try {
        const channel = event.channel as unknown as Channel;
        await upsertChannelLocally(channel);
        const localChs = await getChannelsFromDb(db);
        setZustandChannels(localChs);
      } catch (e) {
        console.error('Subscription Channel Update Error:', e);
      }
    };
  
    const subNew = streamChatClient.on('message.new', handleNewMessage);
    const subUpd = streamChatClient.on('channel.updated', handleChannelUpdate);
  
    return () => {
      subNew.unsubscribe();
      subUpd.unsubscribe();
    };
  }, [streamChatClient, activeCid]);

  const syncChannels = async () => {
    if (!streamChatClient || !user) return;
    setLoading(true);
    setStoreLoading(true);
    try {
      const filters = { type: 'messaging', members: { $in: [streamChatClient.userID!] } };
      const serverChannels = await streamChatClient.queryChannels(filters, { last_message_at: -1 });

      await saveChannelsToDb(db, serverChannels);
      const localChs = await getChannelsFromDb(db);
      setZustandChannels(localChs);
      setChannelsReady(true);
    } catch (e) {
      console.error('Chat Sync Error:', e);
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  };
  const syncMessagesForChannel = async (cid: string, initialLimit = 30) => {
    if (!streamChatClient || !user) return;
    setCid(cid);
    setLoading(true);
    setStoreLoading(true);
  
    try {
      const [type, id] = cid.split(':');
      const channel = streamChatClient.channel(type, id);
  
      const res = await channel.query({
        messages: { limit: initialLimit },
      });
  
      const msgs = res.messages;
      const mapped = await Promise.all(
        msgs.map((m) => mapMessageToDbValues(m as unknown as FormatMessageResponse, channel))
      );
  
      await saveMessagesToDb(mapped);
  
      const loaded = await getMessagesForChannel(cid, initialLimit, 0);
      setActiveMessages(loaded as ChatMessage[]);
  
      // ✅ Mark messages as read
      await channel.markRead();
  
    } catch (e) {
      console.error('Message Sync Error:', e);
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  };

  const sendMessage = async (cid: string, text: string) => {
    if (!streamChatClient || !user) return;
    const [type, id] = cid.split(':');
    const channel = streamChatClient.channel(type, id);
  
    const tempId = `temp-${Date.now()}`;
    const temp: StoredMessage = {
      id: tempId,
      cid,
      sender_id: streamChatClient.userID!,
      sender_vorname: user.vorname,
      sender_nachname: user.nachname,
      sender_image: user.profileImageUrl || '',
      content: text,
      created_at: new Date().toISOString(),
      read: 0,
    };
  
 
    setActiveMessages((prev) => [temp as unknown as ChatMessage, ...prev]);
  
    try {
      const res = await channel.sendMessage({ text });
      const stored = await mapMessageToDbValues(
        res.message as unknown as FormatMessageResponse,
        channel
      );
  
      await insertMessageLocally(stored);
  
      setActiveMessages((prev) => {
        const filtered = prev.filter(m => m.id !== tempId && m.id !== stored.id);
        return [stored as unknown as ChatMessage, ...filtered];
      });
    } catch (e) {
      console.error('Send Message Error:', e);
    }
  };

  const loadMoreMessages = async (cid: string, limit = 20) => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const offset = activeMessages.length;
      const older = await getMessagesForChannel(cid, limit, offset);
      setActiveMessages((prev) => [...(older as ChatMessage[]), ...prev]);
    } catch (e) {
      console.error('Load More Error:', e);
    } finally {
      setIsFetchingMore(false);
    }
  };
  const getMessages = (cid: string) => getMessagesForChannel(cid);

  return (
    <ChatContext.Provider
      value={{
        channels,
        activeMessages,
        loading,
        sendMessage,
        loadMoreMessages,
        syncChannels,
        getMessages,
        syncMessagesForChannel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};