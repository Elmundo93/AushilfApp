// app/(public)/onboarding/intent.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { getIconForCategory } from '@/components/Pinnwand/utils/CategoryAndOptionUtils';
import { onboardingSharedStyles, getResponsiveSize, getResponsivePadding, getResponsiveMargin } from './sharedStyles';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const CATEGORIES = [
  { label: 'Garten', color: '#90EE90', key: 'garten' },
  { label: 'Haushalt', color: '#ADD8E6', key: 'haushalt' },
  { label: 'Soziales', color: '#FF6666', key: 'soziales' },
  { label: 'Gastro', color: '#FFFF66', key: 'gastro' },
  { label: 'Handwerk', color: '#FFA500', key: 'handwerk' },
  { label: 'Bildung', color: '#D3D3D3', key: 'bildung' },
];

export default function IntentScreen() {
  const router = useRouter();
  const { setField, categories } = useOnboardingStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories || []);
  const pathname = usePathname();
  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'savety'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  React.useEffect(() => {
    setSelectedCategories(categories || []);
  }, [categories]);

  const toggleCategory = (label: string) => {
    const newCategories = selectedCategories.includes(label)
      ? selectedCategories.filter(cat => cat !== label)
      : [...selectedCategories, label];
    setSelectedCategories(newCategories);
    setField('categories', newCategories as any);
  };

  const handleNext = () => {
    router.push('about' as any);
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      headerTitle="Wobei möchtest du helfen oder Hilfe finden?"
      backRoute="/(public)/(onboarding)/userinfo"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.outerContainer}>
            <BlurView 
              intensity={20} 
              tint="light" 
              style={[
                onboardingSharedStyles.formCard, 
                { 
                  margin: 20,
                  padding: 20,
                  borderRadius: 25,
                  flex: 1,
                  justifyContent: 'space-between'
                }
              ]}
            >
            <View style={styles.contentContainer}>
              <Text style={styles.subtitle}>Wähle Kategorien in denen du Hilfe suchst oder anbieten möchtest. {'\n'}  </Text>
              <View style={styles.categoryContainer}>
                {CATEGORIES.map(({ label, color, key }) => (
                  <TouchableOpacity
                    key={label}
                    style={styles.categoryButton}
                    onPress={() => toggleCategory(label)}
                  >
                    <BlurView 
                      intensity={80} 
                      tint="light" 
                      style={[
                        styles.categoryBlurView,
                        {
                          borderColor: color,
                          borderWidth: selectedCategories.includes(label) ? 2 : 1,
                          backgroundColor: selectedCategories.includes(label) ? color + 'E0' : 'rgba(255, 255, 255, 0.3)',
                        }
                      ]}
                    >
                      <Image 
                        source={getIconForCategory(key)}
                        style={{
                          width: 55,
                          height: 55,
                          marginBottom: 8,
                          opacity: selectedCategories.includes(label) ? 1 : 0.7,
                        }}
                      />
                      <Text style={{ 
                        color: selectedCategories.includes(label) ? '#000' : '#333', 
                        fontWeight: selectedCategories.includes(label) ? 'bold' : '600',
                        fontSize: 15,
                        textAlign: 'center',
                        textShadowColor: 'rgba(255, 255, 255, 0.8)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2,
                      }}>{label}</Text>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <LinearGradient
                colors={['#FFB41E', '#FF9900']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Weiter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 26,
    color: '#444',
    fontWeight: 'bold',

    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',

    flex: 1,
  },
  categoryButton: {
    margin: 8,
    borderRadius: 25,
    overflow: 'hidden',
    minWidth: 100,
    minHeight: 50,
  },
  categoryBlurView: {
    borderWidth: 1,
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    minHeight: 100,
  
    elevation: 3,
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 20,
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