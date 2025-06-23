import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native'; 
import { getLottieStyle, onboardingStyles } from './styles';

export default function AboutScreen() {
  const router = useRouter();
  const { bio, setField, persist, userInfo } = useOnboardingStore();
  const [localBio, setLocalBio] = useState(bio || '');
  const pathname = usePathname();
  const steps = ['intro', 'userinfo', 'intent', 'about', 'profileImage', 'password','conclusion','savety'];
    const currentStep = steps.findIndex((step) => pathname.includes(step));
  const MAX_WORDS = 20;
  const wordCount = localBio.trim().split(/\s+/).filter(word => word.length > 0).length;
  const progress = Math.min((wordCount / MAX_WORDS) * 100, 100);

  useEffect(() => {
    return () => {
      setField('bio', localBio.trim());
      persist();
    };
  }, [localBio]);

  const handleNext = () => {
    setField('bio', localBio.trim());
    persist();
    router.push('/(public)/(onboarding)/profileImage');
  };

  const beeAnimation = require('@/assets/animations/Bee.json');

  return (
    <View style={onboardingStyles.safeAreaContainer}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1, paddingHorizontal: 24 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
            </View>
            <View style={{ marginTop: 40 }}>
            <Text style={onboardingStyles.title}>📝 Eine kleine Vorstellung</Text>
         
        <LottieView 
          source={require('@/assets/animations/write.json')}
          autoPlay={true}
          loop={false}
          style={{ width: 120, height: 120, alignSelf: 'center', marginTop: 20 }}
        />
        


          <Text style={onboardingStyles.subtitle}>
            Schreib ein paar Zeilen über dich – Wobei brauchst du Hilfe? Wobei würdest du gerne Helfen?
          </Text>
        </View>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            multiline
            maxLength={300}
            value={localBio}
            onChangeText={setLocalBio}
            placeholder={`Ich heiße ${userInfo.vorname}, bin gerne im Garten und helfe meinen Nachbarn beim Einkaufen...`}
            placeholderTextColor="#aaa"
          />

          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  { 
                    width: `${progress}%`,
                    backgroundColor: progress >= 100 ? '#4CAF50' : '#ff9a00'
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {wordCount}/{MAX_WORDS} Wörter
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>🎯 Weiter</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginTop: 8,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#555',
    marginTop: 24,
    textAlign: 'center',
  },
  textAreaContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#222',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 32,
    width: '70%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});