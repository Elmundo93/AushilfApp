import { supabase } from '@/components/config/supabase';
import { Danksagung } from '@/components/types/Danksagungen';
import { useLocationStore } from '@/components/stores/locationStore';
import { getBoundingBox } from '@/components/Location/boundingBox';

const location = useLocationStore.getState().location;
const radiusInKm = 10; // Dieser Wert kann angepasst werden

export const fetchDanksagungen = async (): Promise<Danksagung[]> => {
  try {
    if (!location) {
      throw new Error('Benutzerstandort ist nicht verfügbar');
    }

    const { latitude, longitude } = location;
    const { minLat, maxLat, minLon, maxLon } = getBoundingBox(latitude, longitude, radiusInKm);

    const { data, error } = await supabase
      .from('Danksagungen')
      .select('*')
      .gte('lat', minLat)
      .lte('lat', maxLat)
      .gte('long', minLon)
      .lte('long', maxLon)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    return data as Danksagung[];
  } catch (error) {
    console.error("Fehler beim Abrufen der Danksagungen:", error);
    throw error;
  }
};

export const refreshDanksagungen = async (): Promise<Danksagung[]> => {
  try {
    const danksagungen = await fetchDanksagungen();
    console.log('Danksagungen erfolgreich aktualisiert');
    return danksagungen;
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Danksagungen:", error);
    throw error;
  }
};