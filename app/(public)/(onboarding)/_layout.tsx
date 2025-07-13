// app/(public)/onboarding/_layout.tsx

import React, { useEffect } from 'react';
import { Stack, usePathname } from 'expo-router';
import { prefetchAvatars } from '@/components/lib/prefetchOnboarding';

import { getCurrentStep } from '@/app/(public)/(onboarding)/utils/stepUtils';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';




export default function OnboardingLayout() {
  const { entersIntent } = useOnboardingStore();
  const pathname = usePathname();
  console.log(pathname);
  const currentStep = getCurrentStep(pathname);

  useEffect(() => {
    // Start prefetching avatars in the background when user is on intro screen
    // This ensures avatars are ready when they reach the intent screen
    if (currentStep === 'intro') {
      console.log('🎯 Starting background avatar prefetch...');
      // Use setTimeout to ensure this doesn't block the current render
      setTimeout(() => {
        prefetchAvatars().catch(error => {
          console.error('❌ Failed to prefetch avatars:', error);
        });
      }, 100);
    }
  }, [currentStep]);

  return (
  
     

      <Stack screenOptions={{ headerShown: false }} />
  
  );
}

;
