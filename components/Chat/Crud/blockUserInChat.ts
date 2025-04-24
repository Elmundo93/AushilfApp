// services/unblockUserInChat.ts
import { supabase } from '@/lib/supabase';
import { useChatStore } from '@/stores/useChatStore';

export const unblockUserInChat = async (chatId: string) => {
  const { error } = await supabase
    .from('chats')
    .update({ blocked_by: null })
    .eq('id', chatId);

  if (error) {
    console.error('Fehler beim Entblockieren:', error);
    throw error;
  }

  const currentChat = useChatStore.getState().chats[chatId];
  if (currentChat) {
    useChatStore.getState().addChat({
      ...currentChat,
      blocked_by: null,
    });
  }
};