// useInitChannel.ts
import { useEffect, useRef } from 'react';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { useSQLiteContext } from 'expo-sqlite';

export const useInitChannel = (cid: string | null) => {
  const db = useSQLiteContext();
  const setMessages = useActiveChatStore((s) => s.setMessages);
  const { getMessagesForChannel } = useMessagesService(db);
  const lastCidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!cid || cid === lastCidRef.current) return;

    const loadMessages = async () => {
      try {
        const msgs = await getMessagesForChannel(cid);
        setMessages(msgs);
        lastCidRef.current = cid;
      } catch (error) {
        console.error('❌ Error loading messages for channel:', cid, error);
      }
    };

    loadMessages();
  }, [cid, getMessagesForChannel, setMessages]);
};
