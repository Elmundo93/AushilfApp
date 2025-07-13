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
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SvgXml } from 'react-native-svg';
import { useRouter, usePathname } from 'expo-router';

import { useAuthStore } from '@/components/stores/AuthStore';
import { startIdentityVerification } from '@/components/services/stripe/startIdentityVerification';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { onboardingSharedStyles, getResponsivePadding } from './sharedStyles';
import { Ionicons } from '@expo/vector-icons';

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
        onSuccess: () => router.push('/verify-identity-success' as any),
        onCancel: () => router.push('/verify-identity-canceled' as any),
        onError: (msg) => Alert.alert('Fehler', msg),
      });
    } catch (err) {
      Alert.alert('Fehler', 'Verifikation konnte nicht gestartet werden.');
    }
  };

  // Handle deep links
  useEffect(() => {
    const sub = Linking.addEventListener('url', (event) => {
      console.log('📥 App wurde mit URL geöffnet:', event.url);
    });
  
    return () => sub.remove();
  }, []);
  console.log('🔍 Aktueller Pfad:', pathname);

  const infoBoxes = [
    {
      icon: 'shield-checkmark-outline',
      color: '#2e7d32',
      text: 'Die AushilfApp wird nur von verifizierten Nutzer:innen verwendet – für ein gutes Gefühl bei jedem Kontakt.',
    },
    {
      icon: 'document-text-outline',
      color: '#1565c0',
      text: 'Für die Verifikation ist ein gültiges Ausweisdokument erforderlich (z.B. Personalausweis oder Führerschein)',
    },
    {
      icon: 'information-circle-outline',
      color: '#FF9900',
      text: 'Private Daten werden DSGVO-konform verarbeitet und nicht weitergegeben.',
    },
  ];
  

  return (
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      backRoute="/(public)/(onboarding)/intro"
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.outerContainer}>
            <BlurView 
              intensity={100} 
              tint="light" 
              style={[
                onboardingSharedStyles.formCard, 
                { 
                  padding: getResponsivePadding(400), 
                  borderRadius: 25,
                  margin: 20
                }
              ]}
            >
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <SvgXml
                xml={`<svg width="120" height="120" viewBox="0 0 24 24" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="#FF9A00"/>
                    </svg>`}
                width={120}
                height={120}
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.title}>🔒 Sicherheit steht an erster Stelle</Text>
            </View>

            {infoBoxes.map((box, i) => (
              <View key={i} style={styles.infoBox}>
                <Ionicons name={box.icon as any} size={28} color={box.color} />
                <Text style={styles.infoText}>
                  {box.text}
                </Text>
              </View>
            ))}

         
            <TouchableOpacity style={styles.button} onPress={handleVerifyPress}>
              <LinearGradient
                colors={['#FFB41E', '#FF9900']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Verstanden & weiter</Text>
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9a00',
  },
  infoText: {
    flex: 1,
    fontSize: 18,
    color: '#444',
    lineHeight: 22,
  },
  trustNote: {
    fontSize: 13,
    color: '#555',
    marginTop: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});