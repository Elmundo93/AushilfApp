import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { StreamChat } from 'stream-chat';
import { Location } from '@/components/types/location';

// Benutzer-Typ
export interface User {
  id: string;
  email: string;
  vorname: string;
  nachname: string;
  created_at: string;
  location: Location | null;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  straße?: string;
  hausnummer?: string;
  plz?: string;
  wohnort?: string;
  telefonnummer?: string;
  steuernummer?: string;

  // Weitere Benutzerfelder hier
}
// types/userProfile.ts
export type UserProfile = {
  
  userId: string;
  vorname: string;
  nachname: string;
  profileImageUrl: string;
  bio: string;
};

export type SignupData = Pick<User, 'email' | 'vorname' | 'nachname'  >;

// Verwenden Sie den Session-Typ direkt von Supabase
export { Session };

// AuthResult-Typ, der den Supabase Session-Typ verwendet
export interface AuthResult {
  user: SupabaseUser | null;
  session: Session | null;
  error: Error | null;
}

export interface StreamChatData {
    apiKey: string;
    userId: string;
    token: string;
  }
  export interface AuthState {
    user: User | null;
    token: string | null;
    streamChatClient: StreamChat | null;
    authenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setStreamChatClient: (client: StreamChat | null) => void;
    setAuthenticated: (authenticated: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    reset: () => void;
  }