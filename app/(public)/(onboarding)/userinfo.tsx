import React, { useState } from 'react';
import { Alert, Animated } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { OnboardingForm } from '@/components/Onboarding/OnboardingForm';
import { PrivacyModal } from '@/components/Onboarding/PrivacyModal';

export default function UserInfoScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'verify-identity', 'subscribe'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  const {
    userInfo,
    setUserInfo,
    persist,
  } = useOnboardingStore();

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [shakeAnimation] = useState(new Animated.Value(0));

  const validateEmail = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    if (!userInfo.email || !validateEmail(userInfo.email)) {
      setEmailError('Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@domain.de)');
      // Add shake animation for error feedback
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
      return;
    }
    setEmailError(null);

    // Validate required fields for this step
    if (!userInfo.vorname || !userInfo.nachname || !userInfo.telefonnummer) {
      Alert.alert('Fehlende Angaben', 'Bitte fülle alle Pflichtfelder aus.');
      return;
    }
    
    await persist();
    router.push('userinfo2' as any);
  };

  const fields = [
    { 
      label: 'Vorname', 
      key: 'vorname', 
      placeholder: 'Dein Vorname', 
      textContentType: 'givenName', 
      autoComplete: 'name-given',
      icon: 'person-outline',
      required: true
    },
    { 
      label: 'Nachname', 
      key: 'nachname', 
      placeholder: 'Dein Nachname', 
      textContentType: 'familyName', 
      autoComplete: 'name-family',
      icon: 'person-outline',
      required: true
    },
    { 
      label: 'Telefonnummer', 
      key: 'telefonnummer', 
      placeholder: '+49 123 456789', 
      keyboardType: 'phone-pad', 
      textContentType: 'telephoneNumber', 
      autoComplete: 'tel',
      icon: 'call-outline',
      required: true
    },
    { 
      label: 'E-Mail', 
      key: 'email', 
      placeholder: 'deine.email@beispiel.de', 
      keyboardType: 'email-address', 
      textContentType: 'emailAddress', 
      autoComplete: 'email',
      icon: 'mail-outline',
      required: true
    },
    { 
      label: 'Steuernummer (optional)', 
      key: 'steuernummer', 
      placeholder: 'Steuernummer (optional)', 
      icon: 'card-outline',
      required: false
    },
  ];

  return (
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      headerTitle="Deine Angaben"
      backRoute="/(public)/(onboarding)/intro"
    >
      <OnboardingForm
        fields={fields}
        formData={userInfo}
        onFieldChange={(key, value) => {
          setUserInfo(key as any, value);
          if (key === 'email') setEmailError(null);
        }}
        focusedField={focusedField}
        onFieldFocus={setFocusedField}
        onFieldBlur={() => setFocusedField(null)}
        onNext={handleNext}
        onInfoPress={() => setShowInfoModal(true)}
        errorField={emailError ? 'email' : undefined}
        errorMessage={emailError || undefined}
        shakeAnimation={shakeAnimation}
      />

      <PrivacyModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Datenschutzinformationen"
        content="Bis auf deinen Namen, sind alle Daten die du hier angibst nur für dich ersichtlich und werden sicher in der AushilfApp gespeichert. Falls du über die AushilfApp einen Anmeldevorgang startest, werden die angegebenen Daten automatisch und unkompliziert in den Anmeldeprozess der Minijobzentrale übernommen."
      />
    </OnboardingLayout>
  );
}