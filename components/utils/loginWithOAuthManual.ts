import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

const SUPABASE_PROJECT = 'rorjehxddmuelbakcyqo.supabase.co';

export const loginWithOAuthManual = async (provider: 'google' | 'apple') => {
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true } as any);

  const authUrl = `https://${SUPABASE_PROJECT}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectUri)}`;

  console.log('🌐 Öffne Auth URL:', authUrl);

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type !== 'success') {
    console.warn('❌ OAuth fehlgeschlagen oder abgebrochen:', result);
    return null;
  }

  console.log('✅ OAuth erfolgreich:', result);
  return result;
};