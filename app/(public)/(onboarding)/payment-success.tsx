// app/(public)/(onboarding)/payment-success.tsx
import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/components/stores/AuthStore';
import { loadUserFromLocal } from '@/components/services/Storage/Syncs/UserSyncService';
import { useSQLiteContext } from 'expo-sqlite';

export default function PaymentSuccess() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const db = useSQLiteContext();

  useEffect(() => {
    const syncAndContinue = async () => {
      const updatedUser = await loadUserFromLocal(db);
      if (updatedUser?.onboarding_completed) {
        setUser(updatedUser);
        router.replace('/(authenticated)/(aushilfapp)/pinnwand');
      } else {
        router.replace('/(public)/(onboarding)/savety');
      }
    };

    syncAndContinue();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🔐 Zahlung erfolgreich – du wirst weitergeleitet...</Text>
      <ActivityIndicator size="large" style={{ marginTop: 16 }} />
    </View>
  );
}