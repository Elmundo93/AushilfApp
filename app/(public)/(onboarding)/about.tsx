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
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function AboutScreen() {
  const router = useRouter();
  const { bio, setField, persist, userInfo } = useOnboardingStore();
  const [localBio, setLocalBio] = useState(bio || '');
  const pathname = usePathname();
  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'verify-identity', 'subscribe'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));
  const MAX_WORDS = 20;
  const wordCount = localBio.trim().split(/\s+/).filter(word => word.length > 0).length;
  const progress = Math.min((wordCount / MAX_WORDS) * 100, 100);
  const isProgressComplete = wordCount >= MAX_WORDS;

  const { categories = [] } = useOnboardingStore();
  const placeholderText = generateDynamicPlaceholder(userInfo.vorname, categories);

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

  const handleInsertPlaceholder = () => {
    setLocalBio(generateDynamicPlaceholder(userInfo.vorname, categories));
  };

  function generateDynamicPlaceholder(name: string, categories: string[]) {
    const fragments: Record<string, string> = {
      garten: '🌱 Gartenarbeiten und Pflanzenpflege',
      haushalt: '🧼 Hilfe im Haushalt, z. B. beim Aufräumen oder Einkaufen',
      soziales: '🫂 Unterstützung im Alltag oder einfach nur Zuhören',
      gastro: '🍽️ Mithelfen in der Küche oder beim Servieren',
      handwerk: '🔧 Kleine Reparaturen und handwerkliche Tätigkeiten',
      bildung: '📚 Unterstützung bei Hausaufgaben oder Nachhilfe',
    };
  
    const selectedFragments = categories
      .map((key) => fragments[key])
      .filter(Boolean);
  
    if (selectedFragments.length === 0) {
      return `Ich heiße ${name} und helfe gerne dort, wo ich gebraucht werde.`;
    }
  
    const activityList = selectedFragments.join('\n');
  
    return (
      `Ich heiße ${name} und bringe mich gerne ein. Zum Beispiel bei:\n\n` +
      `${activityList}\n\n` +
      `Mir ist wichtig, dass meine Hilfe ankommt und ich einen positiven Beitrag leisten kann.`
    );
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      backRoute={'/intent'}
      headerTitle=""
      

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
              <View style={styles.labelContainer}>
                <Text style={styles.inputLabel}>
                  Deine Vorstellung
                </Text>
                <TouchableOpacity 
                  style={styles.chipButton}
                  onPress={handleInsertPlaceholder}
                >
                  <Text style={styles.chipText}>Beispiel hinzufügen! ✅</Text>
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.textArea}
                multiline
                maxLength={300}
                value={localBio}
                onChangeText={setLocalBio}
                placeholder={placeholderText}
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
             
                <Text style={styles.buttonText}>
                  {isProgressComplete ? '🎯 Perfekt! Weiter' : '🎯 Weiter'}
                </Text>

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
  
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 24,
    borderRadius: 25,
  },
  labelContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  chipButton: {
    backgroundColor: '#FFB41E',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 30,
    marginBottom: 10,
  },
  chipText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
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
    backgroundColor: '#FFB41E',
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
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