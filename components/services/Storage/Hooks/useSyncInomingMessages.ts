// useSyncIncomingMessages.ts
import { useEffect } from 'react';
import { Event, FormatMessageResponse } from 'stream-chat';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { useSQLiteContext } from 'expo-sqlite';

export const useSyncIncomingMessages = (client: any, cid: string | null) => {
  const db = useSQLiteContext();
  const setMessages = useActiveChatStore((s) => s.setMessages);
  const { mapMessageToDbValues, saveMessagesToDb } = useMessagesService(db);
  useEffect(() => {
    let isActive = true;
    if (!client || !cid) return;

    const handleNew = async (event: Event) => {
      if (!isActive || !client) return;
      if (!event.message || event.cid !== cid) return;

      const channel = client.channel(event.cid.split(':')[0], event.cid.split(':')[1]);
      const stored = await mapMessageToDbValues(event.message as unknown as FormatMessageResponse, channel);
      if (!isActive || !client) return;
      await saveMessagesToDb([stored]);
      if (!isActive || !client) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === stored.id);
        return exists ? prev : [...prev, stored].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      });
    };

    const sub = client.on('message.new', handleNew);
    return () => {
      isActive = false;
      sub.unsubscribe();
    };
  }, [client, cid]);
};