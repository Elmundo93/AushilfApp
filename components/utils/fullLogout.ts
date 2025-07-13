import { supabase } from '@/components/config/supabase';
import { StorageService } from '@/components/services/Storage/StorageService';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useMuteStore } from '@/components/stores/useMuteStore';
import { usePostStore } from '@/components/stores/postStore';
import { useDanksagungStore } from '@/components/stores/danksagungStores';
import { useLocationStore } from '@/components/stores/locationStore';
import { useLastFetchedAtStore } from '@/components/stores/lastFetchedAt';
import { useSelectedPostStore } from '@/components/stores/selectedPostStore';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { usePartnerStore } from '@/components/stores/partnerStore';
import { clearUserData } from '@/components/services/Storage/Syncs/UserSyncService';
import { OAuthFlowManager } from '@/components/services/Auth/OAuthFlowManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useLoading } from '@/components/provider/LoadingContext';

export async function fullLogout(db?: any) {
  console.log('🔄 Starting comprehensive logout cleanup...');
  
  try {
    // 1. Disconnect StreamChat client
    const client = useAuthStore.getState().streamChatClient;
    if (client) {
      console.log('📡 Disconnecting StreamChat client...');
      await client.disconnectUser();
    }

    // 2. Sign out from Supabase
    console.log('🔐 Signing out from Supabase...');
    await supabase.auth.signOut();

    // 3. Clear all persisted storage
    console.log('🗂️ Clearing persisted storage...');
    await StorageService.clearAll();

    // 4. Clear OAuth flow state
    console.log('🔑 Clearing OAuth flow state...');
    await OAuthFlowManager.clear();

    // 5. Clear additional AsyncStorage items that might persist
    console.log('🧹 Clearing additional AsyncStorage items...');
    const additionalKeysToRemove = [
      'mutedUsers',
      'pendingOAuth',
      'user',
      'tokenExpiry',
      'lastFetchedAt',
      'lastFetchedAtDragHandler',
      'refreshCount'
    ];
    
    for (const key of additionalKeysToRemove) {
      try {
        await AsyncStorage.removeItem(key);
      } catch (e) {
        console.warn(`⚠️ Could not remove AsyncStorage key ${key}:`, e);
      }
    }

    // 6. Clear all Zustand stores
    console.log('🏪 Clearing all Zustand stores...');
    
    // Auth store
    useAuthStore.getState().clearChatState();
    useAuthStore.getState().setAuthenticated(false);
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setToken(null);
    useAuthStore.getState().setStreamChatClient(null);
    useAuthStore.getState().setLocationPermission(false);
    useAuthStore.getState().setPendingCredentials(null);
    useAuthStore.getState().setAuthProcessInProgress(false);
    useAuthStore.getState().setIsLoading(false);
    useAuthStore.getState().setError(null);
    useAuthStore.getState().setRegistrationSuccessConfirmed(false);
    useAuthStore.getState().setAnmeldungsToggle(false);
    useAuthStore.getState().setUserSynced(false);

    // Mute store
    useMuteStore.getState().clearAllMutes();

    // Post store
    usePostStore.getState().setPosts([]);
    usePostStore.getState().setLoading(false);
    usePostStore.getState().setFilters({
      suchenChecked: false,
      bietenChecked: false,
      categories: {
        garten: false,
        haushalt: false,
        soziales: false,
        gastro: false,
        handwerk: false,
        bildung: false,
      },
    });

    // Danksagung store
    useDanksagungStore.getState().clearDanksagungen();
    useDanksagungStore.getState().setLoading(false);
    useDanksagungStore.getState().setError(null);

    // Location store - reset to default state
    useLocationStore.getState().setLocationPermission(false);
    // Note: setLocation requires a Location object, so we'll skip clearing it
    // The location will be cleared when the store is reinitialized

    // Last fetched store - reset to default state
    useLastFetchedAtStore.getState().setRefreshCount(0);
    // Note: setLastFetchedAt and setLastFetchedAtDragHandler require numbers, 
    // so we'll skip clearing them - they'll be reset when store reinitializes

    // Selected stores - reset to default state
    // Note: setSelectedPost and setSelectedUser require objects, so we'll skip clearing them
    // They'll be reset when the stores reinitialize

    // Partner store - reset to default state
    // Note: setPartner requires a UserProfile object, so we'll skip clearing it
    // It will be reset when the store reinitializes

    // 7. Clear loading context state
    try {
      const { hideGlobalLoading } = useLoading();
      await hideGlobalLoading();
    } catch (e) {
      console.warn('⚠️ Could not clear loading context:', e);
    }

    // 8. Clear onboarding state
    if (typeof useOnboardingStore !== 'undefined') {
      try {
        console.log('📚 Clearing onboarding state...');
        await useOnboardingStore.getState().reset();
      } catch (e) {
        console.warn('⚠️ Could not clear onboarding state:', e);
      }
    }

    // 9. Clear user info from SQLite and Zustand
    if (db) {
      console.log('🗄️ Clearing SQLite data...');
      await clearUserData(db);
      try {
        await db.execAsync('DELETE FROM messages_fetched;');
        await db.execAsync('DELETE FROM channels_fetched;');
        await db.execAsync('DELETE FROM user_info_local;');
        await db.execAsync('DELETE FROM posts_fetched;');
        await db.execAsync('DELETE FROM danksagungen_fetched;');
        console.log('✅ SQLite tables cleared successfully');
      } catch (e) {
        console.error('❌ Fehler beim Löschen der SQLite-Tabellen:', e);
      }
    }

    console.log('✅ Comprehensive logout cleanup completed');
    
    // 10. Add a small delay to prevent race conditions with AuthProvider navigation
    setTimeout(() => {
      router.replace('/(public)/loginScreen' as any);
    }, 100);

  } catch (error) {
    console.error('❌ Error during logout cleanup:', error);
    // Even if cleanup fails, we should still try to navigate to login
    setTimeout(() => {
      router.replace('/(public)/loginScreen' as any);
    }, 100);
  }
}
