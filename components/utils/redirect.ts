import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

export const getRedirectUri = () => {
  const isDev =
    Constants.appOwnership === 'expo' ||
    (Constants.executionEnvironment === 'standalone' && __DEV__);

  return AuthSession.makeRedirectUri({
    useProxy: isDev,
    scheme: isDev ? undefined : 'myapp',
  } as any); // 👈 TS meckert nicht mehr
};