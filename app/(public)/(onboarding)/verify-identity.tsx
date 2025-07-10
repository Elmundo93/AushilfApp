// File: app/(public)/(onboarding)/verify-identity.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SvgXml } from 'react-native-svg';
import { useRouter, usePathname } from 'expo-router';

import { useAuthStore } from '@/components/stores/AuthStore';
import { startIdentityVerification } from '@/components/services/stripe/startIdentityVerification';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { onboardingSharedStyles } from './sharedStyles';

const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'verify-identity', 'subscribe'];

export default function VerifyIdentityScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  const handleVerifyPress = async () => {
    if (!user?.id) return Alert.alert('Fehler', 'User-ID fehlt.');

    try {
      await startIdentityVerification({
        userId: user.id,
        onError: (msg) => Alert.alert('Fehler', msg),
      });
    } catch (err) {
      Alert.alert('Fehler', 'Verifikation konnte nicht gestartet werden.');
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep} steps={steps} backRoute="/(public)/(onboarding)/conclusion">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.outerContainer}>
            <BlurView intensity={100} tint="light" style={[onboardingSharedStyles.formCard, styles.blurCard]}>
              <View style={styles.centered}>
                <SvgXml
                  xml={`<svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="#FF9A00"/>
                  </svg>`}
                  width={120}
                  height={120}
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.title}>🔐 Identität bestätigen</Text>
              </View>

              <Text style={styles.paragraph}>
                Bitte bestätige deine Identität per Personalausweis, um die AushilfApp sicher nutzen zu können.
              </Text>

              <Text style={styles.note}>
                Deine Daten werden DSGVO-konform verarbeitet. Wir speichern keine Ausweisdaten.
              </Text>

              <TouchableOpacity style={styles.button} onPress={handleVerifyPress}>
                <LinearGradient colors={['#fceabb', '#f8b500']} style={styles.gradientButton}>
                  <Text style={styles.buttonText}>Jetzt verifizieren</Text>
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