// useInitChannel.ts
import { useEffect, useRef } from 'react';
import { useMessagesService } from '@/components/Crud/SQLite/Services/messagesService';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { useSQLiteContext } from 'expo-sqlite';
import { ChatMessage } from '@/components/types/stream';

export const useInitChannel = (cid: string | null) => {
  const db = useSQLiteContext();
  const setMessages = useActiveChatStore((s) => s.setMessages);
  const { getMessagesForChannel } = useMessagesService(db);
  const lastCidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!cid || cid === lastCidRef.current) return;

    const loadMessages = async () => {
      try {
        const storedMsgs = await getMessagesForChannel(cid);
        
        // Convert StoredMessage to ChatMessage format
        const chatMessages: ChatMessage[] = storedMsgs.map(msg => ({
          id: msg.id,
          cid: msg.cid,
          sender_id: msg.sender_id,
          sender_vorname: msg.sender_vorname,
          sender_nachname: msg.sender_nachname,
          sender_image: msg.sender_image,
          post_category: msg.post_category,
          post_option: msg.post_option,
          post_vorname: msg.post_vorname,
          post_nachname: msg.post_nachname,
          post_image: msg.post_image,
          content: msg.content,
          created_at: msg.created_at,
          read: msg.read,
          custom_type: msg.custom_type,
        }));
        
        console.log(`✅ Loaded ${chatMessages.length} messages for channel ${cid}`);
        setMessages(chatMessages);
        lastCidRef.current = cid;
      } catch (error) {
        console.error('❌ Error loading messages for channel:', cid, error);
      }
    };

    loadMessages();
  }, [cid, getMessagesForChannel, setMessages]);
};
