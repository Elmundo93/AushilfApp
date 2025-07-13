// AuthProvider.tsx
import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useSegments, usePathname, router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { syncFromSupabase, loadUserFromLocal } from '@/components/services/Storage/Syncs/UserSyncService';
import { useTokenManager } from '@/components/services/token/TokenManager';
import { useMuteStore } from '@/components/stores/useMuteStore';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

  const hasVerifiedIdentity = useMemo(() => {
    return user?.is_id_verified === true;
  }, [user?.is_id_verified]);

  const isFullyAuthenticated = useMemo(() => {
    console.log('🔍 isFullyAuthenticated:', user?.onboarding_completed);  
    return !!(user && token && streamChatClient && user.onboarding_completed);
  }, [user, token, streamChatClient, user?.onboarding_completed]);
  
  const loadMutedUsers = async () => {
    const client = useAuthStore.getState().streamChatClient;
    if (!client) return;
    
    try {
      // Load muted users from StreamChat
      const mutedUsers = client.mutedUsers || [];
      const mutedUserIds = mutedUsers.map((m) => m.target.id);
      useMuteStore.getState().setMutedUserIds(mutedUserIds);
      console.log('✅ Loaded muted users from StreamChat:', mutedUserIds.length);
      
      // Load muted users data from AsyncStorage for persistence
      try {
        const storedMutedUsers = await AsyncStorage.getItem('mutedUsers');
        if (storedMutedUsers) {
          const parsedUsers = JSON.parse(storedMutedUsers);
          useMuteStore.getState().setMutedUsers(parsedUsers);
          console.log('✅ Loaded muted users data from storage:', parsedUsers.length);
        }
      } catch (storageError) {
        console.warn('⚠️ Could not load muted users from storage:', storageError);
      }
      
      console.log('✅ Mute store initialized');
    } catch (error) {
      console.error('❌ Error loading muted users:', error);
    }
  };

  const isRedirecting = useRef(false);

  useEffect(() => {
    // Handle logout scenario: when user is null but we're in authenticated routes
    if (!user && segments[0] === '(authenticated)') {
      if (pathname !== '/(public)/loginScreen' && !isRedirecting.current) {
        console.log('🔄 User logged out - redirecting to Login...');
        isRedirecting.current = true;
        router.replace('/(public)/loginScreen' as any);
        setTimeout(() => { isRedirecting.current = false; }, 500);
      }
      return;
    }

    // Handle normal authentication flow
    if (!isFullyAuthenticated || !user) return;

    // Define onboarding routes
    const onboardingRoutes = [
      '/intro',
      '/userinfo',
      '/intent',
      '/about',
      '/profileImage',
      '/password',
      '/payment-success',
      '/payment-cancelled',
      '/conclusion',
      '/verify-identity',
      '/verify-identity-success',
      '/verify-identity-canceled',
      '/subscribe',
      '/payment-success',
      '/payment-cancelled'
    ];
    const isOnboardingRoute = onboardingRoutes.some(route => pathname.includes(route));
    
    console.log('🔍 Navigation Check:', {
      onboardingCompleted: user.onboarding_completed,
      isOnboardingRoute,
      currentPath: pathname,
      onboardingRoutes
    });

    // Special case: Allow users to stay on payment-success while webhook processes
    if (pathname.includes('/payment-success')) {
      console.log('💰 Payment success route - allowing user to stay while webhook processes');
      return;
    }

    // First check: Handle onboarding status
    if (user.onboarding_completed === false) {
      // Only redirect to intro if we're not already in the onboarding flow
      if (!isOnboardingRoute && !isRedirecting.current) {
        console.log('🔄 Redirecting to onboarding intro...');
        isRedirecting.current = true;
        router.replace('/(public)/(onboarding)/intro');
        setTimeout(() => { isRedirecting.current = false; }, 500);
      }
      return; // Important: Return here to prevent other redirects
    }

    // Second check: Handle authenticated users in public routes
    const inPublicGroup = segments[0] === '(public)';
    if (isFullyAuthenticated && inPublicGroup && user.onboarding_completed) {
      if (pathname !== '/(authenticated)/(aushilfapp)/pinnwand' && !isRedirecting.current) {
        console.log('🔄 Redirecting to Pinnwand...');
        isRedirecting.current = true;
        router.replace('/(authenticated)/(aushilfapp)/pinnwand');
        setTimeout(() => { isRedirecting.current = false; }, 500);
      }
      return;
    }

    // Third check: Handle unauthenticated users in authenticated routes
    const inAuthenticatedGroup = segments[0] === '(authenticated)';
    if (!isFullyAuthenticated && inAuthenticatedGroup) {
      if (pathname !== '/(public)/loginScreen' && !isRedirecting.current) {
        console.log('🔄 Redirecting to Login...');
        isRedirecting.current = true;
        router.replace('/(public)/loginScreen' as any);
        setTimeout(() => { isRedirecting.current = false; }, 500);
      }
      return;
    }
  }, [isFullyAuthenticated, user, pathname, segments]);



  // 🔄 Initialer User Sync bei App-Start / Login
  useEffect(() => {
    const preloadUserData = async () => {
      if (!user?.id) return;
      try {
        console.log('🔄 Benutzer-Sync...');
        await syncFromSupabase(db, user.id);
        await loadUserFromLocal(db);
        await loadMutedUsers();
     
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