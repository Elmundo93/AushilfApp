import { supabase } from '@/components/config/supabase';
import { Post } from '@/components/types/post';
 
import { getBoundingBox } from '@/components/Location/boundingBox';
import { Location } from '@/components/stores/locationStore';
// Definiere den Typ Post
export const fetchPosts = async (location: Location | null): Promise<Post[]> => {
  try {
    if (!location) {
      throw new Error('Benutzerstandort ist nicht verfügbar');
    }

    const { latitude, longitude } = location;
    const radiusInKm = 10;
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
