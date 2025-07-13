// app/(public)/(onboarding)/payment-success.tsx
import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/components/stores/AuthStore';
import { syncFromSupabase, pushUserToSupabase } from '@/components/services/Storage/Syncs/UserSyncService';
import { useSQLiteContext } from 'expo-sqlite';
import {
  AnimatedLogo,
  FloatingParticles,
  AnimatedText,
  AnimatedBackground,
  AnimatedLoadingIndicator,
} from '@/components/Animation';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerifyIdentitySuccess() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const db = useSQLiteContext();
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [status, setStatus] = useState<'syncing' | 'success' | 'error'>('syncing');
  const isMounted = useRef(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Success animation
  const completionAnim = useRef(new Animated.Value(0)).current;

  // Cleanup function
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const handleManualCompletion = async () => {
    if (!user?.id || !isMounted.current) return;
    
    try {
      setStatus('syncing');
      const updatedUser = { ...user, is_id_verified: true };
      
      // Update locally and in Supabase
      await pushUserToSupabase(updatedUser);
      if (isMounted.current) {
        setUser(updatedUser);
        setStatus('success');
        setTimeout(() => {
          if (isMounted.current) {
            router.replace('/(public)/(onboarding)/subscribe');
          }
        }, 3500); // Extended to 3.5 seconds to allow animation to complete
      }
    } catch (error) {
      console.error('❌ Manual completion failed:', error);
      if (isMounted.current) {
        setStatus('error');
      }
    }
  };

  // Success animation with longer duration
  useEffect(() => {
    if (status === 'success' && isMounted.current) {
      Animated.timing(completionAnim, {
        toValue: 1,
        duration: 3000, // Extended to 3 seconds
        useNativeDriver: true,
      }).start();
    }
  }, [status]);

  useEffect(() => {
    const handleSync = async () => {
      if (!user?.id || !isMounted.current) return;
      
      try {
        console.log('🔄 Verify Identity Success: Syncing user data...');
        await syncFromSupabase(db, user.id);
        
        if (!isMounted.current) return;
        
        // Check if onboarding is now completed
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.is_id_verified) {
          setStatus('success');
          console.log('✅ Verify Identity Success: Onboarding completed, redirecting to app...');
          // Extended delay to show success animation for 3 seconds
          syncTimeoutRef.current = setTimeout(() => {
            if (isMounted.current) {
              router.push('/(public)/(onboarding)/subscribe');
            }
          }, 3500); // Increased to 3.5 seconds to allow animation to complete
        } else {
          // Webhook might not have processed yet, retry after delay
          if (syncAttempts < 5 && isMounted.current) {
            setSyncAttempts(prev => prev + 1);
            syncTimeoutRef.current = setTimeout(handleSync, 2000); // Retry every 2 seconds
          } else if (isMounted.current) {
            setStatus('error');
          }
        }
      } catch (error) {
        console.error('❌ Verify Identity Success: Sync error:', error);
        if (isMounted.current) {
          setStatus('error');
        }
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
        <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Floating Particles */}
      <FloatingParticles count={6} />

      {/* Logo Animation */}
      <View style={styles.logoContainer}>
        <AnimatedLogo 
          size={120}
          logoText="🐝"
          color="#f59e0b"
        />
      </View>

      {/* Enhanced Welcome Text */}
      <View style={styles.textContainer}>
        <AnimatedText
          fontSize={32}
          fontWeight="bold"
          color="#f59e0b"
          enablePulse={true}
          enableGlow={true}
        >
          Willkommen bei
        </AnimatedText>
        <AnimatedText
          fontSize={24}
          fontWeight="600"
          color="#374151"
          enablePulse={true}
          enableGlow={true}
        >
          Wir helfen aus e.V.
        </AnimatedText>

        {/* Decorative elements */}
        <View style={styles.decorativeContainer}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.decorativeDot} />
          ))}
        </View>
      </View>

      {/* Status Message */}
      <AnimatedText
        style={styles.message}
        enablePulse={true}
        enableGlow={false}
      >
        {getStatusMessage()}
      </AnimatedText>

      {/* Enhanced Loading Indicator */}
      <AnimatedLoadingIndicator 
        size="large"
        color="#ff9a00"
        showProgressDots={true}
        dotCount={5}
        dotColor="#f59e0b"
      />

      {/* Success Animation */}
      {status === 'success' && (
        <Animated.View
          style={[
            styles.successContainer,
            {
              opacity: completionAnim,
              transform: [{ scale: completionAnim }],
            },
          ]}
        >
          <Text style={styles.successText}>✨ Bereit! ✨</Text>
        </Animated.View>
      )}

      {/* Error Container */}
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
    position: 'relative',
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  decorativeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    backgroundColor: '#f59e0b',
    borderRadius: 4,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
    lineHeight: 24,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
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