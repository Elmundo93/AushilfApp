// File: app/(public)/(onboarding)/subscribe.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { SvgXml } from 'react-native-svg';

import { useAuthStore } from '@/components/stores/AuthStore';
import { startStripeSubscriptionFlow } from '@/components/services/stripe/startStripeSubscription';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { onboardingSharedStyles } from './sharedStyles';

const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'verify-identity', 'subscribe'];

export default function SubscribeScreen() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user?.is_id_verified) {
      router.replace('/(public)/(onboarding)/verify-identity');
    }
  }, [user?.is_id_verified]);

  const handleSubscribe = async () => {
    if (!user?.id || !user?.email) {
      return Alert.alert('Fehler', 'Benutzerdaten fehlen.');
    }

    await startStripeSubscriptionFlow({
      userId: user.id,
      email: user.email,
      onSuccess: () => router.replace('/(public)/(onboarding)/payment-success'),
      onCancel: () => Alert.alert('Abbruch', 'Du kannst später fortfahren'),
      onError: (msg) => Alert.alert('Fehler', msg),
    });
  };

  return (
    <OnboardingLayout currentStep={steps.length - 1} steps={steps} backRoute="/(public)/(onboarding)/verify-identity">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.outerContainer}>
            <BlurView intensity={100} tint="light" style={[onboardingSharedStyles.formCard, styles.blurCard]}>
              <View style={styles.centered}>
                <SvgXml
                  xml={`<svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.19 6.84 9.5l1.16-4.65c-1.52-.69-2.5-2.22-2.5-3.85 0-2.49 2.01-4.5 4.5-4.5s4.5 2.01 4.5 4.5c0 1.63-.98 3.16-2.5 3.85l1.16 4.65C19.13 20.19 22 16.41 22 12c0-5.52-4.48-10-10-10z" fill="#FF9900"/>
                  </svg>`}
                  width={120}
                  height={120}
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.title}>🎉 Fast geschafft</Text>
              </View>

              <Text style={styles.paragraph}>
                Mit einem kleinen Beitrag von 0,99 € pro Monat hilfst du dabei, die AushilfApp dauerhaft und werbefrei zu betreiben.
              </Text>

              <Text style={styles.note}>
                100 % fließen in den gemeinnützigen Betrieb. Du kannst jederzeit kündigen.
              </Text>

              <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
                <LinearGradient colors={['#FFB41E', '#FF9900']} style={styles.gradientButton}>
                  <Text style={styles.buttonText}>Abo starten</Text>
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  blurCard: {
    padding: 24,
    borderRadius: 25,
    margin: 20,
  },
  centered: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
  },
  note: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});