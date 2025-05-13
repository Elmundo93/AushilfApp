// AuthController.ts
import { supabase } from '@/components/config/supabase';
import * as AuthService from './AuthService';
import { OAuthFlowManager } from './OAuthFlowManager';
import { useAuthStore } from '@/components/stores/AuthStore';
import { User } from '@/components/types/auth';
import { getRedirectUri } from '@/components/utils/redirect';
import { router } from 'expo-router';

const createUserIfNotExists = async (supabaseUser: any): Promise<User> => {
  const { data: userData, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  if (userData) return userData;

  const fullName = supabaseUser.user_metadata?.full_name || 'OAuth Nutzer';
  const [vorname, ...rest] = fullName.split(' ');
  const nachname = rest.join(' ');

  const { data: inserted } = await supabase
    .from('Users')
    .insert({
      id: supabaseUser.id,
      email: supabaseUser.email,
      vorname,
      nachname,
      profileImageUrl: supabaseUser.user_metadata?.avatar_url || '',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  return inserted;
};

export const AuthController = {
  async loginWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user || !data.session) throw error || new Error('Login fehlgeschlagen');

    const { data: userData } = await supabase
      .from('Users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const { userData: authUserData, streamClient, streamToken } =
      await AuthService.authenticateUser(userData, data.session);

    await AuthService.saveSecureSessionData(data.session, streamToken);
    await AuthService.saveUserData(authUserData);
    useAuthStore.getState().setAuthenticated(true);
    return authUserData;
  },

  async register(email: string, password: string, userInfo: User) {
    const { data: authData, error } = await supabase.auth.signUp({ email, password });
    if (error || !authData.user || !authData.session) throw error || new Error('Registrierung fehlgeschlagen');

    await supabase.auth.setSession(authData.session);

    const { data: insertedUser } = await supabase
      .from('Users')
      .insert({ ...userInfo, id: authData.user.id, created_at: new Date().toISOString() })
      .select()
      .single();

    const { userData: authUserData, streamClient, streamToken } =
      await AuthService.authenticateUser(insertedUser, authData.session);

    await AuthService.saveSecureSessionData(authData.session, streamToken);
    await AuthService.saveUserData(authUserData);
    useAuthStore.getState().setAuthenticated(true);
    return authUserData;
  },

  async loginWithOAuth(provider: 'google' | 'apple') {
    console.log('OAuth wird ausgelöst mit', provider);
    await OAuthFlowManager.markPending();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getRedirectUri(),
      },
    });
  },

  async finalizeOAuthLogin() {
    const isPending = await OAuthFlowManager.isPending();
    if (!isPending) return null;

    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    if (!session || !user) throw new Error('OAuth-Fehler');

    await OAuthFlowManager.clear();
    const finalUser = await createUserIfNotExists(user);

    const { userData: authUserData, streamClient, streamToken } =
      await AuthService.authenticateUser(finalUser, session);

    await AuthService.saveSecureSessionData(session, streamToken);
    await AuthService.saveUserData(authUserData);
    useAuthStore.getState().setAuthenticated(true);
    return authUserData;
  },

  async logout() {
    const client = useAuthStore.getState().streamChatClient;
    if (client) await client.disconnectUser();
    await supabase.auth.signOut();
    await AuthService.clearStorage();
    useAuthStore.getState().reset();
    router.replace('/(public)/index' as any);
  },
};