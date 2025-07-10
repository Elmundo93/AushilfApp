import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import UserProfileHeaderPreview from '@/components/Profile/UserProfileHeaderPreview';
import { onboardingSharedStyles, getResponsiveSize, getResponsivePadding, getResponsiveMargin } from './sharedStyles';
import { useSQLiteContext } from 'expo-sqlite';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { Ionicons } from '@expo/vector-icons';
import PreviewAccordion from '@/components/Anmelden/PreviewAccordion';
import { useAuth } from '@/components/hooks/useAuth';
import { pushUserToSupabase } from '@/components/services/Storage/Syncs/UserSyncService';
import { useAuthStore } from '@/components/stores/AuthStore';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ScrollIndicator } from '@/components/Animation/ScrollIndicator';
import { useScrollIndicator } from '@/components/hooks/useScrollIndicator';



export default function ConclusionScreen() {
  const { user, setUser } = useAuthStore();
  const db = useSQLiteContext();
  const { register } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const {
    userInfo,
    profileImage,
    bio,
    categories,
    setField,
    persist,
    reset,
    password,
  } = useOnboardingStore();
  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'verify-identity', 'subscribe'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));
  
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories || []);

  // Scroll indicator setup
  const scrollViewRef = useRef<ScrollView>(null);
  const { showIndicator, handleScroll, handleContentSizeChange, handleLayout } = useScrollIndicator({
    scrollViewRef,
    threshold: 50,
    delay: 1500, // Show after 1.5 seconds
  });

  const handleScrollIndicatorPress = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  React.useEffect(() => {
    setSelectedCategories(categories || []);
  }, [categories]);

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(cat => cat !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    setField('categories', newCategories);
    persist();
  };

  const handleFinish = async () => {
    try {
      const finalUser = {
        ...userInfo,
        id: user?.id || '', 
        created_at: user?.created_at || new Date().toISOString(),
        location: null,
        bio: bio ?? '',
        profileImageUrl: profileImage ?? '',
        kategorien: selectedCategories,
      };

      let updatedUser;
      if (user?.id) {
        // Bestehender User: Nur Update
        await pushUserToSupabase(finalUser);
        updatedUser = { ...user, ...finalUser };
      } else {
        // Neuer User: Registrierung
        updatedUser = await register(userInfo.email, password ?? '', finalUser);
        if (!updatedUser) {
          throw new Error('Registrierung fehlgeschlagen');
        }
        await pushUserToSupabase({
          ...updatedUser,
          bio: bio ?? '',
          profileImageUrl: profileImage ?? '',
          kategorien: selectedCategories,
          onboarding_completed: true,
        });
      }

      setUser({ ...updatedUser });
      reset();
      router.push('/(public)/(onboarding)/verify-identity' as any);
    } catch (error) {
      console.error('❌ Fehler beim Abschluss des Onboardings:', error);
      Alert.alert(
        'Fehler',
        'Bei der Aktualisierung ist ein Fehler aufgetreten. Bitte versuche es erneut oder kontaktiere den Support.'
      );
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}

      backRoute="/(public)/(onboarding)/intent"
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        scrollEventThrottle={16}
      >
        <View style={styles.outerContainer}>
          <BlurView 
            intensity={100} 
            tint="light" 
            style={[
              onboardingSharedStyles.formCard, 
              { 
                padding: getResponsivePadding(400), 
                borderRadius: 25,
                marginHorizontal: 20,
                marginVertical: 10
              }
            ]}
          >

          <Text style={onboardingSharedStyles.headerTitle}>Zusammenfassung</Text>
          <View style={styles.contentContainer}>
            <View style={styles.sideInfoCard}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#2e7d32" />
              <Text style={styles.sideInfoText}>Andere Nutzer können dir in der AushilfApp sogar Danksagungen hinterlassen! 🎉</Text>
            </View>

            <View style={styles.profilePreviewContainer}>
              <UserProfileHeaderPreview
                user={{
                  fullName: userInfo.vorname + ' ' + userInfo.nachname,
                  email: userInfo.email,
                  profileImage: profileImage || '',
                  bio: bio || '',
                  kategorien: selectedCategories,
                }}
                danksagungsLength={0}
                isEditable={true}
                onCategoryToggle={handleCategoryToggle}
              />

              <Text style={styles.subtitle}>
                Bitte überprüfe deine Nutzerdaten auf Richtigkeit und Vollständigkeit
              </Text>

              <PreviewAccordion
                isExpanded={isExpanded}
                onToggle={() => setIsExpanded(!isExpanded)}
                accordionTitle="Persönliche Daten"
                isOnboarding={true}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleFinish}>
              <LinearGradient
                colors={['#FFB41E', '#FF9900']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Los geht's!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
        </View>
      </ScrollView>
      
      {/* Scroll Indicator */}
      <ScrollIndicator 
        isVisible={showIndicator} 
        onPress={handleScrollIndicatorPress}
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  contentContainer: {
    width: '100%',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 15,
  },
  profilePreviewContainer: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sideInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#81c784',
  },
  sideInfoText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    color: '#1b5e20',
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