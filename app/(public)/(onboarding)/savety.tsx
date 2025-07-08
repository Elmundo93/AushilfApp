import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { useAuthStore } from '@/components/stores/AuthStore';
import { startStripeSubscriptionFlow } from '@/components/services/stripe/startStripeSubscription';
import { onboardingSharedStyles, getResponsiveSize, getResponsivePadding, getResponsiveMargin } from './sharedStyles';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'savety'];

export default function SavetyScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  const handleStripePress = () => {
    if (!user?.id || !user?.email) {
      return Alert.alert('Fehler', 'Benutzerdaten fehlen.');
    }
  
    startStripeSubscriptionFlow({
      userId: user.id,
      email: user.email,
      onSuccess: () => router.replace('/(public)/(onboarding)/payment-success' as any),
      onCancel: () => Alert.alert('Abbruch', 'Du kannst später fortfahren'),
      onError: (msg) => Alert.alert('Fehler', msg),
    });
  };

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

            <Text style={styles.trustNote}>
              💡 Alle Daten werden DSGVO-konform verarbeitet und nicht weitergegeben.
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleStripePress}>
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

const infoBoxes = [
  {
    icon: 'shield-checkmark-outline',
    color: '#2e7d32',
    text: 'Die AushilfApp wird nur von verifizierten Nutzer:innen verwendet – für ein gutes Gefühl bei jedem Kontakt.',
  },
  {
    icon: 'card-outline',
    color: '#1565c0',
    text: 'Ein Minimalbetrag von 0,99 €/p.M. hilft uns die Authetikationskosten & die laufenden Kosten zu decken',
  },
  {
    icon: 'heart-outline',
    color: '#d81b60',
    text: 'Deine Zahlung fließt zu 100 % in den gemeinnützigen Betrieb der App und hilft dabei, Hilfe dorthin zu bringen, wo sie gebraucht wird.',
  },
];

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
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
  button: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 24,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});