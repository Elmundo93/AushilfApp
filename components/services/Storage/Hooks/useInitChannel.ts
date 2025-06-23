// useInitChannel.ts
import { useEffect } from 'react';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { useSQLiteContext } from 'expo-sqlite';

export const useInitChannel = (cid: string | null) => {
  const db = useSQLiteContext();
  const setMessages = useActiveChatStore((s) => s.setMessages);
  const { getMessagesForChannel } = useMessagesService(db);
  useEffect(() => {
    if (!cid) return;

    const loadMessages = async () => {
      const msgs = await getMessagesForChannel(cid);
      setMessages(msgs);
    };

    loadMessages();
  }, [cid]);
};
