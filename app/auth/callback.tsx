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
      console.log('📥 OAuth Callback erreicht – beginne Finalisierung');
      
      const isPending = await OAuthFlowManager.isPending();
      console.log('🔄 OAuth Pending Status:', isPending);
      
      if (!isPending) {
        console.warn('⚠️ Kein OAuth-Prozess aktiv – leite zurück zur Login-Seite');
        router.replace('/(public)/loginScreen');
        return;
      }
  
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();
  
      console.log('🧾 Session:', session);
      console.log('👤 User:', user);
  
      if (!session || !user) {
        console.error('❌ Keine gültige Session oder User gefunden');
        await OAuthFlowManager.clear();
        router.replace('/(public)/loginScreen');
        return;
      }
  
      console.log('✅ Session & User vorhanden – Finalisiere Login');
      await OAuthFlowManager.clear();
      await AuthController.finalizeOAuthLogin();
  
      console.log('🎉 OAuth-Login vollständig abgeschlossen');
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