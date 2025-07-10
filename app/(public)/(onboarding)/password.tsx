// app/(public)/(onboarding)/password.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert, TextStyle
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { Ionicons } from '@expo/vector-icons';
import { onboardingSharedStyles, getResponsiveSize, getResponsivePadding, getResponsiveMargin } from './sharedStyles';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function PasswordScreen() {
  const router = useRouter();
  const { password, setField, userInfo } = useOnboardingStore();
  const pathname = usePathname();

  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'verify-identity', 'subscribe'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));
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
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      headerTitle={passwordStrength.isValid ? '✅ Starkes Passwort!' : '🔐 Erstelle ein sicheres Passwort'}
      backRoute="/(public)/(onboarding)/intro"
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ 
            paddingTop: 40,
            paddingBottom: 20
          }} 
          keyboardShouldPersistTaps="handled"
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
            <View style={styles.contentContainer}>
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
                💡 Tipp: Ein starkes Passwort ist wie ein guter Helfer – langfristig zuverlässig!!
              </Text>

              <TouchableOpacity
                style={[styles.button, !passwordStrength.isValid && styles.buttonDisabled]}
                disabled={!passwordStrength.isValid}
                onPress={handleNext}
              >
                <LinearGradient
                  colors={['#FFB41E', '#FF9900']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Weiter</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(233, 236, 239, 0.8)',
    color: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  requirementsBox: {
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.5,
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