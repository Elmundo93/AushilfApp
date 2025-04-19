// components/services/StorageService.ts
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import { User } from '@/components/types/auth';

export const StorageService = {
  async saveSecureSession(session: Session, streamToken: string) {
    await SecureStore.setItemAsync('supabaseSession', JSON.stringify(session));
    await SecureStore.setItemAsync('accessToken', session.access_token);
    await SecureStore.setItemAsync('refreshToken', session.refresh_token);
    await SecureStore.setItemAsync('streamToken', streamToken);
  },

  async saveUser(userData: User) {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    const expiryDate = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000); // 6 Tage
    await AsyncStorage.setItem('tokenExpiry', expiryDate.toString());
  },

  async clearAll() {
    await SecureStore.deleteItemAsync('supabaseSession');
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('streamToken');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('tokenExpiry');
  },
};