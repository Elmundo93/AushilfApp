import { supabase } from '@/components/config/supabase';
import { useAuthStore } from '@/components/stores/AuthStore';

export class ImageUploadService {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  async uploadProfileImage(uri: string): Promise<string> {
    try {
      const user = useAuthStore.getState().user;
      if (!user || !user.id) throw new Error('Kein Benutzer angemeldet');

      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `profile_${user.id}_${Date.now()}.jpg`;

      const { data, error } = await this.supabase.storage
        .from('profile-images')
        .upload(fileName, blob);
      if (error) {
        throw error;
      }

      const { data: publicUrlData } = this.supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Fehler beim Hochladen des Profilbildes:', error);
      throw error;
    }
  }
}