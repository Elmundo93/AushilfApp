// useSendMessage.ts
import { useAuthStore } from '@/components/stores/AuthStore';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { FormatMessageResponse } from 'stream-chat';
import { ChatMessage } from '@/components/types/stream';
import { SQLiteDatabase } from 'expo-sqlite';

export const useSendMessage = (db: SQLiteDatabase) => {
  const { streamChatClient, user } = useAuthStore();
  const { mapMessageToDbValues, saveMessagesToDb } = useMessagesService(db);

  return async (
    cid: string,
    text: string,
    tempId: string,
    setActiveMessages: (msgs: ChatMessage[]) => void,
    activeMessages: ChatMessage[]
  ) => {
    if (!streamChatClient || !user) return;

    const [type, id] = cid.split(':');
    const channel = streamChatClient.channel(type, id);

    try {
      const res = await channel.sendMessage({ text });
      const stored = await mapMessageToDbValues(
        res.message as unknown as FormatMessageResponse,
        channel
      );

      await saveMessagesToDb([stored]);

      const filtered = activeMessages.filter((m: ChatMessage) => m.id !== tempId && m.id !== stored.id);
      setActiveMessages([stored as unknown as ChatMessage, ...filtered]);
    } catch (e) {
      console.error('Send Message Error:', e);
    }
  };
};