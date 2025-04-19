import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_OAUTH_KEY = 'pendingOAuth';

export const OAuthFlowManager = {
  async markPending() {
    await AsyncStorage.setItem(PENDING_OAUTH_KEY, 'true');
  },

  async isPending() {
    const pending = await AsyncStorage.getItem(PENDING_OAUTH_KEY);
    return pending === 'true';
  },

  async clear() {
    await AsyncStorage.removeItem(PENDING_OAUTH_KEY);
  },
};
