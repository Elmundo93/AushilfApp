import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider  from '@/components/provider/AuthProvider';
import 'react-native-reanimated';
import { MenuProvider } from 'react-native-popup-menu';
import { FontSizeProvider } from '@/components/provider/FontSizeContext';
import { useColorScheme } from '@/components/hooks/useColorScheme';
import { LoadingProvider } from '@/components/provider/LoadingContext';
import { SQLiteProviderWrapper } from '@/components/provider/SQLiteProviderWrapper';
import { DataProvider } from '@/components/provider/DataProvider';
import { ChatProvider } from '@/components/provider/ChatProvider';


export {
  ErrorBoundary, // Catch any errors thrown by the Layout component.
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();



export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <FontSizeProvider>
      <GestureHandlerRootView>
        <SQLiteProviderWrapper>
          <MenuProvider>
            <AuthProvider>
            <LoadingProvider>
              <DataProvider>
                <ChatProvider>  
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(public)" />

                <Stack.Screen name="(authenticated)" />

                </Stack>
                </ChatProvider>
              </DataProvider>
              </LoadingProvider>
          </AuthProvider>
          </MenuProvider>
        </SQLiteProviderWrapper>
      </GestureHandlerRootView>
    </FontSizeProvider>
  );
}