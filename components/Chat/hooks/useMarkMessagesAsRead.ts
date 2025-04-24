// 📁 hooks/useMarkMessagesAsRead.ts
import { useEffect } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { supabase } from '@/lib/supabase';

export function useMarkMessagesAsRead(chatId: string, currentUserId: string) {
  const messages = useChatStore((s) => s.messages[chatId] ?? []);

  useEffect(() => {
    const unreadMessages = messages.filter(
      (msg) => !msg.read && msg.sender_id !== currentUserId
    );

    if (unreadMessages.length === 0) return;

    const markAsRead = async () => {
      const messageIds = unreadMessages.map((msg) => msg.id);

      await supabase
        .from('messages')
        .update({ read: true })
        .in('id', messageIds);

      // Zustand lokal aktualisieren
      const updated = messages.map((msg) =>
        messageIds.includes(msg.id) ? { ...msg, read: true } : msg
      );

      useChatStore.getState().setMessages(chatId, updated);
    };

    markAsRead();
  }, [chatId, messages.length]);
}


