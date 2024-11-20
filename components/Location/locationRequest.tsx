// useLocationRequest.js
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '@/components/stores/locationStore';
import { useAuthStore } from '@/components/stores/AuthStore';
import { Alert, Linking } from 'react-native';
import { PermissionStatus } from 'expo-location';

export const useLocationRequest = () => {
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  const setUser = useAuthStore((state) => state.setUser);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null);
  const setLocationPermission = useAuthStore((state) => state.setLocationPermission);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.address.city || data.address.town || data.address.village;
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
      return null;
    }
  };

  const requestLocation = async () => {
    if (location) {
      return true;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        console.error('Location permission denied');

        Alert.alert(
          'Standortberechtigung benötigt',
          'Die App benötigt Zugriff auf deinen Standort, um relevante Posts in deiner Nähe zu zeigen. Bitte aktiviere die Standortberechtigung in den Einstellungen.',
          [
            {
              text: 'Einstellungen öffnen',
              onPress: () => {
                Linking.openSettings();
              },
            },
            {
              text: 'Abbrechen',
              style: 'cancel',
            },
          ],
          { cancelable: false }
        );
        return false;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      setLocation({ latitude, longitude });
      setLocationPermission(true);

      const city = await reverseGeocode(latitude, longitude);

      if (city) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.id) {
          setUser({
            ...currentUser,
            location: city,
          });
        }
      } else {
        console.error('Error retrieving city name');
      }

      return true;
    } catch (error) {
      console.error('Error fetching location:', error);
      return false;
    }
  };

  return { permissionStatus, requestLocation };
};