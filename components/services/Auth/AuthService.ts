// AuthService.ts
import { supabase } from '@/components/config/supabase';
import { User } from '@/components/types/auth';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StreamChat } from 'stream-chat';
import { useAuthStore } from '@/components/stores/AuthStore';
import { Session } from '@supabase/supabase-js';

/* =======================
   Storage Service Helpers
   ======================= */
export const saveSecureSessionData = async (session: Session, streamToken: string) => {
  await SecureStore.setItemAsync('supabaseSession', JSON.stringify(session));
  await SecureStore.setItemAsync('accessToken', session.access_token);
  await SecureStore.setItemAsync('refreshToken', session.refresh_token);
  await SecureStore.setItemAsync('streamToken', streamToken);
};

export const saveUserData = async (userData: User) => {
  await AsyncStorage.setItem('user', JSON.stringify(userData));
  const expiryDate = new Date(Date.now() + 60 * 60 * 24 * 6 * 1000);
  await AsyncStorage.setItem('tokenExpiry', expiryDate.toString());
};

export const clearStorage = async () => {
  await SecureStore.deleteItemAsync('supabaseSession');
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
  await SecureStore.deleteItemAsync('streamToken');
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('tokenExpiry');
};

export const initializeStreamClient = (apiKey: string) => {
  return StreamChat.getInstance(apiKey);
};

export const authenticateUser = async (userData: User, session: Session) => {
  const response = await fetch('https://rorjehxddmuelbakcyqo.supabase.co/functions/v1/getStreamTokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
    body: JSON.stringify({ userId: userData.id }),
  });

  if (!response.ok) throw new Error(await response.text());

  const { token: streamToken, apiKey: streamApiKey } = await response.json();
  const client = initializeStreamClient(streamApiKey);

  await client.connectUser({
    id: userData.id,
    name: `${userData.vorname} ${userData.nachname}`,
    vorname: userData.vorname,
    nachname: userData.nachname,
    image: userData.profileImageUrl,
  }, streamToken);

  const authStore = useAuthStore.getState();
  authStore.setUser(userData);
  authStore.setToken(streamToken);
  authStore.setStreamChatClient(client);

  return { userData, streamClient: client, streamToken };
};