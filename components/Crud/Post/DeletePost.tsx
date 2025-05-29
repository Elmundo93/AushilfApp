// hooks/useDeletePost.ts
import { Alert } from 'react-native';
import { useState } from 'react';
import { supabase } from '@/components/config/supabase';
import { Post } from '@/components/types/post';
import { usePostSync } from '@/components/services/Storage/Syncs/PostSync';
import { useLocationStore } from '@/components/stores/locationStore';

export function useDeletePost() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { location } = useLocationStore();
  const syncPosts = usePostSync();

  const handleDeletePost = async (post: Post, onDeleted?: () => void) => {
    Alert.alert(
      'Post löschen',
      'Bist du sicher, dass du diesen Post löschen möchtest?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);

              const { error } = await supabase
                .from('Posts')
                .delete()
                .eq('id', post.id);

              if (error) throw error;

              if (location) {
                await syncPosts(location);
              }

              if (onDeleted) onDeleted();
            } catch (err) {
              console.error('Fehler beim Löschen des Posts:', err);
              Alert.alert('Fehler', 'Der Post konnte nicht gelöscht werden.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return { handleDeletePost, isDeleting };
}