// /stores/useChatUIStore.ts
import { create } from 'zustand';

type ChatUIMode = 'stream' | 'custom';

export const useChatUIStore = create<{
  mode: ChatUIMode;
  setMode: (mode: ChatUIMode) => void;
}>((set) => ({
  mode: 'stream',
  setMode: (mode) => set({ mode }),
}));