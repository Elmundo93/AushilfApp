import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

export const getRedirectUri = () => {
  const rawScheme = Constants.expoConfig?.scheme;
  const scheme = Array.isArray(rawScheme) ? rawScheme[0] : rawScheme || 'aushilfapp';
  return Linking.createURL('/auth/callback', { scheme });
};