// useTokenManager.ts
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '@/components/config/supabase';
import { useAuthStore } from '@/components/stores/AuthStore';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveSecureSessionData, initializeStreamClient } from '@/components/services/Auth/AuthService';
import { router } from 'expo-router';

export const useTokenManager = () => {
  const {
    user,
    reset,
    setToken,
    setStreamChatClient,
  } = useAuthStore();

  useEffect(() => {
    if (!user) {
      console.log('[TokenManager] Kein Benutzer – TokenCheck abgebrochen.');
      return;
    }

    let appStateListener: any;

    const refreshIfNeeded = async () => {
      try {
        console.log('[TokenManager] Prüfe Tokenstatus...');

        const tokenExpiryString = await AsyncStorage.getItem('tokenExpiry');
        if (!tokenExpiryString) {
          console.log('[TokenManager] Kein Ablaufdatum gespeichert.');
          return;
        }

        const tokenExpiry = new Date(tokenExpiryString);
        const now = new Date();
        const timeDiffMinutes = (tokenExpiry.getTime() - now.getTime()) / (1000 * 60);

        if (timeDiffMinutes < 10) {
          console.log('[TokenManager] Token läuft bald ab – erneuere...');

          const { data, error } = await supabase.auth.refreshSession();

          if (error || !data.session) {
            console.error('[TokenManager] Supabase Refresh fehlgeschlagen:', error?.message);
            logout();
            return;
          }

          const response = await fetch('https://rorjehxddmuelbakcyqo.supabase.co/functions/v1/getStreamTokens', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.session.access_token}`,
            },
            body: JSON.stringify({ userId: user.id }),
          });

          if (!response.ok) {
            console.error('[TokenManager] GetStream Token-Abruf fehlgeschlagen.');
            logout();
            return;
          }

          const { token: newStreamToken, apiKey: streamApiKey } = await response.json();
          const client = initializeStreamClient(streamApiKey);

          await client.connectUser({
            id: user.id,
            name: `${user.vorname} ${user.nachname}`,
            image: user.profileImageUrl,
          }, newStreamToken);

          await saveSecureSessionData(data.session, newStreamToken);

          const newExpiry = new Date(Date.now() + 60 * 60 * 24 * 6 * 1000);
          await AsyncStorage.setItem('tokenExpiry', newExpiry.toString());

          setToken(newStreamToken);
          setStreamChatClient(client);

          console.log('[TokenManager] Tokens erfolgreich erneuert.');
        } else {
          console.log('[TokenManager] Token ist noch gültig.');
        }
      } catch (error) {
        console.error('[TokenManager] Fehler bei Tokenprüfung:', error);
        logout();
      }
    };

    const logout = async () => {
      console.log('[TokenManager] Logout wird ausgeführt...');
      try {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('supabaseSession');
        await SecureStore.deleteItemAsync('streamToken');
        await AsyncStorage.removeItem('tokenExpiry');
        await AsyncStorage.removeItem('user');
      } catch (e) {
        console.error('[TokenManager] Fehler beim Bereinigen:', e);
      }
      reset();
      router.replace('/(public)/loginScreen' as any);
    };

    refreshIfNeeded();

    appStateListener = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('[TokenManager] App reaktiviert – Tokenprüfung läuft...');
        refreshIfNeeded();
      }
    });

    return () => {
      appStateListener?.remove?.();
    };
  }, [user]);
};
