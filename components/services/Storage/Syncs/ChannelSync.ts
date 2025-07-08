// components/services/Storage/Syncs/useChannelSync.ts
import NetInfo from '@react-native-community/netinfo';
import { useSQLiteContext } from 'expo-sqlite';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useChannelServices } from '@/components/Crud/SQLite/Services/channelServices';
import { StoredMessage } from '@/components/Crud/SQLite/Services/messagesService';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { FormatMessageResponse } from 'stream-chat';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { useCallback } from 'react';

export function useChannelSync() {
  const db = useSQLiteContext();
  const { streamChatClient } = useAuthStore();
  const { saveChannelsToDb, getChannelsFromDb, cleanupInvalidCategories } = useChannelServices();

  const setChannel      = useStreamChatStore((s) => s.setChannels);
  const setChannelsReady = useStreamChatStore((s) => s.setChannelsReady);
  const setLoading       = useStreamChatStore((s) => s.setLoading);

  const messagesService = useMessagesService(db);

  return useCallback(async function syncChannels() {
    let isActive = true;
    try {
      console.log('🔄 Starting channel sync...');
      setLoading(true);

      // Clean up any invalid categories first
      await cleanupInvalidCategories(db);

      const net = await NetInfo.fetch();
      const isOnline = net.isConnected && net.isInternetReachable;

      console.log('🌐 Network status:', { isConnected: net.isConnected, isInternetReachable: net.isInternetReachable });

      // Check again after await
      if (!isActive) return;
      if (isOnline && streamChatClient) {
        const filters = {
          type: 'messaging',
          members: { $in: [streamChatClient.userID || ''] },
        };

        console.log('📡 Querying channels from Stream Chat...');
        const channels = await streamChatClient.queryChannels(filters);
        if (!isActive || !streamChatClient) return;

        console.log('✅ Found channels:', channels.length);
        await saveChannelsToDb(db, channels);
        if (!isActive || !streamChatClient) return;

        // Optional: letzte 1–3 Nachrichten für Vorschau speichern
        for (const ch of channels) {
          // 2) Pull raw messages from Stream Chat:
          const rawMsgs = ch.state.messages as FormatMessageResponse[];
          // 3) Map to your DB shape:
          const storedMsgs: StoredMessage[] = await Promise.all(rawMsgs.map(m =>
            messagesService.mapMessageToDbValues(m, ch)
          ));
          if (!isActive || !streamChatClient) return;
          // 4) Persist them:
          await messagesService.saveMessagesToDb(storedMsgs);
        }
      } else {
        console.log('⚠️ Offline or no StreamChatClient, using local data only');
      }

      // Channels aus SQLite holen und Zustand setzen
      const localChannels = await getChannelsFromDb(db, streamChatClient?.userID ?? '');
      if (!isActive) return;
      
      console.log('💾 Local channels loaded:', localChannels.length);
      
      // CRITICAL: Get current store state to preserve newly created channels
      const currentStoreChannels = useStreamChatStore.getState().channels;
      console.log('📊 Current store channels:', currentStoreChannels.length);
      console.log('📊 Current store channel CIDs:', currentStoreChannels.map(ch => ch.cid));
      
      // Merge local channels with store channels, prioritizing store channels
      const mergedChannels = [...currentStoreChannels];
      
      // Add local channels that don't exist in store
      localChannels.forEach(localChannel => {
        const existsInStore = mergedChannels.some(storeChannel => storeChannel.cid === localChannel.cid);
        if (!existsInStore) {
          console.log('➕ Adding local channel to merged list:', localChannel.cid);
          mergedChannels.push(localChannel);
        } else {
          console.log('ℹ️ Local channel already exists in store:', localChannel.cid);
        }
      });
      
      console.log('🔄 Merged channels count:', mergedChannels.length);
      console.log('🔄 Merged channel CIDs:', mergedChannels.map(ch => ch.cid));
      
      // Set merged channels and mark as ready
      setChannel(mergedChannels);
      setChannelsReady(true);
      console.log('✅ Channels erfolgreich synchronisiert');
      
    } catch (e: any) {
      console.error('❌ Fehler beim Channel-Sync:', e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [db, streamChatClient, saveChannelsToDb, getChannelsFromDb, cleanupInvalidCategories, messagesService, setChannel, setChannelsReady, setLoading]);
}