import { create } from 'zustand';
import { ChatMessage } from '@/components/types/stream';

type ActiveChatState = {
  cid: string | null;
  messages: ChatMessage[];
  loading: boolean;
  hasMoreMessages: boolean;
  setCid: (cid: string | null) => void;
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  addMessage: (message: ChatMessage) => void;
  addMessages: (messages: ChatMessage[]) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (messageId: string) => void;
  setLoading: (loading: boolean) => void;
  setHasMoreMessages: (hasMore: boolean) => void;
  clearMessages: () => void;
  // Additional utility methods for respectful store management
  clearActiveChat: () => void;
  getMessage: (messageId: string) => ChatMessage | undefined;
  hasMessage: (messageId: string) => boolean;
};

export const useActiveChatStore = create<ActiveChatState>((set, get) => ({
  cid: null,
  messages: [],
  loading: false,
  hasMoreMessages: true,

  setCid: (cid) => set({ cid }),
  
  setMessages: (messagesOrUpdater) =>
    set((state) => {
      const updated =
        typeof messagesOrUpdater === 'function'
          ? messagesOrUpdater(state.messages)
          : messagesOrUpdater;

      // Deduplicate by id and sort by creation date (newest first for inverted list)
      const uniqueMessages = Array.from(
        new Map(updated.map(msg => [msg.id, msg])).values()
      );

      const sorted = [...uniqueMessages].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return { messages: sorted };
    }),

  addMessage: (message) =>
    set((state) => {
      // Check if message already exists
      if (state.messages.some(m => m.id === message.id)) {
        return state;
      }

      const newMessages = [message, ...state.messages];
      const sorted = [...newMessages].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return { messages: sorted };
    }),

  addMessages: (newMessages) =>
    set((state) => {
      // Filter out existing messages and add new ones
      const existingIds = new Set(state.messages.map(m => m.id));
      const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));
      
      if (uniqueNewMessages.length === 0) {
        return state;
      }

      const combined = [...uniqueNewMessages, ...state.messages];
      const sorted = [...combined].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return { messages: sorted };
    }),

  updateMessage: (messageId, updates) =>
    set((state) => ({
      messages: state.messages.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    })),

  removeMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter(msg => msg.id !== messageId)
    })),

  setLoading: (loading) => set({ loading }),
  
  setHasMoreMessages: (hasMore) => set({ hasMoreMessages: hasMore }),
  
  clearMessages: () => set({ messages: [], hasMoreMessages: true }),
  
  // Additional utility methods for respectful store management
  clearActiveChat: () => set({ cid: null, messages: [], hasMoreMessages: true }),
  
  getMessage: (messageId) => {
    const { messages } = get();
    return messages.find(msg => msg.id === messageId);
  },
  
  hasMessage: (messageId) => {
    const { messages } = get();
    return messages.some(msg => msg.id === messageId);
  },
}));