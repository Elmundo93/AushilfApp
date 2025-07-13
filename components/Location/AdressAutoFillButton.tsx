// components/Location/AddressAutoFillButton.tsx
import React from 'react';
import { TouchableOpacity, Text, Keyboard, Alert, StyleSheet   } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoLocation from 'expo-location';
import { useLocationStore } from '@/components/stores/locationStore';
import { reverseGeocodeFromCoords } from '@/components/Location/locationUtils';
import { getResponsiveSize } from '@/app/(public)/(onboarding)/sharedStyles';

interface Props {
  onAddressDetected: (address: {
    wohnort: string;
    plz: string;
    straße: string;
    hausnummer: string;
  }) => void;
  style?: any;
  label?: string;
}

export const AddressAutoFillButton: React.FC<Props> = ({
  onAddressDetected,
  style,
  label = 'Adresse mit aktuellem Standort ausfüllen',
}) => {
  const { setLocation, setLocationPermission } = useLocationStore();

  const handlePress = async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Berechtigung benötigt', 'Bitte erlaube den Zugriff auf den Standort.');
        return;
      }

      const loc = await ExpoLocation.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLocationPermission(true);

      const address = await reverseGeocodeFromCoords(
        loc.coords.latitude,
        loc.coords.longitude
      );

      onAddressDetected(address);
      Keyboard.dismiss();
    } catch (error) {
      console.warn('Fehler bei Standortverwendung:', error);
      Alert.alert('Fehler', 'Dein Standort konnte nicht ermittelt werden.');
    }
  };

  return (
    <TouchableOpacity
    
      onPress={handlePress}
      style={[{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e86de', padding: 12, borderRadius: 8 }, style]}
      accessibilityLabel="Adresse automatisch einfügen"
      accessibilityHint="Füllt deine Adressdaten automatisch basierend auf deinem Standort aus"
    >
      <Ionicons name="locate" size={20} color="white" style={{ marginRight: 8 }} />
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e86de',
    padding: 12,
    borderRadius: 8,
  },
});