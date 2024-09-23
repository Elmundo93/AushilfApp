import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../../config/supabase';
import { useAuthStore } from '../../stores/AuthStore';
import { CreateDanksagungProps } from '../../types/Danksagungen';
import { useDanksagungStore } from '../../stores/danksagungStores';

const CreateDanksagung: React.FC<CreateDanksagungProps> = ({ userId:recipientUserId }) => {
  const [writtenText, setWrittenText] = useState('');
  const incrementDanksagungCount = useDanksagungStore(state => state.incrementDanksagungCount);

  const generateCustomId = useCallback((userId: string): string => {
    const timestamp = new Date().getTime();
    return `${userId}_${timestamp}`;
  }, []);

  const onSubmit = useCallback(async () => {
    if (writtenText.length <= 5) {
      console.error('Bitte schreiben Sie eine längere Danksagung!');
      return;
    }

    try {
      const userData = useAuthStore.getState().user;
      if (!userData) {
        console.error('Benutzer nicht angemeldet');
        return;
      }

      const { error } = await supabase.from('Danksagungen').insert({
        id: generateCustomId(recipientUserId),
        writtenText, 
        userId: recipientUserId, // Empfänger der Danksagung
        authorId: userData.id, // Autor der Danksagung
        created_at: new Date().toISOString(),
        profileImage: userData.profileImageUrl || '',
        vorname: userData.vorname,
        nachname: userData.nachname,
        location: userData.location,
      });
      if (error) {
        throw error;
      }

      console.log('Danksagung erfolgreich erstellt');
      setWrittenText('');
      incrementDanksagungCount();
    } catch (error) {
      console.error('Fehler beim Erstellen der Danksagung:', error);
    }
  }, [writtenText, generateCustomId, incrementDanksagungCount, recipientUserId]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Schreibe eine Danksagung..."
        value={writtenText}
        onChangeText={setWrittenText}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Abschicken</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 55,
    marginBottom: 8,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateDanksagung;