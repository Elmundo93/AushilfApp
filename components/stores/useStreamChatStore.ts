import { create } from "zustand";
import { Channel as StreamChannel } from 'stream-chat';
// + messages & setMessages hinzufügen
type ChatMessage = {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    read: boolean;
  };
  
  type ChatStreamState = {
    channel: StreamChannel | null;
    cid: string | null;
    loading: boolean;
    currentUserId: string;
    messages: Record<string, ChatMessage[]>;
    setMessages: (chatId: string, messages: ChatMessage[]) => void;
    setChannel: (channel: StreamChannel | null) => void;
    setCid: (cid: string | null) => void;
    setLoading: (loading: boolean) => void;
    setCurrentUserId: (id: string) => void;
  };
  
  export const useStreamChatStore = create<ChatStreamState>((set) => ({
    channel: null,
    cid: null,
    loading: true,
    currentUserId: '',
    messages: {},
    setMessages: (chatId, messages) =>
      set((state) => ({
        messages: { ...state.messages, [chatId]: messages },
      })),
    setChannel: (channel) => set({ channel }),
    setCid: (cid) => set({ cid }),
    setLoading: (loading) => set({ loading }),
    setCurrentUserId: (id) => set({ currentUserId: id }),
  }));