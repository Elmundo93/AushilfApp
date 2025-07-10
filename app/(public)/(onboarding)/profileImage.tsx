import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, usePathname } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { Ionicons } from '@expo/vector-icons';
import { onboardingSharedStyles, getResponsiveSize, getResponsivePadding, getResponsiveMargin } from './sharedStyles';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const AVATAR_COLLECTIONS = [
  {
    label: 'Avataaars',
    baseUrl: 'https://api.dicebear.com/7.x/avataaars/png?seed=',
    seeds: [ 'Andrea', 'Jude', 'Chase', 'Vivian', 'Maria','Liliana', 'Ryker', 'Aiden'],
  },
  {
    label: 'Adventurer',
    baseUrl: 'https://api.dicebear.com/7.x/adventurer/png?seed=',
    seeds: [ 'Jude', 'Vivian', 'Jade', 'Liliana', 'Quentin', 'Aiden','Andrea','Sadie'],
  },
  {
    label:'Notionists',
    baseUrl:'https://api.dicebear.com/7.x/notionists/png?seed=',
    seeds:['Sara','Riley', 'Ryan','Andrea','Adrian', 'Liliana', 'Vivian', 'Mackenzie','Maria', 'Jameson',]
  }
];

const getAvatarUrl = (baseUrl: string, seed: string) => `${baseUrl}${seed}`;

export default function ProfileImageScreen() {
  const router = useRouter();
  const { profileImage, setField, persist } = useOnboardingStore();
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
  const pathname = usePathname();

  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'verify-identity', 'subscribe'];
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
      setSelectedSeed(null);
      await persist();
    }
  };

  const handleAvatarSelect = async (baseUrl: string, seed: string) => {
    const uri = getAvatarUrl(baseUrl, seed);
    setSelectedSeed(seed);
    setField('profileImage', uri);
    await persist();
  };

  const handleNext = () => {
    router.push('/(public)/(onboarding)/password');
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      headerTitle="Wähle dein Profilbild!"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
         <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
                  margin: 20
                }
              ]}
            >

              <View style={styles.topRow}>
                <View style={styles.previewContainer}>
                  <Text style={styles.subtitle}>Vorschau</Text>
                  <Image 
                    source={profileImage ? { uri: profileImage } : require('@/assets/images/avatar-thinking-4-svgrepo-com.png')} 
                    style={styles.previewImage} 
                  />
                </View>

                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <Ionicons name="camera" size={40} color="#666" />
                  <Text style={styles.imageButtonText}>Profilbild auswählen</Text>
                </TouchableOpacity>
              </View>

            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Oder wähle einen Avatar</Text>
              <View style={styles.orLine} />
            </View>

            {AVATAR_COLLECTIONS.map(({ label, baseUrl, seeds }) => (
              <View key={label} style={{ marginBottom: 20 }}>
                <Text style={styles.avatarCollectionLabel}>{label}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {seeds.map((seed) => {
                    const uri = getAvatarUrl(baseUrl, seed);
                    const isSelected = profileImage === uri;
                    return (
                      <TouchableOpacity
                        key={seed}
                        onPress={() => handleAvatarSelect(baseUrl, seed)}
                        style={[
                          styles.avatarContainer,
                          isSelected && styles.avatarSelectedBorder,
                        ]}
                      >
                        <Image source={{ uri }} style={styles.avatar} />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ))}

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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  previewContainer: {
    alignItems: 'center',
    flex: 1,
    marginRight: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ff9a00',
  },
  imageButton: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,

    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 20,
    borderColor: '#ff9a00',
  },
  imageButtonText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 22,
    color: '#666',
  },
  avatarCollectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  avatarContainer: {
    marginRight: 10,
    padding: 2,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelectedBorder: {
    borderColor: '#ff9a00',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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