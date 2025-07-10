// stores/useMuteStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MutedUser {
  userId: string;
  vorname: string;
  nachname: string;
  profileImageUrl?: string;
  mutedAt: string;
}

interface MuteStore {
  // User muting (existing)
  mutedUserIds: string[];
  setMutedUserIds: (ids: string[]) => void;
  isUserMuted: (userId: string) => boolean;
  
  // Channel muting (new)
  mutedChannelIds: string[];
  setMutedChannelIds: (ids: string[]) => void;
  isChannelMuted: (cid: string) => boolean;
  
  // Muted users data store
  mutedUsers: MutedUser[];
  addMutedUser: (user: MutedUser) => void;
  removeMutedUser: (userId: string) => void;
  getMutedUser: (userId: string) => MutedUser | undefined;
  isUserInMutedStore: (userId: string) => boolean;
  setMutedUsers: (users: MutedUser[]) => void;
  
  // Combined utilities
  toggleUserMute: (userId: string, userData?: Partial<MutedUser>) => void;
  toggleChannelMute: (cid: string) => void;
  clearAllMutes: () => void;
  
  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Helper function to save muted users to AsyncStorage
const saveMutedUsersToStorage = async (users: MutedUser[]) => {
  try {
    await AsyncStorage.setItem('mutedUsers', JSON.stringify(users));
    console.log('💾 Saved muted users to storage:', users.length);
  } catch (error) {
    console.error('❌ Failed to save muted users to storage:', error);
  }
};

export const useMuteStore = create<MuteStore>((set, get) => ({
  // User muting
  mutedUserIds: [],
  setMutedUserIds: (ids) => set({ mutedUserIds: ids }),
  isUserMuted: (userId) => get().mutedUserIds.includes(userId),
  
  // Channel muting
  mutedChannelIds: [],
  setMutedChannelIds: (ids) => set({ mutedChannelIds: ids }),
  isChannelMuted: (cid) => get().mutedChannelIds.includes(cid),
  
  // Muted users data store
  mutedUsers: [],
  addMutedUser: (user) => {
    const { mutedUsers } = get();
    const exists = mutedUsers.some(u => u.userId === user.userId);
    if (!exists) {
      const newMutedUsers = [...mutedUsers, user];
      set({ mutedUsers: newMutedUsers });
      saveMutedUsersToStorage(newMutedUsers);
      console.log('➕ Added muted user to store:', user.userId);
    }
  },
  removeMutedUser: (userId) => {
    const { mutedUsers } = get();
    const updatedUsers = mutedUsers.filter(u => u.userId !== userId);
    set({ mutedUsers: updatedUsers });
    saveMutedUsersToStorage(updatedUsers);
    console.log('➖ Removed muted user from store:', userId);
  },
  getMutedUser: (userId) => {
    const { mutedUsers } = get();
    return mutedUsers.find(u => u.userId === userId);
  },
  isUserInMutedStore: (userId) => {
    const { mutedUsers } = get();
    return mutedUsers.some(u => u.userId === userId);
  },
  setMutedUsers: (users) => {
    set({ mutedUsers: users });
    saveMutedUsersToStorage(users);
  },
  
  // Combined utilities
  toggleUserMute: (userId, userData) => {
    const { mutedUserIds, mutedUsers } = get();
    const isMuted = mutedUserIds.includes(userId);
    
    if (isMuted) {
      // Unmute user
      const newMutedIds = mutedUserIds.filter(id => id !== userId);
      const newMutedUsers = mutedUsers.filter(u => u.userId !== userId);
      set({ 
        mutedUserIds: newMutedIds,
        mutedUsers: newMutedUsers
      });
      saveMutedUsersToStorage(newMutedUsers);
      console.log('🔊 Unmuted user:', userId);
    } else {
      // Mute user
      const newMutedIds = [...mutedUserIds, userId];
      set({ mutedUserIds: newMutedIds });
      
      // Add user data if provided
      if (userData) {
        const mutedUser: MutedUser = {
          userId,
          vorname: userData.vorname || '',
          nachname: userData.nachname || '',
          profileImageUrl: userData.profileImageUrl,
          mutedAt: new Date().toISOString(),
        };
        get().addMutedUser(mutedUser);
      }
      console.log('🔇 Muted user:', userId);
    }
  },
  
  toggleChannelMute: (cid) => {
    const { mutedChannelIds } = get();
    const isMuted = mutedChannelIds.includes(cid);
    const newMutedIds = isMuted 
      ? mutedChannelIds.filter(id => id !== cid)
      : [...mutedChannelIds, cid];
    set({ mutedChannelIds: newMutedIds });
  },
  
  clearAllMutes: () => {
    set({ 
      mutedUserIds: [], 
      mutedChannelIds: [], 
      mutedUsers: [] 
    });
    saveMutedUsersToStorage([]);
  },
  
  // Loading state
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));