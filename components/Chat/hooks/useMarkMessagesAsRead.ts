// 📁 hooks/useMarkMessagesAsRead.ts
import { useEffect } from 'react';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { supabase } from '@/components/config/supabase';
import { ChatMessage } from '@/components/types/stream';

export function useMarkMessagesAsRead(chatId: string, currentUserId: string) {
  const messages = useActiveChatStore((s) => s.messages as ChatMessage[]);

  useEffect(() => {
    const unreadMessages = messages.filter(
      (msg: ChatMessage) => !msg.read && msg.sender_id !== currentUserId
    );

    if (unreadMessages.length === 0) return;

    const markAsRead = async () => {
      const messageIds = unreadMessages.map((msg: ChatMessage) => msg.id);

      await supabase
        .from('messages')
        .update({ read: true })
        .in('id', messageIds);

      // Zustand lokal aktualisieren
      const updated = messages.map((msg: ChatMessage) =>
        messageIds.includes(msg.id) ? { ...msg, read: 1 } : msg
      );

      useActiveChatStore.getState().setMessages(updated);
    };

    markAsRead();
  }, [chatId, messages.length]);
}


