// components/services/AuthController.ts
import { supabase } from '@/components/config/supabase';
import { StorageService } from '../Storage/StorageService';
import { authenticateUser } from './AuthService';
import { OAuthFlowManager } from './OAuthFlowManager';
import { useAuthStore } from '@/components/stores/AuthStore';
import { User } from '@/components/types/auth';
import { deleteUserInfo } from '@/components/Crud/SQLite/Services/UserInfoService';
import { useSQLiteContext } from 'expo-sqlite/next';
import * as SQLite from 'expo-sqlite';
import { clearUserData } from '../Storage/UserSyncService';

export const AuthController = {

  
  async loginWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user || !data.session) throw error || new Error('Login fehlgeschlagen');

    const { data: userData } = await supabase
      .from('Users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const { userData: authUserData, streamClient, streamToken } = await authenticateUser(userData, data.session);
    await StorageService.saveSecureSession(data.session, streamToken);
    await StorageService.saveUser(authUserData);
    useAuthStore.getState().setAuthenticated(true);
    return authUserData;
  },

  async register(email: string, password: string, userInfo: User) {
    const { data: authData, error } = await supabase.auth.signUp({ email, password });
    if (error || !authData.user || !authData.session) throw error || new Error('Registrierung fehlgeschlagen');

    await supabase.auth.setSession(authData.session);
    const { data: insertedUser, error: insertError } = await supabase
      .from('Users')
      .insert({
        ...userInfo,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (insertError) throw insertError;

    const { userData: authUserData, streamClient, streamToken } = await authenticateUser(insertedUser, authData.session);
    await StorageService.saveSecureSession(authData.session, streamToken);
    await StorageService.saveUser(authUserData);
    useAuthStore.getState().setAuthenticated(true);
    return authUserData;
  },

  async loginWithOAuth(provider: 'google' | 'apple') {
    await OAuthFlowManager.markPending();
    return await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: process.env.EXPO_PUBLIC_AUTH_CALLBACK_URL },
    });
  },

  async finalizeOAuthLogin() {
    const isPending = await OAuthFlowManager.isPending();
    if (!isPending) return null;
    await OAuthFlowManager.clear();

    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    if (!session || !user) throw new Error('OAuth-Fehler');

    const { data: userData, error } = await supabase
      .from('Users')
      .select('*')
      .eq('id', user.id)
      .single();

    let finalUser = userData;

    if (error) {
      const defaultName = user.user_metadata?.full_name || 'OAuth Nutzer';
      const [vorname, ...rest] = defaultName.split(' ');
      const nachname = rest.join(' ');
      const { data: inserted } = await supabase
        .from('Users')
        .insert({
          id: user.id,
          email: user.email,
          vorname,
          nachname,
          profileImageUrl: user.user_metadata?.avatar_url || '',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      finalUser = inserted;
    }

    const { userData: authUserData, streamClient, streamToken } = await authenticateUser(finalUser, session);
    await StorageService.saveSecureSession(session, streamToken);
    await StorageService.saveUser(authUserData);
    useAuthStore.getState().setAuthenticated(true);
    return authUserData;
  },

  async logout() {
    const client = useAuthStore.getState().streamChatClient;
    if (client) await client.disconnectUser();
    await supabase.auth.signOut();
    await StorageService.clearAll();
    useAuthStore.getState().reset();
  },
};