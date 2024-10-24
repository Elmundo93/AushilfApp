import { supabase } from '../../config/supabase';
import { Post } from '../../../components/types/post';
import { useLocationStore } from '../../stores/locationStore';  
// Definiere den Typ Post

const location = useLocationStore.getState().location;

// Funktion zum Abrufen der Beiträge
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('Posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

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