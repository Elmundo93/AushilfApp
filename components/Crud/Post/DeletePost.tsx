import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Post } from '@/components/types/post';

import { supabase } from '@/components/config/supabase';

interface DeletePostProps {
  post: Post;
}

export function DeletePost({ post }: DeletePostProps) {
  const [isLoading, setIsLoading] = useState(false);
  


  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('Posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      // Hier können Sie eine Aktualisierung der UI implementieren
      // z.B. durch einen Callback oder Context
    } catch (error) {
      console.error('Fehler beim Löschen des Posts:', error);
      Alert.alert('Fehler', 'Der Post konnte nicht gelöscht werden.');
    } finally {
      setIsLoading(false);
    }
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      'Post löschen',
      'Sind Sie sicher, dass Sie diesen Post löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: handleDelete,
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={showDeleteConfirmation}
      disabled={isLoading}
      style={{
        backgroundColor: '#ef4444',
        padding: 10,
        borderRadius: 5,
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={{ color: 'white', textAlign: 'center' }}>Löschen</Text>
      )}
    </TouchableOpacity>
  );
}
