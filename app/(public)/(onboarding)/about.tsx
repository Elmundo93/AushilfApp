// app/(public)/onboarding/about.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import styles, { getLottieStyle } from './styles';
import { onboardingStyles} from './styles'; 





export default function AboutScreen() {

  const beeAnimation = require('@/assets/animations/Bee.json');
  const router = useRouter();
  const {  setField, categories, bio } = useOnboardingStore();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories || []);



  const toggleCategory = (label: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(label)
        ? prev.filter(cat => cat !== label)
        : [...prev, label];
      setField('categories', newCategories as any);
      return newCategories;
    });
  };

  const handleNext = () => {
    router.push('profileImage' as any);
  };

  const pathname = usePathname();

  const steps = ['intro', 'userinfo', 'intent','about', 'profileImage', 'password'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));


  return (
    <SafeAreaView style={onboardingStyles.container}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <TouchableOpacity style={onboardingStyles.backButton} onPress={() => router.replace('/(public)/(onboarding)/intent')}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
              <View style={onboardingStyles.titleContainer}>
                <Text style={onboardingStyles.title}>Stelle dich kurz vor! </Text>
              </View>
            </View>
          </View>

          <View style={onboardingStyles.contentContainer}>
            <View style={[onboardingStyles.card, {marginTop: -100}]}>
             
              <Text style={onboardingStyles.text}>Verfasse ein 'Über mich' Text. {'\n'} Beschreibe wobei du helfen könntest oder wobei du Hilfe suchst.</Text>
              <TextInput
                style={onboardingStyles.textArea}
                placeholder="Schreibe etwas über dich..."
                multiline
                numberOfLines={4}
                value={bio}
                onChangeText={(text) => setField('bio', text)}
              />

              <TouchableOpacity style={onboardingStyles.button} onPress={handleNext}>
                <Text style={onboardingStyles.buttonText}>Weiter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};