// components/Anmelden/AnmeldenAccordion.tsx

import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { useAuthStore } from '../stores/AuthStore';
import AnmeldenAccordionUI, { InputField } from './AnmeldenAccordionUI';

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  accordionTitle: string;
  isOnboarding?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onFieldChange?: (field: string, value: string) => void;
  tempUserData?: any;
}

const AnmeldenAccordion = ({
  isExpanded,
  onToggle,
  accordionTitle,
  isOnboarding = false,
  isSaving = false,
  onSave,
  isEditing = false,
  onEdit,
  onCancel,
  onFieldChange,
  tempUserData,
}: Props) => {
  const { user } = useAuthStore();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const inputFields: InputField[] = [
    {
      icon: 'person-outline',
      placeholder: 'Vorname',
      value: tempUserData?.vorname || '',
      editable: isEditing,
      onChangeText: (val) => onFieldChange?.('vorname', val),
    },
    {
      icon: 'person-outline',
      placeholder: 'Nachname',
      value: tempUserData?.nachname || '',
      editable: isEditing,
      onChangeText: (val) => onFieldChange?.('nachname', val),
    },
    {
      icon: 'home-outline',
      placeholder: 'Wohnort',
      value: tempUserData?.wohnort || '',
      editable: isEditing,
      onChangeText: (val) => onFieldChange?.('wohnort', val),
    },
    {
      icon: 'home-outline',
      placeholder: 'Straße',
      value: tempUserData?.straße || '',
      editable: isEditing,
      onChangeText: (val) => onFieldChange?.('straße', val),
    },
    {
      icon: 'home-outline',
      placeholder: 'Hausnummer',
      value: tempUserData?.hausnummer || '',
      editable: isEditing,
      onChangeText: (val) => onFieldChange?.('hausnummer', val),
    },
    {
      icon: 'location-outline',
      placeholder: 'PLZ',
      value: tempUserData?.plz || '',
      editable: isEditing,
      onChangeText: (val) => onFieldChange?.('plz', val),
      keyboardType: 'numeric',
    },
    {
      icon: 'mail-outline',
      placeholder: 'Email',
      value: tempUserData?.email || '',
      editable: false,
    },
    {
      icon: 'call-outline',
      placeholder: 'Telefonnummer',
      value: tempUserData?.telefonnummer || '',
      editable: isEditing,
      onChangeText: (val) => onFieldChange?.('telefonnummer', val),
      keyboardType: 'phone-pad',
    },
    {
      icon: 'document-text-outline',
      placeholder: 'Steuernummer',
      value: tempUserData?.steuernummer || '',
      editable: isEditing,
      onChangeText: (val) => onFieldChange?.('steuernummer', val),
    },
  ];

  return (
    <AnmeldenAccordionUI
      isExpanded={isExpanded}
      onToggle={onToggle}
      accordionTitle={accordionTitle}
      inputFields={inputFields}
      isOnboarding={isOnboarding}
      isSaving={isSaving}
      onSave={onSave}
      isEditing={isEditing}
      onEdit={onEdit}
      onCancel={onCancel}
    />
  );
};

export default AnmeldenAccordion;