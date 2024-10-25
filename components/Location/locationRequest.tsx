import { useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { useLocationStore } from '@/components/stores/locationStore';
import { useAuthStore } from '@/components/stores/AuthStore';

export const useLocationRequest = () => {
  const setLocation = useLocationStore((state: any) => state.setLocation);
  const setUser = useAuthStore((state) => state.setUser);  // Zugriff auf den AuthStore
  const user = useAuthStore((state) => state.user);  // Aktueller User

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.address.city || data.address.town || data.address.village; // Stadt, Dorf oder Ort
    } catch (error) {
      console.error("Fehler beim Reverse Geocoding:", error);
      return null;
    }
  };

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status === 'undetermined') {
        return new Promise((resolve) => {
          Alert.alert(
            "Standortberechtigung",
            "Diese App benötigt Zugriff auf Ihren Standort, um Ihnen relevante Inhalte anzuzeigen. Möchten Sie den Zugriff erlauben?",
            [
              {
                text: "Nein",
                onPress: () => resolve(false),
                style: "cancel"
              },
              {
                text: "Ja",
                onPress: () => resolve(true)
              }
            ]
          );
        });
      }
      
      return status === 'granted';
    };

    const requestAndSetLocation = async () => {
      const hasPermission = await getLocationPermission();
      
      if (hasPermission) {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Standortberechtigung wurde verweigert');
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          // Standort im LocationStore setzen
          setLocation({
            latitude,
            longitude,
          });

          // Reverse Geocoding durchführen, um Städtenamen zu erhalten
          const city = await reverseGeocode(latitude, longitude);
          
          if (city) {
            // Aktuellen User holen und mit dem Städtenamen aktualisieren
            if (user) {
              setUser({
                ...user,
                location: city,  // Städtename in user.location speichern
              });
            }
          } else {
            console.error("Fehler beim Abrufen des Städtenamens");
          }

        } catch (error) {
          console.error('Fehler beim Abrufen des Standorts:', error);
        }
      } else {
        console.log('Standortberechtigung wurde nicht erteilt');
      }
    };

    requestAndSetLocation();
  }, [setLocation, setUser, user]);
};