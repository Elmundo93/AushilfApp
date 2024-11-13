import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '@/components/config/supabase';
import { useAuthStore } from '@/components/stores/AuthStore';
import { CreateDanksagungProps } from '@/components/types/Danksagungen';
import { useDanksagungStore } from '@/components/stores/danksagungStores';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { FontSizeContext } from '@/components/provider/FontSizeContext'; 
import { useContext } from 'react';
import { useLocationStore } from '@/components/stores/locationStore';


const CreateDanksagung: React.FC<CreateDanksagungProps> = ({ userId:recipientUserId }) => {
  const [writtenText, setWrittenText] = useState('');
  const location = useLocationStore((state: any) => state.location);
  const incrementDanksagungCount = useDanksagungStore(state => state.incrementDanksagungCount);
  
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 38; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 20; // Ausgangsschriftgröße für das Label
  const minIconSize = 35;
  const maxIconSize = 60;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  // Berechnung der angepassten Schriftgröße
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const generateCustomId = (): string => {
    const id = uuidv4();
    console.log("Generated UUID: ", id);
    return id;
  };

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
      console.log("Recipient User ID (userId):", recipientUserId);
      console.log("Author User ID (authorId):", userData.id);

      const { error } = await supabase.from('Danksagungen').insert({
        id: generateCustomId(),
        writtenText, 
        userId: recipientUserId, // Empfänger der Danksagung
        authorId: userData.id, // Autor der Danksagung
        created_at: new Date().toISOString(),
        profileImage: userData.profileImageUrl || '',
        userBio: userData.bio || '',
        vorname: userData.vorname,
        nachname: userData.nachname,
        location: userData.location,
        lat: location?.latitude,  
        long: location?.longitude,

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
        style={[styles.input, { fontSize: finalFontSize }]}
        placeholder="Schreibe eine Danksagung..."
        value={writtenText}
        onChangeText={setWrittenText}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={[styles.buttonText, { fontSize: finalFontSize }]}>Abschicken</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    padding: 18,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 55,
    marginBottom: 8,
  },
  button: {
    backgroundColor: 'orange',
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