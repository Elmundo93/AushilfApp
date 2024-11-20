import { create } from 'zustand';
import { User } from '@/components/types/auth';
import { StreamChat } from 'stream-chat';

interface AuthState {
  user: User | null;
  token: string | null;
  streamChatClient: StreamChat | null;
  authenticated: boolean;
  locationPermission: boolean;
  isLoading: boolean;
  error: string | null; // Neuer Fehlerzustand
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setStreamChatClient: (client: StreamChat | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLocationPermission: (locationPermission: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void; // Neue Methode zum Setzen des Fehlers
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  streamChatClient: null,
  authenticated: false,
  locationPermission: false,
  isLoading: false,
  error: null, // Initialer Fehlerzustand
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setStreamChatClient: (client) => set({ streamChatClient: client }),
  setAuthenticated: (authenticated) => set({ authenticated }),
  setLocationPermission: (locationPermission) => set({ locationPermission }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }), // Fehler setzen
  reset: () => set({ user: null, token: null, streamChatClient: null, authenticated: false, isLoading: false, error: null }), // Fehler zurücksetzen
}));