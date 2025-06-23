import { create } from 'zustand';
import { User } from '@/components/types/auth';
import { StreamChat } from 'stream-chat';
import { useStreamChatStore } from './useStreamChatStore';
import { useActiveChatStore } from './useActiveChatStore';

interface AuthState {
  user: User | null;
  token: string | null;
  streamChatClient: StreamChat | null;
  authenticated: boolean;
  locationPermission: boolean;
  pendingCredentials: { email: string; password: string } | null;
  authProcessInProgress: boolean;
  isLoading: boolean;
  error: string | null;
  registrationProgress: number;
  registrationSuccessConfirmed: boolean;
  anmeldungsToggle: boolean;
  usersynced: boolean;
  clearChatState: () => void;
  setUser: (user: Partial<User> | null) => void;
  setToken: (token: string | null) => void;
  setStreamChatClient: (client: StreamChat | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLocationPermission: (locationPermission: boolean) => void;
  setPendingCredentials: (pendingCredentials: { email: string; password: string } | null) => void;
  setAuthProcessInProgress: (authProcessInProgress: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setRegistrationSuccessConfirmed: (confirmed: boolean) => void;
  setAnmeldungsToggle: (anmeldungsToggle: boolean) => void;
  setUserSynced: (usersynced: boolean) => void;

  }

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  usersynced: false,
  token: null,
  streamChatClient: null,
  authenticated: false,
  locationPermission: false,
  pendingCredentials: null,
  authProcessInProgress: false,
  isLoading: false,
  error: null,
  registrationProgress: 0,
  registrationSuccessConfirmed: false,
  anmeldungsToggle: false,

  setUser: (user) =>
    set((state) => {
      if (user === null) {
        return { user: null, authenticated: false, registrationProgress: 0 };
      }

      const mergedUser = {
        ...state.user!,
        ...user,
      } as User;

      const filledFields = [
        mergedUser.vorname,
        mergedUser.nachname,
        mergedUser.wohnort,
        mergedUser.straße,
        mergedUser.hausnummer,
        mergedUser.plz,
        mergedUser.email,
        mergedUser.telefonnummer,
        mergedUser.steuernummer,
      ].filter(Boolean).length;

      const progress = Math.round((filledFields / 9) * 100);

      return {
        user: mergedUser,
        authenticated: Boolean((state.user || user).id),
        registrationProgress: progress,
      };
    }),

  setAnmeldungsToggle: (anmeldungsToggle) => set({ anmeldungsToggle }),
  setToken: (token) => set({ token }),
  setStreamChatClient: (client) => set({ streamChatClient: client }),
  setAuthenticated: (authenticated) => set({ authenticated }),
  setLocationPermission: (locationPermission) => set({ locationPermission }),
  setPendingCredentials: (pendingCredentials) => set({ pendingCredentials }),
  setAuthProcessInProgress: (authProcessInProgress) => set({ authProcessInProgress }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setRegistrationSuccessConfirmed: (confirmed) => set({ registrationSuccessConfirmed: confirmed }),
  setUserSynced: (usersynced) => set({ usersynced }),
  reset: () => ({
    user: null,
    token: null,
    streamChatClient: null,
    authenticated: false,
    locationPermission: false,
    pendingCredentials: null,
    authProcessInProgress: false,
    isLoading: false,
    error: null,
    registrationProgress: 0,
    registrationSuccessConfirmed: false,

  }),
  clearChatState: () => {
    useStreamChatStore.getState().setChannels([]);
    useStreamChatStore.getState().setChannelsReady(false);
    useActiveChatStore.getState().setCid(null);
    useActiveChatStore.getState().setMessages([]);
  },
}));