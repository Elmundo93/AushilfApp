// selectedUserStore.ts
import { create } from 'zustand';
import { UserProfile } from '@/components/types/auth';

type SelectedUserState = {
  selectedUser: UserProfile | null;
  setSelectedUser: (user: UserProfile) => void;
};

export const useSelectedUserStore = create<SelectedUserState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));