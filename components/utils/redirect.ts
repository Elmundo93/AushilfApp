// utils/redirect.ts

import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

/**
 * Gibt die passende Redirect-URI für den Supabase OAuth-Flow zurück.
 *
 * - Im **Expo Go (Entwicklung)** wird `useProxy: true` verwendet,
 *   was `https://auth.expo.io/@username/app-slug` ergibt.
 *
 * - Im **EAS Build (Produktion)** wird `scheme: 'myapp'` verwendet,
 *   was `myapp://` ergibt (Deep Linking).
 *
 * Diese Funktion sorgt automatisch dafür, dass Supabase nach dem Login
 * korrekt in die App zurückleitet – egal ob im Dev-Modus oder im echten Build.
 *
 * Wichtig:
 * - Trage **beide** Redirect-URIs in Supabase ein:
 *   - https://auth.expo.io/@elmundo93/aushilfapp
 *   - myapp://
 */
export const getRedirectUri = () => {
  const isExpoGo = Constants.appOwnership === 'expo';

  return AuthSession.makeRedirectUri({
    useProxy: isExpoGo,
    scheme: isExpoGo ? undefined : 'myapp',
  } as any);
};