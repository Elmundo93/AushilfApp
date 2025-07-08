// app/(public)/onboarding/intro.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePathname } from 'expo-router';
import { BlurView } from 'expo-blur';
import { onboardingSharedStyles, getResponsiveSize, getResponsivePadding, getResponsiveMargin } from '../sharedStyles';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { LinearGradient } from 'expo-linear-gradient';

export default function IntroScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'savety'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  const handleNext = () => {
    router.push('userinfo' as any);
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      headerTitle="Willkommen in der AushilfApp!"
      backRoute="/(public)/loginScreen"
    >
      <View style={styles.contentContainer}>
        <View style={styles.outerContainer}>
          <BlurView 
            intensity={100} 
            tint="light" 
            style={[
              onboardingSharedStyles.formCard, 
              { 
                padding: getResponsivePadding(400), 
                borderRadius: 25,
                marginBottom: 150,
                justifyContent: 'space-between'
              }
            ]}
          >
                      <Text style={styles.text}>
              Schön, dass du da bist!{'\n\n'}
              Wir möchten dir ein paar Fragen stellen, um dein Profil zu vervollständigen und dir passende Hilfe oder Angebote in deiner Nähe zu zeigen.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <LinearGradient
                colors={['#FFB41E', '#FF9900']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Jetzt starten</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'flex-start',
    flex: 1,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
    
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
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
});

