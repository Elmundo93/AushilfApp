// provider/ChatProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useSQLiteContext } from 'expo-sqlite';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { ChatMessage, StoredChannel } from '@/components/types/stream';
import { useChannelSync } from '@/components/services/Storage/Syncs/ChannelSync';
import { useMessageSync } from '@/components/services/Storage/Syncs/useMessageSync';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { useChannelServices } from '@/components/Crud/SQLite/Services/channelServices';
import { useChatLifecycle } from '@/components/services/Storage/Hooks/useChatLifecycle';
import { useChatListeners } from '@/components/services/Storage/Hooks/useChatListener';
import { useSendMessage } from '@/components/services/Storage/Hooks/useSendMessage';

interface ChatContextType {
  channels: StoredChannel[];
  activeMessages: ChatMessage[];
  loading: boolean;
  sendMessage: (cid: string, text: string) => Promise<void>;
  loadMoreMessages: (cid: string, limit?: number) => Promise<any[]>;
  syncChannels: () => Promise<void>;
  getMessages: (cid: string) => Promise<any[]>;
  syncMessagesForChannel: (cid: string, initialLimit?: number) => Promise<void>;
  deleteChannel: (cid: string) => Promise<void>;
  blockUser: (userId: string, reason?: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  channels: [],
  activeMessages: [],
  loading: false,
  sendMessage: async () => {},
  loadMoreMessages: async () => [],
  syncChannels: async () => {},
  getMessages: async () => [],
  syncMessagesForChannel: async () => {},
  deleteChannel: async () => {},
  blockUser: async () => {},
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

  const channels = useStreamChatStore((s) => s.channels);
  const setZustandChannels = useStreamChatStore((s) => s.setChannels);
  const setChannelsReady = useStreamChatStore((s) => s.setChannelsReady);
  const setStoreLoading = useStreamChatStore((s) => s.setLoading);

  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const syncChannels = useChannelSync();
  const syncMessagesRaw = useMessageSync();
  const { getMessagesForChannel } = useMessagesService(db);
  const sendMessageRaw = useSendMessage(db);
  const { getChannelsFromDb } = useChannelServices();

  useChatLifecycle(user?.id, db);
  useChatListeners(streamChatClient, activeCid, setActiveMessages, setZustandChannels, db, user, activeMessages);

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

  const syncMessagesForChannel = async (cid: string, limit = 30) => {
    if (!streamChatClient || !user) return;
    setCid(cid);
    setLoading(true);
    setStoreLoading(true);
    try {
      const loaded = await syncMessagesRaw(cid, limit);
      setActiveMessages(loaded as ChatMessage[]);
      const [type, id] = cid.split(':');
      await streamChatClient.channel(type, id).markRead();
    } catch (e) {
      console.error('Message Sync Error:', e);
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  };

  const sendMessage = async (cid: string, text: string) => {
    const tempId = `temp-${Date.now()}`;
    const temp: ChatMessage = {
      id: tempId,
      cid,
      sender_id: streamChatClient?.userID || '',
      sender_vorname: user?.vorname || '',
      sender_nachname: user?.nachname || '',
      sender_image: user?.profileImageUrl || '',
      content: text,
      created_at: new Date().toISOString(),
      read: 0,
    };
    setActiveMessages((prev) => [temp, ...prev]);
    await sendMessageRaw(cid, text, tempId, setActiveMessages, activeMessages);
  };

  const loadMoreMessages = async (cid: string, limit = 20) => {
    if (isFetchingMore) return [];
    setIsFetchingMore(true);
    try {
      const offset = activeMessages.length;
      const older = await getMessagesForChannel(cid, limit, offset);
      setActiveMessages((prev) => [...(older as ChatMessage[]), ...prev]);
      return older;
    } catch (e) {
      console.error('Load More Error:', e);
      return [];
    } finally {
      setIsFetchingMore(false);
    }
  };

  const getMessages = (cid: string) => getMessagesForChannel(cid);

  const deleteChannel = async (cid: string) => {
    if (!streamChatClient) return;
    const [type, id] = cid.split(':');
    const channel = streamChatClient.channel(type, id);

    try {
      await channel.delete();
      await db.runAsync('DELETE FROM channels_fetched WHERE cid = ?', [cid]);
      await db.runAsync('DELETE FROM messages_fetched WHERE cid = ?', [cid]);

      const localChs = await getChannelsFromDb(db, user?.id ?? '');
      setZustandChannels(localChs);

      if (activeCid === cid) {
        setCid(null);
        setActiveMessages([]);
      }
    } catch (err) {
      console.error('❌ Fehler beim Löschen des Channels:', err);
    }
  };

  const blockUser = async (userId: string, reason = 'Verstoß gegen Regeln') => {
    if (!streamChatClient) return;
    try {
      await streamChatClient.banUser(userId, { reason, timeout: 0 });
    } catch (err) {
      console.error('❌ Fehler beim Blockieren des Nutzers:', err);
    }
  };

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
        deleteChannel,
        blockUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};