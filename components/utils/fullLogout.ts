import { supabase } from '@/components/config/supabase';
import { StorageService } from '@/components/services/Storage/StorageService';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { useAuthStore } from '@/components/stores/AuthStore';
import { clearUserData } from '@/components/services/Storage/Syncs/UserSyncService';
import { router } from 'expo-router';

export async function fullLogout(db?: any) {
  const client = useAuthStore.getState().streamChatClient;
  if (client) await client.disconnectUser();
  await supabase.auth.signOut();

  // Clear all persisted storage
  await StorageService.clearAll();

  // Clear Zustand chat state
  useAuthStore.getState().clearChatState();

  // Clear onboarding state
  if (typeof useOnboardingStore !== 'undefined') {
    try {
      await useOnboardingStore.getState().reset();
    } catch (e) {}
  }

  // Clear user info from SQLite and Zustand
  if (db) {
    await clearUserData(db);
    try {
      await db.execAsync('DELETE FROM messages_fetched;');
      await db.execAsync('DELETE FROM channels_fetched;');
      await db.execAsync('DELETE FROM user_info_local;');
      await db.execAsync('DELETE FROM posts_fetched;');
      await db.execAsync('DELETE FROM danksagungen_fetched;');
    } catch (e) {
      console.error('❌ Fehler beim Löschen der SQLite-Tabellen:', e);
    }
  }

  useAuthStore.getState().setAuthenticated(false);
  useAuthStore.getState().setUser(null);
  router.replace('/(public)/index' as any);
}
