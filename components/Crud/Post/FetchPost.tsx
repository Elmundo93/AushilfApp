import { supabase } from '@/components/config/supabase';
import { Post } from '@/components/types/post';
import { useLocationStore } from '@/components/stores/locationStore';  
import { getBoundingBox } from '@/components/Location/boundingBox';
// Definiere den Typ Post
const location = useLocationStore.getState().location;
const radiusInKm = 10; // Dieser Wert kann angepasst werden



// Funktion zum Abrufen der Beiträge
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    if (!location) {
      throw new Error('Benutzerstandort ist nicht verfügbar');
    }

    const { latitude, longitude } = location;
    const { minLat, maxLat, minLon, maxLon } = getBoundingBox(latitude, longitude, radiusInKm);

    const { data, error } = await supabase
      .from('Posts')
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

    return data as Post[];
  } catch (error) {
    console.error("Fehler beim Abrufen der Posts:", error);
    throw error;
  }
};

export const refreshPosts = async (): Promise<Post[]> => {
  try {
    const posts = await fetchPosts();
    console.log('Posts erfolgreich aktualisiert');
    return posts;
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Posts:", error);
    throw error;
  }
};
