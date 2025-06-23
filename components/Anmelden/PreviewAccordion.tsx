import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { useOnboardingStore } from '../stores/OnboardingContext';
import AnmeldenAccordionUI, { InputField } from './AnmeldenAccordionUI';

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  accordionTitle: string;
  isOnboarding?: boolean;
}

const PreviewAccordion = ({
  isExpanded,
  onToggle,
  accordionTitle,
  isOnboarding = false,
}: Props) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { userInfo, setUserInfo, validate, persist, getFullCityField } = useOnboardingStore();

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const handleChange = (field: keyof typeof userInfo, value: string) => {
    setUserInfo(field, value);
  };

  const inputFields: InputField[] = [
    {
      icon: 'person-outline',
      placeholder: 'Vorname',
      value: userInfo.vorname || '',
      editable: true,
      onChangeText: (val) => handleChange('vorname', val),
    },
    {
      icon: 'person-outline',
      placeholder: 'Nachname',
      value: userInfo.nachname || '',
      editable: true,
      onChangeText: (val) => handleChange('nachname', val),
    },
    {
      icon: 'home-outline',
      placeholder: 'Wohnort',
      value: getFullCityField() || '',
      editable: true,
      onChangeText: (val) => handleChange('wohnort', val),
    },
    {
      icon: 'home-outline',
      placeholder: 'Straße',
      value: userInfo.straße || '',
      editable: true,
      onChangeText: (val) => handleChange('straße', val),
    },
    {
      icon: 'home-outline',
      placeholder: 'Hausnummer',
      value: userInfo.hausnummer || '',
      editable: true,
      onChangeText: (val) => handleChange('hausnummer', val),
    },
    {
      icon: 'mail-outline',
      placeholder: 'Email',
      value: userInfo.email || '',
      editable: false,
    },
    {
      icon: 'call-outline',
      placeholder: 'Telefonnummer',
      value: userInfo.telefonnummer || '',
      editable: true,
      keyboardType: 'phone-pad',
      onChangeText: (val) => handleChange('telefonnummer', val),
    },
    {
      icon: 'document-text-outline',
      placeholder: 'Steuernummer',
      value: userInfo.steuernummer || '',
      editable: true,
      onChangeText: (val) => handleChange('steuernummer', val),
    },
  ];

  return (
    <AnmeldenAccordionUI
      isExpanded={isExpanded}
      onToggle={onToggle}
      accordionTitle={accordionTitle}
      inputFields={inputFields}
      isOnboarding={isOnboarding}
    />
  );
};

export default PreviewAccordion;