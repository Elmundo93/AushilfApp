import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import LottieView from 'lottie-react-native'; 
import { onboardingSharedStyles, getResponsiveSize, getResponsivePadding, getResponsiveMargin } from './sharedStyles';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function AboutScreen() {
  const router = useRouter();
  const { bio, setField, persist, userInfo } = useOnboardingStore();
  const [localBio, setLocalBio] = useState(bio || '');
  const pathname = usePathname();
  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'savety'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));
  const MAX_WORDS = 20;
  const wordCount = localBio.trim().split(/\s+/).filter(word => word.length > 0).length;
  const progress = Math.min((wordCount / MAX_WORDS) * 100, 100);
  const isProgressComplete = wordCount >= MAX_WORDS;

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

  return (
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      backRoute={'/intent'}
      headerTitle="     Wobei brauchst du Hilfe? Wobei würdest du gerne helfen?"
      

    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <LottieView 
              source={require('@/assets/animations/write.json')}
              autoPlay={true}
              loop={false}
              style={styles.animation}
            />
            
            
          
          </View>

          {/* Form Section */}
          <View style={styles.outerContainer}>
            <BlurView 
              intensity={100} 
              tint="light" 
              style={styles.formCard}
            >
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Deine Vorstellung
              </Text>
              
              <TextInput
                style={styles.textArea}
                multiline
                maxLength={300}
                value={localBio}
                onChangeText={setLocalBio}
                placeholder={`Ich heiße ${userInfo.vorname}, bin gerne im Garten und helfe meinen Nachbarn beim Einkaufen...`}
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
            </View>

            {/* Progress Section */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>
                  Fortschritt
                </Text>
                <Text style={[
                  styles.progressText,
                  { color: isProgressComplete ? '#4CAF50' : '#666' }
                ]}>
                  {wordCount}/{MAX_WORDS} Wörter
                </Text>
              </View>
              
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressBar,
                    { 
                      width: `${progress}%`,
                      backgroundColor: isProgressComplete ? '#4CAF50' : '#FFB41E'
                    }
                  ]}
                />
              </View>
            </View>

            {/* Button Section */}
            <TouchableOpacity 
              style={[
                styles.button,
                { opacity: wordCount === 0 ? 0.6 : 1 }
              ]} 
              onPress={handleNext}
              disabled={wordCount === 0}
            >
              <LinearGradient
                colors={isProgressComplete ? ['#4CAF50', '#45a049'] : ['#FFB41E', '#FF9900']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>
                  {isProgressComplete ? '🎯 Perfekt! Weiter' : '🎯 Weiter'}
                </Text>
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
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  animation: {
    width: 120,
    height: 120,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.8,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 20,
    color: '#2c2c2c',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formCard: {
    borderRadius: 25,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 24,
    borderRadius: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 140,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    lineHeight: 24,
    fontWeight: '400',
  },
  progressSection: {
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});