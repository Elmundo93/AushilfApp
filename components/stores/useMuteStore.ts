// stores/useMuteStore.ts
import { create } from 'zustand';

interface MuteStore {
  mutedUserIds: string[];
  setMutedUserIds: (ids: string[]) => void;
  isMuted: (userId: string) => boolean;
}

export const useMuteStore = create<MuteStore>((set, get) => ({
  mutedUserIds: [],
  setMutedUserIds: (ids) => set({ mutedUserIds: ids }),
  isMuted: (userId) => get().mutedUserIds.includes(userId),
}));