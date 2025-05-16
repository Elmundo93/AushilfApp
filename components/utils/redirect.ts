import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';

export const getRedirectUri = () => {
  const isExpoGo = Constants.appOwnership === 'expo';
  return AuthSession.makeRedirectUri({
    useProxy: isExpoGo,
    scheme: 'myapp'
  } as any);
};