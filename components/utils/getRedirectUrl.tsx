import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

export const getRedirectUri = () => {
  const scheme = Array.isArray(Constants.expoConfig?.scheme) 
    ? Constants.expoConfig.scheme[0] 
    : Constants.expoConfig?.scheme ?? 'aushilfapp';
  return Linking.createURL('/(public)/auth/callback', { scheme });
};