import { useState, useCallback } from 'react';
import { supabase } from '@/components/config/supabase';
import { useAuthStore } from '@/components/stores/AuthStore';

export const useBioUpdate = () => {
  const { user, setUser } = useAuthStore();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(user?.bio || '');

  const updateBioInSupabase = useCallback(async (userId: string, newBio: string) => {
    console.log('updateBioInSupabase aufgerufen', { userId, newBio });
    try {
      const { data, error } = await supabase
        .from('Users')
        .update({ bio: newBio })
        .eq('id', userId)
        .select('*'); // Fetch the updated data
            
      console.log('Supabase Antwort:', { data, error });
      if (error) throw error;
      if (!data) throw new Error('Update failed due to RLS policies or other reasons.');
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Biografie:', error);
      throw error;
    }
  }, []);

  const handleEditBio = useCallback(async () => {
    console.log('handleEditBio aufgerufen', { isEditingBio, editedBio, userId: user?.id });
    if (isEditingBio) {
      if (user) {
        try {
          await updateBioInSupabase(user.id, editedBio);
          setUser({ ...user, bio: editedBio });
          setIsEditingBio(false);
          console.log('Bio aktualisiert', { newBio: editedBio });
        } catch (error) {
          console.error('Fehler beim Aktualisieren der Biografie:', error);
        }
      }
    } else {
      setIsEditingBio(true);
    }
  }, [isEditingBio, editedBio, user, setUser, updateBioInSupabase]);

  return {
    isEditingBio,
    editedBio,
    setEditedBio,
    handleEditBio
  };
};