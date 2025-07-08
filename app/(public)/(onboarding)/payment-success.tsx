// app/(public)/(onboarding)/payment-success.tsx
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/components/stores/AuthStore';
import { syncFromSupabase, pushUserToSupabase } from '@/components/services/Storage/Syncs/UserSyncService';
import { useSQLiteContext } from 'expo-sqlite';

export default function PaymentSuccess() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const db = useSQLiteContext();
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [status, setStatus] = useState<'syncing' | 'success' | 'error'>('syncing');

  const handleManualCompletion = async () => {
    if (!user?.id) return;
    
    try {
      setStatus('syncing');
      const updatedUser = { ...user, onboarding_completed: true };
      
      // Update locally and in Supabase
      await pushUserToSupabase(updatedUser);
      setUser(updatedUser);
      setUser({...user, onboarding_completed: true});
      
      setStatus('success');
      setTimeout(() => {
        router.replace('/(authenticated)/(aushilfapp)/pinnwand');
      }, 1000);
    } catch (error) {
      console.error('❌ Manual completion failed:', error);
      setStatus('error');
    }
  };

  useEffect(() => {
    const handleSync = async () => {
      if (!user?.id) return;
      
      try {
        console.log('🔄 Payment Success: Syncing user data...');
        await syncFromSupabase(db, user.id);
        
        // Check if onboarding is now completed
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.onboarding_completed) {
          setStatus('success');
          console.log('✅ Payment Success: Onboarding completed, redirecting to app...');
          // Small delay to show success message
          setTimeout(() => {
            router.replace('/(authenticated)/(aushilfapp)/pinnwand');
          }, 1500);
        } else {
          // Webhook might not have processed yet, retry after delay
          if (syncAttempts < 5) {
            setSyncAttempts(prev => prev + 1);
            setTimeout(handleSync, 2000); // Retry every 2 seconds
          } else {
            setStatus('error');
          }
        }
      } catch (error) {
        console.error('❌ Payment Success: Sync error:', error);
        setStatus('error');
      }
    };

    handleSync();
  }, [user?.id, syncAttempts]);

  const getStatusMessage = () => {
    switch (status) {
      case 'syncing':
        return `🔐 Verifikation erfolgreich – synchronisiere Daten...${syncAttempts > 0 ? ` (Versuch ${syncAttempts + 1}/5)` : ''}`;
      case 'success':
        return '✅ Verifikation abgeschlossen – du wirst weitergeleitet...';
      case 'error':
        return '⚠️ Synchronisation fehlgeschlagen. Du kannst manuell fortfahren.';
      default:
        return '🔐 Verifikation erfolgreich – du wirst weitergeleitet...';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{getStatusMessage()}</Text>
      <ActivityIndicator size="large" style={styles.spinner} color="#ff9a00" />
      
      {status === 'error' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Falls das Problem weiterhin besteht, kannst du manuell fortfahren:
          </Text>
          <TouchableOpacity style={styles.manualButton} onPress={handleManualCompletion}>
            <Text style={styles.manualButtonText}>Manuell abschließen</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
    lineHeight: 24,
  },
  spinner: {
    marginTop: 16,
  },
  errorContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  manualButton: {
    backgroundColor: '#ff9a00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  manualButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});