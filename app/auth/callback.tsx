// app/auth/callback.tsx
import { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/components/config/supabase';
import { OAuthFlowManager } from '@/components/services/Auth/OAuthFlowManager';
import { AuthController } from '@/components/services/Auth/AuthController';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finalize = async () => {
      const isPending = await OAuthFlowManager.isPending();
      if (!isPending) {
        router.replace('/(public)/loginScreen');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();

      if (!session || !user) {
        await OAuthFlowManager.clear();
        router.replace('/(public)/loginScreen');
        return;
      }

      await OAuthFlowManager.clear();
      await AuthController.finalizeOAuthLogin();
      router.replace('/(authenticated)/(aushilfapp)/pinnwand');
    };

    finalize();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>OAuth wird abgeschlossen...</Text>
    </View>
  );
}