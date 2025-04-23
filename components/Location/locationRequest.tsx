// useLocationRequest.ts
import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';
import { useLocationStore } from '@/components/stores/locationStore';
import { useAuthStore } from '@/components/stores/AuthStore';

export const useLocationRequest = () => {
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  const setLocationPermission = useLocationStore((state) => state.setLocationPermission); // 👈 oder aus AuthStore, je nach Struktur
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.address.city || data.address.town || data.address.village;
    } catch (error) {
      console.error('Fehler beim Reverse-Geocoding:', error);
      return null;
    }
  };

  const requestLocation = async () => {
    try {
      // ✅ Prüfen, ob dauerhaft abgelehnt
      const existingPermission = await Location.getForegroundPermissionsAsync();

      if (existingPermission.status === 'denied' && !existingPermission.canAskAgain) {
        Alert.alert(
          'Standortberechtigung erforderlich',
          'Du hast die Standortfreigabe dauerhaft deaktiviert. Bitte öffne die Einstellungen und aktiviere sie manuell.',
          [
            { text: 'Einstellungen öffnen', onPress: () => Linking.openSettings() },
            { text: 'Abbrechen', style: 'cancel' },
          ],
          { cancelable: false }
        );
        return false;
      }

      // ✅ Jetzt Anfrage stellen
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Standortberechtigung benötigt',
          'Die App benötigt Zugriff auf deinen Standort, um Beiträge in deiner Nähe anzuzeigen.',
          [
            { text: 'Einstellungen öffnen', onPress: () => Linking.openSettings() },
            { text: 'Abbrechen', style: 'cancel' },
          ],
          { cancelable: false }
        );
        return false;
      }

      // 📍 Standort abrufen
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      setLocation({ latitude, longitude });
      
      // 🏙 Stadtname via reverse geocoding holen
      const city = await reverseGeocode(latitude, longitude);

      if (city) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.id) {
          setUser({ ...currentUser, wohnort: city });
        }
      } else {
        console.warn('Keine Stadt ermittelbar');
      }

      setLocationPermission(true);
      return true;
    } catch (error) {
      console.error('Fehler beim Standortabruf:', error);
      return false;
    }
  };

  return { requestLocation };
};