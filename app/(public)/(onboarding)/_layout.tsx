// app/(public)/onboarding/_layout.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const steps = ['intro', 'userinfo', 'intent', 'profileImage'];

export default function OnboardingLayout() {
  const pathname = usePathname();
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  return (
  
     

      <Stack screenOptions={{ headerShown: false }} />
  
  );
}

;
