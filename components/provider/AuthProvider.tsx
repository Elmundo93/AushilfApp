// AuthProvider.tsx
import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useSegments, usePathname, router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite/next';
import { syncFromSupabase, loadUserFromLocal } from '@/components/services/Storage/Syncs/UserSyncService';
import { useTokenManager } from '@/components/services/token/TokenManager';
const AuthProvider = ({ children }: PropsWithChildren) => {

  const { setUserSynced } = useAuthStore();
  const {
    user,
    token,
    streamChatClient,
  
  } = useAuthStore();

  const db = useSQLiteContext();
  const segments = useSegments();
  const pathname = usePathname();

  useTokenManager();

  const isFullyAuthenticated = useMemo(() => {
    return !!(user && token && streamChatClient);
  }, [user, token, streamChatClient]);

  // 🔐 Routing-Schutz
  useEffect(() => {
    const enforceSecurity = () => {
      const inPublicGroup = segments[0] === '(public)';
      const inAuthenticatedGroup = segments[0] === '(authenticated)';

      if (isFullyAuthenticated && inPublicGroup) {
        console.log('🔐 Redirect: öffentlich → authentifiziert');
        router.replace('/(authenticated)/(aushilfapp)/pinnwand');
      }

      if (!isFullyAuthenticated && inAuthenticatedGroup) {
        console.log('🔐 Redirect: authentifiziert → öffentlich');
        router.replace('/(public)/loginScreen' as any);
      }
    };
    enforceSecurity();
  }, [segments, isFullyAuthenticated, pathname]);

  // 🔄 Initialer User Sync bei App-Start / Login
  useEffect(() => {
    const preloadUserData = async () => {
      if (!user?.id) return;
      try {
        console.log('🔄 Benutzer-Sync...');
        await syncFromSupabase(db, user.id);
        await loadUserFromLocal(db);
      } catch (error) {
        console.error('❌ Fehler beim Laden von Benutzerdaten:', error);
      }
      finally {
        setUserSynced(true);
      }
    };
    preloadUserData();
  }, [user?.id]);

  return (
    <OverlayProvider>
      {isFullyAuthenticated ? (
        <Chat client={streamChatClient!}>{children}</Chat>
      ) : (
        children
      )}
    </OverlayProvider>
  );
};

export default AuthProvider;