import * as AuthSession from 'expo-auth-session';

export const getRedirectUri = () => {
  return AuthSession.makeRedirectUri({
    useProxy: true,
  }as any );
};