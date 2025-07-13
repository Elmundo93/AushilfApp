import React from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  Text,
  StyleSheet,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { onboardingSharedStyles, getResponsiveSize, getResponsivePadding, getResponsiveMargin } from '@/app/(public)/(onboarding)/sharedStyles';
import OnboardingBackground from '@/components/Onboarding/OnboardingBackground';
import { getCurrentStep } from '@/app/(public)/(onboarding)/utils/stepUtils';
import { LinearGradient } from 'expo-linear-gradient';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  steps: string[];
  headerTitle?: string;
  onBack?: () => void;
  backRoute?: string;
  beeAnimation?: any;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  steps,
  headerTitle,
  onBack,
  backRoute,
  beeAnimation,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const defaultBeeAnimation = require('@/assets/animations/Bee.json');
  const animationSource = beeAnimation || defaultBeeAnimation;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backRoute) {
      router.push(backRoute as any);
    }
  };

  return (
    <View style={onboardingSharedStyles.mainContainer}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <OnboardingBackground step={getCurrentStep(pathname)} />
      <View style={onboardingSharedStyles.backgroundOverlay} />

      <TouchableOpacity
        style={onboardingSharedStyles.backButton}
        onPress={handleBack}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[onboardingSharedStyles.mainContainer, { minHeight: screenHeight }]}>
            {/* Progress Container */}
            <View style={onboardingSharedStyles.topSection}>
              <LottieView 
                source={animationSource} 
                autoPlay 
                loop 
                style={[
                  onboardingSharedStyles.beeAnimation, 
                  { width: screenWidth * 0.2, height: screenWidth * 0.2 }
                ]} 
              />
              <View style={onboardingSharedStyles.progressContainer}>
                {steps.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      onboardingSharedStyles.dot, 
                      index <= currentStep && onboardingSharedStyles.activeDot
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Glassy Header */}
            {headerTitle && (
              <View style={onboardingSharedStyles.headerSection}>
                <BlurView intensity={40} tint="light" style={onboardingSharedStyles.headerCard}>
                  <Text style={[
                    onboardingSharedStyles.headerTitle, 
                    { fontSize: getResponsiveSize(20, screenWidth, 0.06) }
                  ]}>
                    {headerTitle}
                  </Text>
                </BlurView>
              </View>
            )}

            {/* Content */}
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}; 