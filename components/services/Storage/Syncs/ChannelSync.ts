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
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';

export function useChannelSync() {
  const db = useSQLiteContext();
  const { streamChatClient, user } = useAuthStore();
  const { saveChannelsToDb, getChannelsFromDb, cleanupInvalidCategories } = useChannelServices();

  const setChannel      = useStreamChatStore((s) => s.setChannels);
  const setChannelsReady = useStreamChatStore((s) => s.setChannelsReady);
  const setLoading       = useStreamChatStore((s) => s.setLoading);

  const messagesService = useMessagesService(db);

  // Add sync state to prevent concurrent syncs
  let isSyncing = false;
  let lastSyncTime = 0;

  return useCallback(async function syncChannels() {
    // Prevent concurrent syncs
    if (isSyncing) {
      console.log('⚠️ Channel sync already in progress, skipping...');
      return;
    }
    
    // Rate limiting: minimum 5 seconds between syncs
    const now = Date.now();
    if (now - lastSyncTime < 5000) {
      console.log('⚠️ Channel sync rate limited, skipping...');
      return;
    }
    
    isSyncing = true;
    lastSyncTime = now;
    
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
      
      // Check if user is still in onboarding (not fully authenticated)
      const isInOnboarding = user && !user.onboarding_completed;
      
      if (isInOnboarding) {
        console.log('📝 User is in onboarding - skipping Stream Chat sync to avoid initialization issues');
        console.log('ℹ️ Channel sync will be available after onboarding completion');
      } else if (isOnline && streamChatClient) {
        // Verify StreamChatClient is properly initialized
        if (!streamChatClient.userID) {
          console.log('⚠️ StreamChatClient not properly initialized - skipping online sync');
          console.log('ℹ️ This is expected during onboarding or when user is not fully authenticated');
        } else {
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
        }
      } else {
        console.log('⚠️ Offline or no StreamChatClient, using local data only');
      }

      // Channels aus SQLite holen und Zustand setzen
      const localChannels = await getChannelsFromDb(db, streamChatClient?.userID ?? user?.id ?? '');
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
      
      // Handle specific StreamChat initialization errors gracefully
      if (e.message && e.message.includes('Both secret and user tokens are not set')) {
        console.log('ℹ️ StreamChatClient not properly initialized - this is expected during onboarding');
        console.log('ℹ️ Channel sync will be available after user authentication is complete');
        
        // Still try to load local channels even if online sync failed
        try {
          const localChannels = await getChannelsFromDb(db, user?.id ?? '');
          const currentStoreChannels = useStreamChatStore.getState().channels;
          const mergedChannels = [...currentStoreChannels];
          
          localChannels.forEach(localChannel => {
            const existsInStore = mergedChannels.some(storeChannel => storeChannel.cid === localChannel.cid);
            if (!existsInStore) {
              mergedChannels.push(localChannel);
            }
          });
          
          setChannel(mergedChannels);
          setChannelsReady(true);
          console.log('✅ Local channels loaded successfully despite StreamChat error');
        } catch (localError) {
          console.error('❌ Failed to load local channels:', localError);
        }
      } else {
        // For other errors, still try to load local data
        try {
          const localChannels = await getChannelsFromDb(db, user?.id ?? '');
          setChannel(localChannels);
          setChannelsReady(true);
          console.log('✅ Fallback to local channels successful');
        } catch (localError) {
          console.error('❌ Failed to load local channels as fallback:', localError);
        }
      }
      // Don't throw error to prevent app crashes
    } finally {
      setLoading(false);
      isSyncing = false;
    }
  }, [db, streamChatClient, user, saveChannelsToDb, getChannelsFromDb, cleanupInvalidCategories, messagesService, setChannel, setChannelsReady, setLoading]);
}