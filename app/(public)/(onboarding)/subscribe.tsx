import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
  Image,
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
  import { useOnboardingStore } from '@/components/stores/OnboardingContext';

const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'savety'];

export default function SavetyScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const currentStep = steps.findIndex((step) => pathname.includes(step));
  const { reset } = useOnboardingStore();
  const handleStripePress = () => {
    if (!user?.id || !user?.email) {
      return Alert.alert('Fehler', 'Benutzerdaten fehlen.');
    }
  
    startStripeSubscriptionFlow({
      userId: user.id,
      email: user.email,
      onSuccess: () => router.replace('/payment-success' as any),
      onCancel: () => Alert.alert('Abbruch', 'Du kannst später fortfahren'),
      onError: (msg) => Alert.alert('Fehler', msg),
    });
    reset();
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
             <Image source={require('@/assets/images/BienenLogoNeat.png')} style={{ width: 100, height: 90, marginBottom: 10 }} />
              <Text style={styles.title}>Minimalbetrag zur Erhaltung der AushilfApp</Text>
            </View>

            {infoBoxes.map((box, i) => (
              <View key={i} style={styles.infoBox}>
                <Ionicons name={box.icon as any} size={28} color={box.color} />
                <Text style={styles.infoText}>
                  {box.text}
                </Text>
              </View>
            ))}


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
    icon: 'people-outline',
    color: '#FF9900',
    text: 'Die AushilfApp ist ein gemeinnütziges Projekt, des Wir helfen aus e.V..',
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