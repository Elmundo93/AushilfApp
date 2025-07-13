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

// Mapping von Kategorie-Keys zu Labels
const CATEGORY_MAPPING = {
  'garten': 'Garten',
  'haushalt': 'Haushalt',
  'soziales': 'Soziales',
  'gastro': 'Gastro',
  'handwerk': 'Handwerk',
  'bildung': 'Bildung',
};

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

  // Konvertiere Kategorie-Keys zu Labels für die Anzeige
  const categoryLabels = selectedCategories.map(key => CATEGORY_MAPPING[key as keyof typeof CATEGORY_MAPPING] || key);

  const handleCategoryToggle = (category: string) => {
    // Finde den Key für das Label
    const categoryKey = Object.keys(CATEGORY_MAPPING).find(key => CATEGORY_MAPPING[key as keyof typeof CATEGORY_MAPPING] === category);
    
    if (categoryKey) {
      const newCategories = selectedCategories.includes(categoryKey)
        ? selectedCategories.filter(cat => cat !== categoryKey)
        : [...selectedCategories, categoryKey];
      
      setSelectedCategories(newCategories);
      setField('categories', newCategories);
      persist();
    }
  };

  const handleBioChange = (text: string) => {
    setField('bio', text);
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

        });
      }

      setUser({ ...updatedUser });

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

          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        scrollEventThrottle={16}
      >
        <View style={styles.container}>
          {/* Main content card */}
          <BlurView 
            intensity={100} 
            tint="light" 
            style={styles.mainCard}
          >
            <Text style={onboardingSharedStyles.headerTitle}>Zusammenfassung</Text>
            
            {/* Success info card */}
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#2e7d32" />
              <Text style={styles.successText}>
                Andere Nutzer können dir in der AushilfApp sogar Danksagungen hinterlassen! 🎉
              </Text>
            </View>

            {/* Profile preview */}
            <UserProfileHeaderPreview
              user={{
                fullName: userInfo.vorname + ' ' + userInfo.nachname,
                email: userInfo.email,
                profileImage: profileImage || '',
                bio: bio || '',
                kategorien: categoryLabels,
              }}
              danksagungsLength={0}
              isEditable={true}
              onCategoryToggle={handleCategoryToggle}
              onBioChange={handleBioChange}
            />
          </BlurView>
          

          {/* Data verification card */}
          <BlurView 
            intensity={100} 
            tint="light" 
            style={styles.verificationCard}
          >
            <Text style={styles.verificationTitle}>
              Bitte überprüfe deine Nutzerdaten auf Richtigkeit und Vollständigkeit
            </Text>

            <PreviewAccordion
              isExpanded={isExpanded}
              onToggle={() => setIsExpanded(!isExpanded)}
              accordionTitle="Persönliche Daten"
              isOnboarding={true}
              isOnboardingStep={true}
            />
          </BlurView>

          {/* Action button */}
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
  container: {
    paddingHorizontal: 10,
    gap: 16,
  },
  mainCard: {
    padding: getResponsivePadding(200),
    borderRadius: 25,
    overflow: 'hidden',
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#81c784',
  },
  successText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    color: '#1b5e20',
  },
  verificationCard: {
    padding: getResponsivePadding(400),
    borderRadius: 25,
    overflow: 'hidden',
  },
  verificationTitle: {
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 8,
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