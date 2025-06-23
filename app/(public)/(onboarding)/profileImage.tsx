import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, usePathname } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLottieStyle, onboardingStyles } from './styles';

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

  const steps = ['intro', 'userinfo', 'intent', 'about', 'profileImage', 'password','conclusion','savety'];
    const currentStep = steps.findIndex((step) => pathname.includes(step));
  const beeAnimation = require('@/assets/animations/Bee.json');

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
    <View style={onboardingStyles.safeAreaContainer}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

<TouchableOpacity
        style={onboardingStyles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
         <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
           <View style={onboardingStyles.topContainer}>
            <LottieView source={beeAnimation} autoPlay loop style={getLottieStyle(currentStep)} />
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
                <Text style={onboardingStyles.title}>Wähle dein Profilbild!</Text>
              </View>
            </View>
          </View>


          <View style={styles.contentContainer}>
            <View style={styles.card}>
              {profileImage && (
                <View style={styles.previewContainer}>
                  <Text style={styles.subtitle}>Vorschau</Text>
                  <Image source={{ uri: profileImage }} style={styles.previewImage} />
                </View>
              )}

              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Ionicons name="camera" size={40} color="#666" />
                <Text style={styles.imageButtonText}>Profilbild auswählen</Text>
              </TouchableOpacity>

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
                <Text style={styles.buttonText}>Weiter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  topContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  progressContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ff9a00',
  },
  titleCard: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ff9a00',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10,
    marginBottom: 20,
    borderWidth: .5,
    borderColor: '#ccc',
    padding:20,
    borderRadius:24
  },
  imageButtonText: {
    fontSize: 16,
    color: '#666',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#777',
    fontSize: 14,
  },
  avatarCollectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 6,
    color: '#333',
  },
  avatarContainer: {
    marginHorizontal: 6,
    padding: 3,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  avatarSelectedBorder: {
    borderColor: '#ff9a00',
    borderWidth: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  button: {
    backgroundColor: '#ff9a00',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
});