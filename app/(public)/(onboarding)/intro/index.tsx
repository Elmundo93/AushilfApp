// app/(public)/onboarding/intro.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLottieStyle } from '../styles';
import { onboardingStyles} from '../styles'; 



export default function IntroScreen() {
  const router = useRouter();
  const beeAnimation = require('@/assets/animations/Bee.json');

  const handleNext = () => {
    router.push('userinfo' as any);
  };

  const pathname = usePathname();

  const steps = ['intro', 'userinfo', 'intent', 'about', 'profileImage', 'password','conclusion','savety'];  
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  return (
    <SafeAreaView style={onboardingStyles.container}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
       <TouchableOpacity style={onboardingStyles.backButton} onPress={() => router.replace('/(public)/loginScreen')}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <View style={onboardingStyles.topContainer}>
      <LottieView
          source={beeAnimation}
          autoPlay
          loop
          style={getLottieStyle(currentStep)}
        />
        <View style={onboardingStyles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[onboardingStyles.dot, index <= currentStep && onboardingStyles.activeDot]}
            />
          ))}
          
        </View>

        <View style={onboardingStyles.titleCard}>
          <Text style={onboardingStyles.title}>Willkommen in der AushilfApp!</Text>
        </View>
      </View>
      <View style={onboardingStyles.contentContainer}>
        <View style={[onboardingStyles.card, {marginBottom: 150}]}>
          <Text style={onboardingStyles.text}>
            Schön, dass du da bist!{'\n\n'}
            Wir möchten dir ein paar Fragen stellen, um dein Profil zu vervollständigen und dir passende Hilfe oder Angebote in deiner Nähe zu zeigen.
          </Text>
          <TouchableOpacity style={onboardingStyles.button} onPress={handleNext}>
            <Text style={onboardingStyles.buttonText}>Jetzt starten</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

