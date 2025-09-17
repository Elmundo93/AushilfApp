import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { enqueueMessage } from '@/components/services/Chat/chatOutbox';
import { markRead } from '@/components/services/Chat/chatApi';

type ChatCtx = {
  sendMessage: (channelId: string, text: string, meta?: any) => Promise<void>;
  markChannelAsRead: (channelId: string) => Promise<void>;
};
const ChatContext = createContext<ChatCtx>({ sendMessage: async () => {}, markChannelAsRead: async () => {} });
export const useChat = () => useContext(ChatContext);

export function ChatProvider({ children }: PropsWithChildren) {
  const value = useMemo<ChatCtx>(() => ({
    async sendMessage(channelId, text, meta = {}) { await enqueueMessage(channelId, text, meta); },
    async markChannelAsRead(channelId) { await markRead(channelId); },
  }), []);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}