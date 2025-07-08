// provider/ChatProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
  useCallback,
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
  hasMoreMessages: boolean;
  sendMessage: (cid: string, text: string) => Promise<void>;
  loadMoreMessages: (cid: string, limit?: number) => Promise<any[]>;
  syncChannels: () => Promise<void>;
  getMessages: (cid: string) => Promise<any[]>;
  syncMessagesForChannel: (cid: string, initialLimit?: number) => Promise<void>;
  deleteChannel: (cid: string) => Promise<void>;
  blockUser: (userId: string, reason?: string) => Promise<void>;
  markChannelAsRead: (cid: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  channels: [],
  activeMessages: [],
  loading: false,
  hasMoreMessages: true,
  sendMessage: async () => {},
  loadMoreMessages: async () => [],
  syncChannels: async () => {},
  getMessages: async () => [],
  syncMessagesForChannel: async () => {},
  deleteChannel: async () => {},
  blockUser: async () => {},
  markChannelAsRead: async () => {},
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }: PropsWithChildren<{}>) => {
  const { user, streamChatClient } = useAuthStore();
  const db = useSQLiteContext();

  const {
    setCid,
    messages: activeMessages,
    cid: activeCid,
    loading,
    hasMoreMessages,
    addMessage,
    addMessages,
    updateMessage,
    removeMessage,
    setLoading,
    setHasMoreMessages,
    clearMessages,
  } = useActiveChatStore();

  const channels = useStreamChatStore((s) => s.channels);
  const setZustandChannels = useStreamChatStore((s) => s.setChannels);
  const setChannelsReady = useStreamChatStore((s) => s.setChannelsReady);
  const setStoreLoading = useStreamChatStore((s) => s.setLoading);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const syncChannels = useChannelSync();
  const syncMessagesRaw = useMessageSync();
  const { getMessagesForChannel } = useMessagesService(db);
  const sendMessageRaw = useSendMessage(db);
  const { getChannelsFromDb } = useChannelServices();

  useChatLifecycle(user?.id, db);
  useChatListeners(streamChatClient, activeCid, addMessage, setZustandChannels, db, user, activeMessages);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        console.log('🌐 Network connected, triggering channel sync');
        syncChannels();
      }
    });
    return () => unsub();
  }, [streamChatClient]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        console.log('📱 App became active, triggering channel sync');
        syncChannels();
      }
    });
    return () => sub.remove();
  }, []);

  const syncMessagesForChannel = useCallback(async (cid: string, limit = 30) => {
    if (!streamChatClient || !user) {
      console.warn('❌ StreamChatClient oder User nicht verfügbar');
      return;
    }
    
    console.log('🔄 Starting message sync for channel:', cid);
    
    // Check if we're already loading this channel
    const currentCid = useActiveChatStore.getState().cid;
    const currentMessages = useActiveChatStore.getState().messages;
    
    console.log('🔍 Current state:', { currentCid, messageCount: currentMessages.length });
    
    // Only clear messages if we're switching to a different channel
    if (currentCid !== cid) {
      console.log('🔄 Switching to different channel, clearing messages');
      clearMessages();
    } else {
      console.log('ℹ️ Same channel, keeping existing messages');
    }
    
    setCid(cid);
    setLoading(true);
    setStoreLoading(true);
    
    try {
      // GetStream.io Best Practice: Parse channel ID properly
      const [type, id] = cid.split(':');
      if (!type || !id) {
        throw new Error(`Invalid channel CID format: ${cid}`);
      }
      
      console.log('🔧 Creating channel object for:', { type, id });
      
      // GetStream.io Best Practice: Create channel object
      const channel = streamChatClient.channel(type, id);
      
      // GetStream.io Best Practice: Initialize channel if needed
      if (!channel.initialized) {
        console.log('🔄 Channel not initialized, calling watch()...');
        await channel.watch();
        console.log('✅ Channel initialized successfully');
      } else {
        console.log('ℹ️ Channel already initialized');
      }
      
      // GetStream.io Best Practice: Query messages with proper parameters
      console.log('📥 Querying messages with limit:', limit);
      const { messages } = await channel.query({ 
        messages: { limit },
        watch: false // Don't watch again, we already did
      });
      
      console.log('📊 Raw messages received:', messages.length);
      
      // Transform messages following GetStream.io structure
      const transformed = messages.map((msg: any) => ({
        id: msg.id || '',
        cid,
        sender_id: msg.user?.id || '',
        sender_vorname: msg.user?.vorname || msg.user?.name?.split(' ')[0] || '',
        sender_nachname: msg.user?.nachname || msg.user?.name?.split(' ').slice(1).join(' ') || '',
        sender_image: msg.user?.image || '',
        content: msg.text || '',
        created_at: msg.created_at || '',
        read: (msg.read_by as Array<{ id: string }>)?.some(u => u.id === streamChatClient.userID) ? 1 : 0,
        post_category: msg.custom_post_category || '',
        post_option: msg.custom_post_option || '',
        post_vorname: msg.custom_post_vorname || '',
        post_nachname: msg.custom_post_nachname || '',
        post_image: msg.custom_post_profileImage || '',
        custom_type: msg.custom_type || 'message',
      }));
      
      console.log('🔄 Transformed messages:', transformed.length);
      
      if (transformed.length > 0) {
        console.log('✅ Loaded messages:', transformed.length);
        addMessages(transformed as ChatMessage[]);
        setHasMoreMessages(transformed.length >= limit);
        
        // Log final message count
        const finalMessages = useActiveChatStore.getState().messages;
        console.log('📊 Final message count in store:', finalMessages.length);
      } else {
        console.log('ℹ️ No messages loaded for channel:', cid);
        setHasMoreMessages(false);
      }
      
      // GetStream.io Best Practice: Mark channel as read
      console.log('📖 Marking channel as read...');
      await channel.markRead();
      console.log('✅ Channel marked as read:', cid);
      
      // GetStream.io Best Practice: Verify channel state
      console.log('🔍 Final channel state:', {
        cid: channel.cid,
        initialized: channel.initialized,
        memberCount: channel.state.members ? Object.keys(channel.state.members).length : 0,
        messageCount: channel.state.messages ? channel.state.messages.length : 0,
        unreadCount: channel.countUnread()
      });
      
    } catch (e: any) {
      console.error('❌ Message Sync Error:', e);
      console.error('❌ Error details:', {
        message: e.message,
        stack: e.stack,
        cid,
        user: user.id
      });
    } finally {
      setLoading(false);
      setStoreLoading(false);
      console.log('🔄 Message sync completed for channel:', cid);
    }
  }, [streamChatClient, user, setCid, setLoading, setStoreLoading, clearMessages, addMessages, setHasMoreMessages]);

  const sendMessage = useCallback(async (cid: string, text: string) => {
    if (!streamChatClient || !user) return;
    
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMessage: ChatMessage = {
      id: tempId,
      cid,
      custom_type: 'message',
      sender_id: streamChatClient?.userID || '',
      sender_vorname: user?.vorname || '',
      sender_nachname: user?.nachname || '',
      sender_image: user?.profileImageUrl || '',
      post_category: '',
      post_option: '',
      post_vorname: '',
      post_nachname: '',
      post_image: '',
      content: text,
      created_at: new Date().toISOString(),
      read: 0,
    };

    // Optimistic update - add temp message immediately
    addMessage(tempMessage);

    try {
      await sendMessageRaw(cid, text, tempId, (messages) => {
        // This function receives the updated messages array
        // We need to find the new message and add it
        const newMessage = messages.find(msg => msg.id !== tempId);
        if (newMessage) {
          removeMessage(tempId);
          addMessage(newMessage);
        }
      }, activeMessages);
    } catch (error) {
      console.error('Send Message Error:', error);
      // Remove temp message on error
      removeMessage(tempId);
    }
  }, [streamChatClient, user, addMessage, sendMessageRaw, activeMessages, removeMessage]);

  const loadMoreMessages = useCallback(async (cid: string, limit = 20) => {
    if (isFetchingMore || !hasMoreMessages) return [];
    
    setIsFetchingMore(true);
    
    try {
      const offset = activeMessages.length;
      const older = await getMessagesForChannel(cid, limit, offset);
      
      if (older.length > 0) {
        addMessages(older as ChatMessage[]);
        setHasMoreMessages(older.length >= limit);
      } else {
        setHasMoreMessages(false);
      }
      
      return older;
    } catch (e) {
      console.error('Load More Error:', e);
      return [];
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasMoreMessages, activeMessages.length, getMessagesForChannel, addMessages, setHasMoreMessages]);

  const getMessages = useCallback((cid: string) => getMessagesForChannel(cid), [getMessagesForChannel]);

  const deleteChannel = useCallback(async (cid: string) => {
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
        clearMessages();
      }
    } catch (err) {
      console.error('❌ Fehler beim Löschen des Channels:', err);
    }
  }, [streamChatClient, db, user?.id, getChannelsFromDb, setZustandChannels, activeCid, setCid, clearMessages]);

  const blockUser = useCallback(async (userId: string, reason = 'Verstoß gegen Regeln') => {
    if (!streamChatClient) return;
    try {
      await streamChatClient.banUser(userId, { reason, timeout: 0 });
    } catch (err) {
      console.error('❌ Fehler beim Blockieren des Nutzers:', err);
    }
  }, [streamChatClient]);

  // Track recently marked channels to prevent rate limiting
  const recentlyMarked = new Map<string, number>();

  const markChannelAsRead = useCallback(async (cid: string) => {
    if (!streamChatClient) return;
    
    const now = Date.now();
    const lastMarked = recentlyMarked.get(cid);
    
    // Prevent marking as read more than once per 10 seconds (increased from 5)
    if (lastMarked && (now - lastMarked) < 10000) {
      return; // Silent return to reduce log spam
    }
    
    const [type, id] = cid.split(':');
    const channel = streamChatClient.channel(type, id);
    try {
      await channel.markRead();
      
      // Update local database to reflect the read status
      await db.runAsync(
        'UPDATE channels_fetched SET unread_count = 0 WHERE cid = ?',
        [cid]
      );
      
      // Update local channels state with current Stream Chat state
      const localChs = await getChannelsFromDb(db, user?.id ?? '');
      
      // Update the specific channel in the Zustand store with current Stream Chat state
      const updatedChannels = localChs.map(ch => {
        if (ch.cid === cid) {
          // Get the current channel state from Stream Chat client
          const streamChannel = streamChatClient.channel(type, id);
          return {
            ...ch,
            unread_count: streamChannel.countUnread() // Use Stream Chat's current unread count
          };
        }
        return ch;
      });
      
      setZustandChannels(updatedChannels);
      
      // Mark as recently processed
      recentlyMarked.set(cid, now);
      
    } catch (err) {
      // Silent error handling to prevent log spam
      console.warn('⚠️ Channel mark as read failed (rate limit):', cid);
    }
  }, [streamChatClient, db, user?.id, getChannelsFromDb, setZustandChannels]);

  return (
    <ChatContext.Provider
      value={{
        channels,
        activeMessages,
        loading,
        hasMoreMessages,
        sendMessage,
        loadMoreMessages,
        syncChannels,
        getMessages,
        syncMessagesForChannel,
        deleteChannel,
        blockUser,
        markChannelAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};