// ✅ Updated AuthProvider.tsx
import React, { PropsWithChildren, useEffect } from 'react';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useSegments, usePathname, router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite/next';
import { syncFromSupabase, loadUserFromLocal } from '@/components/services/Storage/UserSyncService';

const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    user,
    token,
    streamChatClient,
    authenticated,
    setUser,
  } = useAuthStore();

  const db = useSQLiteContext();
  const segments = useSegments();
  const pathname = usePathname();

  // 🔐 Routing-Schutz
  useEffect(() => {
    const enforceSecurity = () => {
      const inPublicGroup = segments[0] === "(public)";
      const inAuthenticatedGroup = segments[0] === "(authenticated)";

      if (authenticated && inPublicGroup) {
        console.log("Navigiere zu /(authenticated)/(aushilfapp)/pinnwand");
        router.replace("/(authenticated)/(aushilfapp)/pinnwand");
      }
      if (!authenticated && inAuthenticatedGroup) {
        console.log("Navigiere zu /(public)/index");
        router.replace("/(public)/index" as any);
      }
    };
    enforceSecurity();
  }, [segments, authenticated, pathname]);

  // 🔄 Initialer User Sync bei App-Start / Login
  useEffect(() => {
    const preloadUserData = async () => {
      if (!user?.id) return;
      try {
        await syncFromSupabase(db, user.id);
        await loadUserFromLocal(db); // Lädt SQLite → Zustand
      } catch (error) {
        console.error("Fehler beim Laden von Benutzerdaten:", error);
      }
    };
    preloadUserData();
  }, [user?.id]);

  return (
    <OverlayProvider>
      {user && token && streamChatClient ? (
        <Chat client={streamChatClient}>{children}</Chat>
      ) : (
        children
      )}
    </OverlayProvider>
  );
};

export default AuthProvider;
