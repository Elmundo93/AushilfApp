import React, { PropsWithChildren } from 'react';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { AuthState } from '@/components/types/auth'; 
import { useAuthStore } from '../stores/AuthStore';
import { Text } from 'react-native';
import { useSegments } from "expo-router";
import { router } from "expo-router";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";

const AuthContext = React.createContext<AuthState | null>(null);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const authState = useAuthStore(); // Hole das gesamte AuthStore-Objekt
  const authenticated = useAuthStore((state) => state.authenticated);
  const segments = useSegments();

  useEffect(() => {
    const inPublicGroup = segments[0] === "(public)";
    const inAuthenticatedGroup = segments[0] === "(authenticated)";
  
    if (authenticated && !inAuthenticatedGroup) {
      router.replace("/(authenticated)/pinnwand");
    } else if (!authenticated && !inPublicGroup) {
      router.replace("/(public)/");
    }
  
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, [authenticated, segments]);


  // Der Chat wird nur gerendert, wenn der Stream-Client, der Benutzer und der Token vorhanden sind
  return (
    <AuthContext.Provider value={authState}>
      <OverlayProvider>
        {authState.user && authState.token && authState.streamChatClient ? (
          <Chat client={authState.streamChatClient}>
            {children}
          </Chat>
        ) : (
          children
        )}
      </OverlayProvider>
    </AuthContext.Provider>
  );
};