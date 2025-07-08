// components/Chat/hooks/useOptimizedChatLoading.ts
import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { useChannelServices } from '@/components/Crud/SQLite/Services/channelServices';

export const useOptimizedChatLoading = () => {
  const db = useSQLiteContext();
  const { user } = useAuthStore();
  const { channels, setChannels, setChannelsReady, setLoading } = useStreamChatStore();
  const { getChannelsFromDb } = useChannelServices();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadChannels = async () => {
      if (!user?.id || !db || isInitialized) return;

      try {
        console.log('🔄 Loading channels from SQLite...');
        setLoading(true);
        
        const localChannels = await getChannelsFromDb(db, user.id);
        
        if (localChannels.length > 0) {
          console.log(`✅ Loaded ${localChannels.length} channels from SQLite`);
          setChannels(localChannels);
          setChannelsReady(true);
        } else {
          console.log('ℹ️ No channels found in SQLite');
          setChannelsReady(false);
        }
      } catch (error) {
        console.error('❌ Error loading channels:', error);
        setChannelsReady(false);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    loadChannels();
  }, [user?.id, db, isInitialized]);

  return { isInitialized };
}; 