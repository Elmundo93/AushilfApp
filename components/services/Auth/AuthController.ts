// AuthController.ts
import { supabase } from '@/components/config/supabase';

import * as AuthService from './AuthService';
import { OAuthFlowManager } from './OAuthFlowManager';
import { useAuthStore } from '@/components/stores/AuthStore';
import { User } from '@/components/types/auth';
import { getRedirectUri } from '@/components/utils/getRedirectUrl';

import { fullLogout } from '@/components/utils/fullLogout';

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
      wohnort: '',
      straße: '',
      hausnummer: '',
      plz: '',
      telefonnummer: '',
      steuernummer: '',
      profileImageUrl: supabaseUser.user_metadata?.avatar_url || '',
      created_at: new Date().toISOString(),
      onboarding_completed: false,
      kategorien: [],
      bio: '',
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
    try {
      // 1. Versuch: Registrierung
      const { data: authData, error } = await supabase.auth.signUp({ email, password });
  
      // 2. Fehlerfall behandeln
      if (error) {
        // 2a. Benutzer existiert bereits → versuche Login
        if (error.message.includes('User already registered')) {
          console.warn('⚠️ Benutzer existiert bereits – versuche Login statt Registrierung');
  
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
  
          if (loginError || !loginData.user || !loginData.session) {
            throw new Error('E-Mail ist registriert, aber Login mit Passwort fehlgeschlagen.');
          }
  
          // ✅ Stelle sicher, dass der Benutzer auch in der "users"-Tabelle existiert
          const userData = await createUserIfNotExists(loginData.user);
  
          const { userData: authUserData, streamToken } =
            await AuthService.authenticateUser(userData, loginData.session);
  
          await AuthService.saveSecureSessionData(loginData.session, streamToken);
          await AuthService.saveUserData(authUserData);
          useAuthStore.getState().setAuthenticated(true);
          return authUserData;
        }
  
        // 2b. Alle anderen Fehler weiterwerfen
        throw error;
      }
  
      if (!authData.user || !authData.session) {
        throw new Error('Registrierung fehlgeschlagen');
      }
  
      await supabase.auth.setSession(authData.session);
  
      // 3. User-Datensatz in Supabase-Tabelle erstellen
      const { data: insertedUser, error: insertError } = await supabase
        .from('Users')
        .insert({
          ...userInfo,
          id: authData.user.id,
          created_at: new Date().toISOString(),
          wohnort: userInfo.wohnort || '',  // Stelle sicher, dass wohnort gesetzt ist
        })
        .select()
        .single();
  
      if (insertError || !insertedUser) {
        console.error('Fehler beim Einfügen des Users:', insertError);
        throw new Error('Fehler beim Speichern der Benutzerdaten');
      }
  
      const { userData: authUserData, streamToken } =
        await AuthService.authenticateUser(insertedUser, authData.session);
  
      await AuthService.saveSecureSessionData(authData.session, streamToken);
      await AuthService.saveUserData(authUserData);
      useAuthStore.getState().setAuthenticated(true);
      return authUserData;
    } catch (err) {
      console.error('❌ Fehler in register():', err);
      throw err;
    }
  },

  async loginWithOAuth(provider: 'google' | 'apple') {
    console.log(`🔐 Starte OAuth-Login mit ${provider}`);
    await OAuthFlowManager.markPending();
  
    const redirectTo = getRedirectUri();
    console.log('🔁 Weiterleitungs-URL für Supabase:', redirectTo);
  
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
  
    if (error) {
      console.error('❌ Fehler beim Starten des OAuth-Logins:', error.message);
      await OAuthFlowManager.clear();
      throw new Error('OAuth konnte nicht gestartet werden: ' + error.message);
    }
  
    console.log('✅ OAuth Redirect wurde eingeleitet (erwarte Redirect durch Browser)');
  },

  async finalizeOAuthLogin() {
    console.log('🧩 Starte finalizeOAuthLogin');
    const isPending = await OAuthFlowManager.isPending();
    console.log('📦 OAuth Pending:', isPending);
  
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
  
    console.log('🔐 Supabase Session:', session);
    console.log('👤 Supabase User:', user);
  
    if (!session || !user) {
      await OAuthFlowManager.clear();
      throw new Error('OAuth-Fehler: Keine Session oder kein User');
    }
  
    const finalUser = await createUserIfNotExists(user);
    console.log('👤 Finaler User nach createUserIfNotExists:', finalUser);
  
    const { userData: authUserData, streamToken } =
      await AuthService.authenticateUser(finalUser, session);
  
    console.log('📨 Stream Token:', streamToken);
    console.log('📌 AuthUserData:', authUserData);
  
    await AuthService.saveSecureSessionData(session, streamToken);
    await AuthService.saveUserData(authUserData);
  
    useAuthStore.getState().setAuthenticated(true);
    return authUserData;
  },

  async logout(db?: any) {
    await fullLogout(db);
  },
};