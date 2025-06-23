import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import UserProfileHeaderPreview from '@/components/Profile/UserProfileHeaderPreview';
import onboardingStyles from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import PreviewAccordion from '@/components/Anmelden/PreviewAccordion';
import { useAuth } from '@/components/hooks/useAuth';
import { pushUserToSupabase } from '@/components/services/Storage/Syncs/UserSyncService';
import { useAuthStore } from '@/components/stores/AuthStore';


const CATEGORIES = [
  { label: 'Garten', key: 'garten' },
  { label: 'Haushalt', key: 'haushalt' },
  { label: 'Soziales', key: 'soziales' },
  { label: 'Gastro', key: 'gastro' },
  { label: 'Handwerk', key: 'handwerk' },
  { label: 'Bildung', key: 'bildung' },
];

export default function ConclusionScreen() {
  const { user, setUser } = useAuthStore();
  const db = useSQLiteContext();
  const { register } = useAuth();
  const router = useRouter();
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
  const steps = ['intro', 'userinfo', 'intent', 'about', 'profileImage', 'password','conclusion','savety'];
  
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories || []);

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
    router.push('savety' as any);
  } catch (error) {
    console.error('❌ Fehler beim Abschluss des Onboardings:', error);
    Alert.alert(
      'Fehler',
      'Bei der Aktualisierung ist ein Fehler aufgetreten. Bitte versuche es erneut oder kontaktiere den Support.'
    );
  }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity
        style={onboardingStyles.backButton}
        onPress={() => router.replace('/(public)/(onboarding)/intent')}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 25,
          paddingTop: 80,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={onboardingStyles.title}>Fast geschafft!</Text>

        <View style={[onboardingStyles.card, { marginTop: 20 }]}>
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

          <TouchableOpacity style={onboardingStyles.button} onPress={handleFinish}>
            <Text style={onboardingStyles.buttonText}>Los geht's!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 15,
  },
  profilePreviewContainer: {
    marginTop: 20,
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
});