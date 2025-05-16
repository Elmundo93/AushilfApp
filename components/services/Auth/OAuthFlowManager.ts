import AsyncStorage from '@react-native-async-storage/async-storage';

export const OAuthFlowManager = {
  async markPending() {
    await AsyncStorage.setItem('pendingOAuth', 'true');
  },

  async isPending() {
    const pending = await AsyncStorage.getItem('pendingOAuth');
    return pending === 'true';
  },

  async clear() {
    await AsyncStorage.removeItem('pendingOAuth');
  }
};