// components/services/Storage/Syncs/useChannelSync.ts
import NetInfo from '@react-native-community/netinfo';
import { useSQLiteContext } from 'expo-sqlite';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useChannelServices } from '@/components/Crud/SQLite/Services/channelServices';
import { StoredMessage } from '@/components/Crud/SQLite/Services/messagesService';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { FormatMessageResponse } from 'stream-chat';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';

export function useChannelSync() {
  const db = useSQLiteContext();
  const { streamChatClient } = useAuthStore();
  const { saveChannelsToDb, getChannelsFromDb } = useChannelServices();

  const setChannel      = useStreamChatStore((s) => s.setChannels);
  const setChannelsReady = useStreamChatStore((s) => s.setChannelsReady);
  const setLoading       = useStreamChatStore((s) => s.setLoading);

  const messagesService = useMessagesService(db);

  return async function syncChannels() {
    let isActive = true;
    try {
      setLoading(true);

      const net = await NetInfo.fetch();
      const isOnline = net.isConnected && net.isInternetReachable;

      // Check again after await
      if (!isActive) return;
      if (isOnline && streamChatClient) {
        const filters = {
          type: 'messaging',
          members: { $in: [streamChatClient.userID || ''] },
        };

        const channels = await streamChatClient.queryChannels(filters);
        if (!isActive || !streamChatClient) return;

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

      // Channels aus SQLite holen und Zustand setzen
      const localChannels = await getChannelsFromDb(db, streamChatClient?.userID ?? '');
      if (!isActive) return;
      setChannel(localChannels);
      setChannelsReady(true);

      console.log('✅ Channels erfolgreich synchronisiert');
    } catch (e: any) {
      console.error('❌ Fehler beim Channel-Sync:', e);
      throw e;
    } finally {
      setLoading(false);
    }
    return () => { isActive = false; };
  };
}