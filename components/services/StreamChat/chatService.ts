import { useAuthStore } from '@/components/stores/AuthStore'; 
import { SUPABASE_FUNCTIONS_URL } from '@/components/lib/constants';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { SQLiteDatabase } from 'expo-sqlite';
import { router } from 'expo-router';

import * as SecureStore from 'expo-secure-store';

async function getAuthHeaders() {
  try {
    const session = await SecureStore.getItemAsync('accessToken');
    console.log('🔐 Auth token available:', !!session);
    if (!session) throw new Error('Nicht authentifiziert');
    
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session}`,
    };
    console.log('🔐 Auth headers created successfully');
    return headers;
  } catch (error) {
    console.error('❌ Auth headers error:', error);
    throw error;
  }
}

export const chatService = {

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
      const result = await streamClient.muteUser(userId);
      console.log('✅ User muted successfully:', userId);
      return result;
    } catch (err) {
      console.error('❌ muteUser fehlgeschlagen:', err);
      throw new Error('Stummschaltung fehlgeschlagen');
    }
  },

  async unmuteUser(userId: string) {
    const streamClient = useAuthStore.getState().streamChatClient;
    if (!streamClient) throw new Error('Client nicht verbunden');
    try {
      const result = await streamClient.unmuteUser(userId);
      console.log('✅ User unmuted successfully:', userId);
      return result;
    } catch (err) {
      console.error('❌ unmuteUser fehlgeschlagen:', err);
      throw new Error('Entstummen fehlgeschlagen');
    }
  },

  async muteChannel(cid: string) {
    const streamClient = useAuthStore.getState().streamChatClient;
    if (!streamClient) throw new Error('Client nicht verbunden');
    try {
      const [type, id] = cid.split(':');
      const channel = streamClient.channel(type, id);
      await channel.mute();
      console.log('✅ Channel muted successfully:', cid);
      return { success: true };
    } catch (err) {
      console.error('❌ muteChannel fehlgeschlagen:', err);
      throw new Error('Channel-Stummschaltung fehlgeschlagen');
    }
  },

  async unmuteChannel(cid: string) {
    const streamClient = useAuthStore.getState().streamChatClient;
    if (!streamClient) throw new Error('Client nicht verbunden');
    try {
      const [type, id] = cid.split(':');
      const channel = streamClient.channel(type, id);
      await channel.unmute();
      console.log('✅ Channel unmuted successfully:', cid);
      return { success: true };
    } catch (err) {
      console.error('❌ unmuteChannel fehlgeschlagen:', err);
      throw new Error('Channel-Entstummen fehlgeschlagen');
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