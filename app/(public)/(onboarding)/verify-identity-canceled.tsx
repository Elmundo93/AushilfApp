// app/(public)/(onboarding)/payment-success.tsx
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/components/stores/AuthStore';
import { syncFromSupabase, pushUserToSupabase } from '@/components/services/Storage/Syncs/UserSyncService';
import { useSQLiteContext } from 'expo-sqlite';

export default function VerifyIdentityCanceled() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const db = useSQLiteContext();
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [status, setStatus] = useState<'syncing' | 'success' | 'error'>('syncing');

  const handleManualCompletion = async () => {
    if (!user?.id) return;
    
    try {
      setStatus('syncing');
      const updatedUser = { ...user, is_id_verified: false };
      
      // Update locally and in Supabase
      await pushUserToSupabase(updatedUser);
      setUser(updatedUser);
      setUser({...user, is_id_verified: false});
      
      setStatus('success');
      setTimeout(() => {
        router.replace('/(public)/(onboarding)/subscribe');
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
        console.log('🔄 Verify Identity Canceled: Syncing user data...');
        await syncFromSupabase(db, user.id);
        
        // Check if onboarding is now completed
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.is_id_verified) {
          setStatus('success');
          console.log('✅ Verify Identity Canceled: Onboarding completed, redirecting to app...');
          // Small delay to show success message
          setTimeout(() => {
            router.push('/(public)/(onboarding)/verify-identity');
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
        console.error('❌ Verify Identity Canceled: Sync error:', error);
        setStatus('error');
      }
    };

    handleSync();
  }, [user?.id, syncAttempts]);

  const getStatusMessage = () => {
    switch (status) {
      case 'syncing':
        return `🔐 Verifikation abgebrochen – synchronisiere Daten...${syncAttempts > 0 ? ` (Versuch ${syncAttempts + 1}/5)` : ''}`;
      case 'success':
        return '✅ Verifikation abgebrochen – du wirst weitergeleitet...';
      case 'error':
        return '⚠️ Synchronisation fehlgeschlagen. Du kannst manuell fortfahren.';
      default:
        return '🔐 Verifikation abgebrochen – du wirst weitergeleitet...';
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
            <Text style={styles.manualButtonText}>Manuell fortfahren</Text>
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