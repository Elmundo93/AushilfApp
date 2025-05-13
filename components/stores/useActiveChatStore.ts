import { create } from 'zustand';
import { ChatMessage } from '@/components/types/stream';

type ActiveChatState = {
  cid: string | null;
  messages: ChatMessage[];
  loading: boolean;
  setCid: (cid: string | null) => void;
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  setLoading: (loading: boolean) => void;
};

export const useActiveChatStore = create<ActiveChatState>((set) => ({
  cid: null,
  messages: [],
  loading: false,
  setCid: (cid) => set({ cid }),
  setMessages: (messagesOrUpdater) =>
    set((state) => {
      const updated =
        typeof messagesOrUpdater === 'function'
          ? messagesOrUpdater(state.messages)
          : messagesOrUpdater;

      const sorted = [...updated].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return { messages: sorted };
    }),
  setLoading: (loading) => set({ loading }),
}));