import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { useAuthStore } from '@/components/stores/AuthStore';
import { startStripeSubscriptionFlow } from '@/components/services/stripe/startStripeSubscription';
import onboardingStyles, { getLottieStyle } from './styles';



const steps = ['intro', 'userinfo', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'savety'];

export default function SavetyScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const currentStep = steps.findIndex((step) => pathname.includes(step));
  const beeAnimation = require('@/assets/animations/Bee.json');

  const handleStripePress = () => {
    if (!user?.id || !user?.email) {
      return Alert.alert('Fehler', 'Benutzerdaten fehlen.');
    }
  
    startStripeSubscriptionFlow({
      userId: user.id,
      email: user.email,
      onSuccess: () => router.replace('/(authenticated)/pinnwand'),
      onCancel: () => Alert.alert('Abbruch', 'Du kannst später fortfahren'),
      onError: (msg) => Alert.alert('Fehler', msg),
    });
  };

  return (
    <View style={onboardingStyles.safeAreaContainer}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity
        style={onboardingStyles.backButton}
        onPress={() => router.replace('/(public)/(onboarding)/intro')}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Lottie + Fortschritt */}
          <View style={onboardingStyles.topContainer}>
            <LottieView source={beeAnimation} autoPlay loop style={getLottieStyle(currentStep)} />
            <View style={onboardingStyles.progressContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[onboardingStyles.dot, index <= currentStep && onboardingStyles.activeDot]}
                />
              ))}
            </View>
            <View style={onboardingStyles.titleCard}>
              <View style={[onboardingStyles.titleContainer, { marginTop: 28 }]}>
                <SvgXml
                  xml={`<svg width="120" height="120" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="#FF9A00"/>
                      </svg>`}
                  width={120}
                  height={120}
                />
                <Text style={styles.title}>🔒 Sicherheit steht an erster Stelle</Text>
              </View>
            </View>
          </View>

          {/* Inhalt */}
          <View style={onboardingStyles.card}>
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
              <Text style={styles.buttonText}>Verstanden & weiter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
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
    marginTop: 24,
    backgroundColor: '#ff9a00',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});