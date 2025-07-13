import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';
import { OnboardingForm } from '@/components/Onboarding/OnboardingForm';
import { PrivacyModal } from '@/components/Onboarding/PrivacyModal';
import { AddressAutoFillButton } from '@/components/Location/AdressAutoFillButton';
import { onboardingSharedStyles, getResponsivePadding, getResponsiveSize } from '@/app/(public)/(onboarding)/sharedStyles';
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function UserInfo2Screen() {
  const router = useRouter();
  const pathname = usePathname();
  const { width: screenWidth } = useWindowDimensions();
  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion', 'verify-identity', 'subscribe'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  const {
    userInfo,
    setUserInfo,
    persist,
  } = useOnboardingStore();

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleNext = async () => {
    // Validate required address fields
    if (!userInfo.plz || !userInfo.straße || !userInfo.hausnummer || !userInfo.wohnort) {
      Alert.alert('Fehlende Angaben', 'Bitte fülle alle Pflichtfelder aus.');
      return;
    }
    
    await persist();
    router.push('intent' as any);
  };

  const handleBack = () => {
    router.push('userinfo' as any);
  };

  const fields = [
    { 
      label: 'Stadt', 
      key: 'wohnort', 
      placeholder: 'Deine Stadt', 
      textContentType: 'addressCity', 
      autoComplete: 'address-line2',
      icon: 'business-outline',
      required: true
    },
    { 
      label: 'PLZ', 
      key: 'plz', 
      placeholder: '12345', 
      keyboardType: 'numeric', 
      textContentType: 'postalCode', 
      autoComplete: 'postal-code',
      icon: 'location-outline',
      required: true
    },
    { 
      label: 'Straße', 
      key: 'straße', 
      placeholder: 'Musterstraße', 
      textContentType: 'streetAddressLine1', 
      autoComplete: 'street-address',
      icon: 'home-outline',
      required: true
    },
    { 
      label: 'Hausnummer', 
      key: 'hausnummer', 
      placeholder: '123', 
      textContentType: 'streetAddressLine2', 
      autoComplete: 'street-address',
      icon: 'home-outline',
      required: true
    }
  ];

  const addressAutoFillContent = (
    <View style={onboardingSharedStyles.autoFillContainer}>
        <View style={styles.sideInfoCard}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#2e7d32" />
              <Text style={styles.sideInfoText}>Falls du gerade Zuhause bist drücke einfach den Button! ✌️</Text>
            </View>
      <AddressAutoFillButton
        style={[
          onboardingSharedStyles.autoFillButton, 
          { padding: getResponsivePadding(screenWidth, 0.03) }
        ]}
        label="Standort verwenden"
        onAddressDetected={(address) => {
          setUserInfo('wohnort', address.wohnort);
          setUserInfo('plz', address.plz);
          setUserInfo('straße', address.straße);
          setUserInfo('hausnummer', address.hausnummer);
        }}
      />
    </View>
  );

  return (
  
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      headerTitle="Dein Wohnort"
      onBack={handleBack}
    > 
   
      <OnboardingForm
        fields={fields}
        formData={userInfo}
        onFieldChange={(key, value) => setUserInfo(key as any, value)}
        focusedField={focusedField}
        onFieldFocus={setFocusedField}
        onFieldBlur={() => setFocusedField(null)}
        onNext={handleNext}
        onInfoPress={() => setShowInfoModal(true)}
        extraContent={addressAutoFillContent}
      />

      <PrivacyModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Datenschutzinformationen"
        content="Deine Adressdaten werden nur für dich gespeichert und sind für andere Nutzer nicht sichtbar. Sie werden verwendet, um dir relevante Angebote in deiner Nähe anzuzeigen."
      />
    </OnboardingLayout>
  );
} 


const styles = StyleSheet.create({
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
  letterSpacing: 0.5,
},
});