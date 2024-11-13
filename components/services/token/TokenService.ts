import { supabase } from '@/components/config/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

export class TokenService {
  private static instance: TokenService;
  private supabase: SupabaseClient | null = null;

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  
  async generateStreamToken(userId: string) {
    const { data: token, error: tokenError } = await supabase.functions.invoke('generate-getStream-token', {
      body: { userId },
    });

    if (tokenError) {
      console.error('Fehler beim Generieren des GetStream-Tokens:', tokenError);
      return { data: null, error: tokenError };
    }

    return { data: token, error: null };
  }
}

// Funktion, um den Tokenablauf zu überprüfen
export const checkTokenExpiry = async (): Promise<boolean> => {
  try {
    const tokenExpiry = await SecureStore.getItemAsync('tokenExpiry');
    if (!tokenExpiry) {
      console.log('Kein Token-Ablaufdatum gefunden');
      return true; // Token sollte erneuert werden, wenn kein Ablaufdatum vorhanden ist
    }

    const expiryDate = new Date(tokenExpiry);
    const currentTime = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    return (expiryDate.getTime() - currentTime.getTime()) < oneDayInMs;
  } catch (error) {
    console.error('Fehler beim Überprüfen des Token-Ablaufs:', error);
    return true; // Im Fehlerfall sollte der Token erneuert werden
  }
};

interface TokenRefreshResult {
  token: string | null;
  error: Error | null;
}

// Funktion, um den Token zu erneuern
export const refreshToken = async (): Promise<TokenRefreshResult> => {
  try {
    const userData = await SecureStore.getItemAsync('user');
    if (!userData) {
      throw new Error('Benutzerdaten nicht gefunden, kein Token-Refresh möglich.');
    }

    const response = await fetch('https://your-project.supabase.co/functions/v1/getStreamTokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: JSON.parse(userData).id }),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen des neuen Tokens: ${response.statusText}`);
    }

    const { token, apiKey } = await response.json();

    const newExpiryDate = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
    await SecureStore.setItemAsync('streamToken', token);
    await SecureStore.setItemAsync('tokenExpiry', newExpiryDate.toString());

    return { token, error: null };
  } catch (error) {
    console.error('Fehler beim Token-Refresh:', error);
    return { token: null, error: error instanceof Error ? error : new Error('Unbekannter Fehler') };
  }
};

export const refreshSupabaseToken = async () => {
  try {
    const refresh_token = await SecureStore.getItemAsync('refreshToken');
    if (!refresh_token) {
      throw new Error('Kein Refresh-Token gefunden');
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });
    if (error) throw new Error('Fehler beim Erneuern des Tokens: ' + error.message);
    if (!data.session) throw new Error('Keine Sitzungsdaten erhalten');

    const { access_token, refresh_token: newRefreshToken } = data.session;

    // Speichere die neuen Tokens im SecureStore
    await SecureStore.setItemAsync('accessToken', access_token);
    await SecureStore.setItemAsync('refreshToken', newRefreshToken);

    return access_token;
  } catch (error) {
    console.error('Fehler beim Erneuern des Tokens:', error);
    return null;
  }
};