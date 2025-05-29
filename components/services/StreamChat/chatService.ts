import { useAuthStore } from '@/components/stores/AuthStore'; 
import { SUPABASE_FUNCTIONS_URL } from '@/components/lib/constants';

import * as SecureStore from 'expo-secure-store';

async function getAuthHeaders() {
  const session = await SecureStore.getItemAsync('accessToken');
  if (!session) throw new Error('Nicht authentifiziert');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session}`,
  };
}

export const chatService = {
  async deleteChannel(channelType: string, channelId: string) {
    const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/chatDelete`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ channelType, channelId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Chat löschen fehlgeschlagen: ${err.error}`);
    }
    return res.json();
  },

  async blockUser(userId: string) {
    const streamClient = useAuthStore.getState().streamChatClient;
    if (!streamClient) throw new Error('Client nicht verbunden');
    try {
      return await streamClient.blockUser(userId);
    } catch (err) {
      console.error('❌ blockUser fehlgeschlagen:', err);
      throw new Error('Blockieren fehlgeschlagen');
    }
  },

  async unblockUser(userId: string) {
    const streamClient = useAuthStore.getState().streamChatClient;
    if (!streamClient?.user) throw new Error('Client nicht verbunden');
    try {
      return await streamClient.unBlockUser(userId);
    } catch (err) {
      console.error('❌ unblockUser fehlgeschlagen:', err);
      throw new Error('Entblocken fehlgeschlagen');
    }
  },

  async getBlockedUsers() {
    const streamClient = useAuthStore.getState().streamChatClient;
    if (!streamClient) throw new Error('Client nicht verbunden');
    try {
      const users = await streamClient.queryUsers({ blocked_by_me: true });
      return users.users.map((u) => ({
        userId: u.id,
        name: u.name || '',
      }));
    } catch (err) {
      console.error('❌ getBlockedUsers fehlgeschlagen:', err);
      throw new Error('Geblockte User konnten nicht geladen werden');
    }
  },

  async muteUser(userId: string) {
    const streamClient = useAuthStore.getState().streamChatClient;
    if (!streamClient) throw new Error('Client nicht verbunden');
    try {
      return await streamClient.muteUser(userId);
    } catch (err) {
      console.error('❌ muteUser fehlgeschlagen:', err);
      throw new Error('Stummschaltung fehlgeschlagen');
    }
  },

  async unmuteUser(userId: string) {
    const streamClient = useAuthStore.getState().streamChatClient;
    if (!streamClient) throw new Error('Client nicht verbunden');
    try {
      return await streamClient.unmuteUser(userId);
    } catch (err) {
      console.error('❌ unmuteUser fehlgeschlagen:', err);
      throw new Error('Entstummen fehlgeschlagen');
    }
  },

  async getMutedUsers() {
    const streamClient = useAuthStore.getState().streamChatClient;
    if (!streamClient) throw new Error('Client nicht verbunden');
    try {
      const users = await streamClient.queryUsers({ muted: true });
      return users.users.map((u) => ({
        userId: u.id,
        name: u.name || '',
      }));
    } catch (err) {
      console.error('❌ getMutedUsers fehlgeschlagen:', err);
      throw new Error('Stummschaltungen konnten nicht geladen werden');
    }
  },
};