// app/(public)/onboarding/profileImage.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, usePathname } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLottieStyle } from './styles';
import { onboardingStyles} from './styles'; 

const AVATAR_SEEDS = ['Anna', 'Bernd', 'Clara', 'David', 'Elena', 'Finn'];
const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/adventurer/png?seed=${seed}`;

export default function ProfileImageScreen() {
  const router = useRouter();
  const { profileImage, setField } = useOnboardingStore();
  const [selectedSeed, setSelectedSeed] = useState(null);
  const beeAnimation = require('@/assets/animations/Bee.json');
  const pathname = usePathname();

  const steps = ['intro', 'userinfo', 'intent','about', 'profileImage', 'password'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setField('profileImage', result.assets[0].uri);
      setSelectedSeed(null); // falls vorher Avatar gewählt
    }
  };

  const handleAvatarSelect = (seed: string) => {
    setSelectedSeed(seed as any);
    setField('profileImage', getAvatarUrl(seed));
  };

  const handleNext = () => {
    router.replace('/(public)/(onboarding)/password');
  };

  return (
    <SafeAreaView style={onboardingStyles.container}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <TouchableOpacity style={onboardingStyles.backButton} onPress={() => router.replace('/(public)/(onboarding)/about')}>
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
                <Text style={onboardingStyles.title}>Wähle dein Profilbild</Text>
              </View>
            </View>
          </View>

          <View style={onboardingStyles.contentContainer}>
            <View style={onboardingStyles.card}>
            {profileImage && (
                <View style={onboardingStyles.previewContainer}>
                  <Text style={onboardingStyles.subtitle}>Vorschau</Text>
                  <Image source={{ uri: profileImage }} style={onboardingStyles.previewImage} />
                </View>
              )}
                <TouchableOpacity style={onboardingStyles.imageButton} onPress={pickImage}>
                <Ionicons name="camera" size={40} color="#666" />
                <Text style={onboardingStyles.imageButtonText}>Profilbild auswählen</Text>
              </TouchableOpacity>

              <View style={onboardingStyles.orContainer}>
            <View style={onboardingStyles.orLine} />
            <Text style={onboardingStyles.orText}>Oder wähle einen Avatar</Text>
            <View style={onboardingStyles.orLine} />
          </View>
              <View style={onboardingStyles.avatarGrid}>
                {AVATAR_SEEDS.map((seed) => (
                  <TouchableOpacity key={seed} onPress={() => handleAvatarSelect(seed)}>
                    <Image
                      source={{ uri: getAvatarUrl(seed) }}
                      style={[
                        onboardingStyles.avatar,
                        profileImage === getAvatarUrl(seed) && onboardingStyles.avatarSelected,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>

             

              <TouchableOpacity style={onboardingStyles.button} onPress={handleNext}>
                <Text style={onboardingStyles.buttonText}>Weiter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

