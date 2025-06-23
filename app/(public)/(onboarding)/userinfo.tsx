import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,

  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLottieStyle, onboardingStyles } from './styles';

export default function UserInfoScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const steps = ['intro', 'userinfo', 'intent', 'about', 'profileImage', 'password','conclusion','savety'];
    const currentStep = steps.findIndex((step) => pathname.includes(step));

  const {
    userInfo,
    setUserInfo,
    validate,
    persist,
    restore,
  } = useOnboardingStore();

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const beeAnimation = require('@/assets/animations/Bee.json');

  useEffect(() => {
    restore(); // Zustand bei Start wiederherstellen
  }, []);

  const validateEmail = (email: string) => {
    // Supabase's email validation rules
    if (!email) return false;
    
    // RFC 5322 compliant email regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    // Additional Supabase-specific rules
    if (!emailRegex.test(email)) return false;
    
    // Check length (Supabase has a max length of 255 characters)
    if (email.length > 255) return false;
    
    // Check for consecutive dots in domain
    if (email.includes('..')) return false;
    
    // Check for valid TLD length (2-63 characters)
    const tld = email.split('.').pop();
    if (!tld || tld.length < 2 || tld.length > 63) return false;
    
    // Check for valid domain length (max 255 characters)
    const domain = email.split('@')[1];
    if (!domain || domain.length > 255) return false;
    
    return true;
  };

  const handleNext = async () => {
    // Validate email first
    if (!userInfo.email || !validateEmail(userInfo.email)) {
      setEmailError('Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@domain.de)');
      return;
    }
    setEmailError(null);

    const isValid = validate();
    if (!isValid) {
      Alert.alert('Fehlende Angaben', 'Bitte fülle alle Pflichtfelder aus.');
      return;
    }
    await persist();
    router.push('intent' as any);
  };

  const fields = [
    { label: 'Vorname', key: 'vorname', placeholder: 'Vorname', textContentType: 'givenName', autoComplete: 'name-given' },
    { label: 'Nachname', key: 'nachname', placeholder: 'Nachname', textContentType: 'familyName', autoComplete: 'name-family' },
    { label: 'Telefonnummer', key: 'telefonnummer', placeholder: 'Telefonnummer', keyboardType: 'phone-pad', textContentType: 'telephoneNumber', autoComplete: 'tel' },
    { label: 'E-Mail', key: 'email', placeholder: 'E-Mail', keyboardType: 'email-address', textContentType: 'emailAddress', autoComplete: 'email' },
    { label: 'PLZ', key: 'plz', placeholder: 'PLZ', keyboardType: 'numeric', textContentType: 'postalCode', autoComplete: 'postal-code' },
    { label: 'Stadt', key: 'wohnort', placeholder: 'Stadt', textContentType: 'addressCity', autoComplete: 'address-level2' },
    { label: 'Straße', key: 'straße', placeholder: 'Straße', textContentType: 'streetAddressLine1', autoComplete: 'street-address' },
    { label: 'Hausnummer', key: 'hausnummer', placeholder: 'Hausnummer', textContentType: 'streetAddressLine2', autoComplete: 'street-address' },
    { label: 'Steuernummer (optional)', key: 'steuernummer', placeholder: 'Steuernummer' },
  ];

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
                <Text style={onboardingStyles.title}>Deine Angaben</Text>
              </View>
            </View>
          </View>

          <View style={onboardingStyles.contentContainer}>
            <View style={onboardingStyles.card}>
              <TouchableOpacity
                style={onboardingStyles.infoButton}
                onPress={() => setShowInfoModal(true)}
              >
                <Text style={onboardingStyles.infoButtonText}>Datenschutzinfo</Text>
                <Ionicons name="information-circle-outline" size={24} color="black" />
              </TouchableOpacity>

              {fields.map(
                ({ label, key, placeholder, keyboardType = 'default', textContentType, autoComplete }) => (
                  <View key={key} style={onboardingStyles.inputContainer}>
                    <Text style={onboardingStyles.inputLabel}>{label}</Text>
                    <TextInput
                      style={[
                        onboardingStyles.input,
                        key === 'email' && emailError ? { borderColor: 'red' } : null
                      ]}
                      placeholder={placeholder}
                      keyboardType={keyboardType as any}
                      value={(userInfo as any)[key] || ''}
                      onChangeText={(text) => {
                        setUserInfo(key as any, text);
                        if (key === 'email') {
                          setEmailError(null);
                        }
                      }}
                      textContentType={textContentType as any}
                      autoComplete={autoComplete as any}
                      importantForAutofill="yes"
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                    {key === 'email' && emailError && (
                      <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{emailError}</Text>
                    )}
                  </View>
                )
              )}

              <TouchableOpacity style={onboardingStyles.button} onPress={handleNext}>
                <Text style={onboardingStyles.buttonText}>Weiter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={onboardingStyles.modalOverlay}>
          <View style={onboardingStyles.modalContent}>
            <Text style={onboardingStyles.modalTitle}>Datenschutzinformationen</Text>
            <Text style={onboardingStyles.modalText}>
              Bis auf deinen Namen, sind alle Daten die du hier angibst nur für dich ersichtlich
              und werden sicher in der AushilfApp gespeichert. Falls du über die AushilfApp einen
              Anmeldevorgang startest, werden die angegebenen Daten automatisch und unkompliziert
              in den Anmeldeprozess der Minijobzentrale übernommen.
            </Text>
            <TouchableOpacity
              style={onboardingStyles.modalButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={onboardingStyles.modalButtonText}>Verstanden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}