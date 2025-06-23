// components/services/Storage/Syncs/useMessageSync.ts
import { useSQLiteContext } from 'expo-sqlite';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { FormatMessageResponse } from 'stream-chat';

export function useMessageSync() {
  const db = useSQLiteContext();
  const { streamChatClient, user } = useAuthStore();
  const { mapMessageToDbValues, saveMessagesToDb, getMessagesForChannel } = useMessagesService(db);

  return async function syncMessagesForChannel(cid: string, initialLimit = 30) {
    let isActive = true;
    if (!streamChatClient || !user) return;

    const [type, id] = cid.split(':');
    const channel = streamChatClient.channel(type, id);
    const res = await channel.query({ messages: { limit: initialLimit } });
    if (!isActive || !streamChatClient || !user) return;

    const mapped = await Promise.all(
      res.messages.map((m) =>
        mapMessageToDbValues(m as unknown as FormatMessageResponse, channel)
      )
    );
    if (!isActive || !streamChatClient || !user) return;

    await saveMessagesToDb(mapped);
    if (!isActive || !streamChatClient || !user) return;

    // Nachrichten abrufen
    const loaded = await getMessagesForChannel(cid, initialLimit, 0);
    if (!isActive || !streamChatClient || !user) return;
    return loaded;
  };
}