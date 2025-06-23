// app/(public)/(onboarding)/password.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Alert, TextStyle
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import onboardingStyles, { getLottieStyle } from './styles';

export default function PasswordScreen() {
  const router = useRouter();
  const { password, setField, userInfo } = useOnboardingStore();
  const pathname = usePathname();

  const steps = ['intro', 'userinfo', 'intent', 'about', 'profileImage', 'password','conclusion','savety'];
    const currentStep = steps.findIndex((step) => pathname.includes(step));
  const beeAnimation = require('@/assets/animations/Bee.json');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (pass: string) => {
    const requirements = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    setPasswordStrength({
      isValid: Object.values(requirements).every(Boolean),
      requirements,
    });
  };

  const handleNext = () => {
    if (!passwordStrength.isValid) {
      Alert.alert('Ups 😅', 'Bitte wähle ein stärkeres Passwort.');
      return;
    }
    router.push('/(public)/(onboarding)/conclusion');
  };

  const getRequirementStyle = (met: boolean): TextStyle => ({
    fontSize: 14,
    marginVertical: 2,
    color: met ? '#2e7d32' : '#999',
    fontWeight: met ? 'bold' : 'normal',
  });

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
        onPress={() => router.replace('/(public)/(onboarding)/intro')}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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
              <Text style={styles.title}>
              {passwordStrength.isValid ? '✅ Starkes Passwort!' : '🔐 Erstelle ein sicheres Passwort'}
            </Text>
              </View>
            </View>
          </View>
           


          <View style={styles.card}>
            <Text style={styles.label}>🔑 Passwort</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Mindestens 8 Zeichen..."
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => setField('password', text)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.requirementsBox}>
              <Text style={getRequirementStyle(passwordStrength.requirements.length)}>
                {passwordStrength.requirements.length ? '✅' : '🔸'} Mindestens 8 Zeichen
              </Text>
              <Text style={getRequirementStyle(passwordStrength.requirements.uppercase)}>
                {passwordStrength.requirements.uppercase ? '✅' : '🔸'} 1 Großbuchstabe (z. B. A)
              </Text>
              <Text style={getRequirementStyle(passwordStrength.requirements.lowercase)}>
                {passwordStrength.requirements.lowercase ? '✅' : '🔸'} 1 Kleinbuchstabe (z. B. a)
              </Text>
              <Text style={getRequirementStyle(passwordStrength.requirements.number)}>
                {passwordStrength.requirements.number ? '✅' : '🔸'} 1 Zahl (z. B. 7)
              </Text>
              <Text style={getRequirementStyle(passwordStrength.requirements.special)}>
                {passwordStrength.requirements.special ? '✅' : '🔸'} 1 Sonderzeichen (z. B. #!&)
              </Text>
            </View>

            <Text style={styles.tip}>
              💡 Tipp: Ein starkes Passwort ist wie ein guter Helfer – zuverlässig und schwer zu knacken!
            </Text>

            <TouchableOpacity
              style={[styles.button, !passwordStrength.isValid && styles.buttonDisabled]}
              disabled={!passwordStrength.isValid}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>Weiter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 25,
    zIndex: 10,
  },
  topContainer: {
    marginTop: 120,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#ff9a00',
    transform: [{ scale: 1.2 }],
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  requirementsBox: {
    marginTop: 16,
    backgroundColor: '#fffbe6',
    padding: 14,
    borderRadius: 12,
  },
  tip: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 14,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#ff9a00',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});