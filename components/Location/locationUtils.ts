// components/Location/locationUtils.ts
import * as ExpoLocation from 'expo-location';

export async function reverseGeocodeFromCoords(lat: number, long: number): Promise<{
  wohnort: string;
  plz: string;
  straße: string;
  hausnummer: string;
}> {
  try {
    const results = await ExpoLocation.reverseGeocodeAsync({ latitude: lat, longitude: long });

    if (!results || results.length === 0) {
      throw new Error('Keine Adresse gefunden');
    }

    const address = results[0];

    return {
      wohnort: address.city || address.region || '',
      plz: address.postalCode || '',
      straße: address.street || '',
      hausnummer: address.name || '',
    };
  } catch (error) {
    console.error('Fehler bei reverseGeocodeFromCoords:', error);
    throw error;
  }
}