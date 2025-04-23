import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Post } from '@/components/types/post';
import { supabase } from '@/components/config/supabase';
import { Ionicons } from '@expo/vector-icons';

interface DeletePostProps {
  post: Post;
  onDelete?: () => void;
}

export function DeletePost({ post, onDelete }: DeletePostProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('Posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      // UI-Aktualisierung durch Callback
      if (onDelete) {
        onDelete();
      }
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
        padding: 8,
        borderRadius: 8,
        opacity: isLoading ? 0.7 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {isLoading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <>
          <Ionicons name="trash-outline" size={16} color="white" />
          <Text style={{ color: 'white', fontSize: 14 }}>Löschen</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
