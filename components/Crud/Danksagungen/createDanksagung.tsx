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
import { Danksagung } from '@/components/types/Danksagungen';
import { useSQLiteContext } from 'expo-sqlite';

const CreateDanksagung: React.FC<CreateDanksagungProps> = ({ userId: recipientUserId }) => {
  const [writtenText, setWrittenText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { addDanksagung, removeDanksagung } = useDanksagungStore();
  const { fontSize } = useContext(FontSizeContext);
  const location = useLocationStore((s) => s.location);
  const db = useSQLiteContext();

  const generateCustomId = (): string => {
    const id = uuidv4();
    // console.log("Generated UUID: ", id);
    return id;
  };

  const persistDanksagungToSQLite = async (danksagung: Danksagung) => {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO danksagungen_fetched (
           id, created_at, vorname, nachname, writtenText,
           userId, location, authorId, long, lat, profileImageUrl
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          danksagung.id,
          danksagung.created_at,
          danksagung.vorname,
          danksagung.nachname,
          danksagung.writtenText,
          danksagung.userId,
          danksagung.location,
          danksagung.authorId,
          danksagung.long,
          danksagung.lat,
          danksagung.profileImageUrl,
        ]
      );
      // console.log('✅ Optimistic danksagung persisted to SQLite:', danksagung.id);
    } catch (error) {
      console.error('❌ Error persisting optimistic danksagung to SQLite:', error);
      throw error;
    }
  };

  const removeDanksagungFromSQLite = async (danksagungId: string) => {
    try {
      await db.runAsync('DELETE FROM danksagungen_fetched WHERE id = ?', [danksagungId]);
      // console.log('✅ Removed failed danksagung from SQLite:', danksagungId);
    } catch (error) {
      console.error('❌ Error removing failed danksagung from SQLite:', error);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!writtenText.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    const tempId = generateCustomId();

    try {
      // Create optimistic danksagung
      const optimisticDanksagung: Danksagung = {
        id: tempId,
        writtenText,
        userId: recipientUserId,
        authorId: user.id,
        created_at: new Date().toISOString(),
        profileImageUrl: user.profileImageUrl || '',
        vorname: user.vorname,
        nachname: user.nachname,
        location: typeof user.location === 'string' ? user.location : (user.location ? JSON.stringify(user.location) : ''),
        long: location?.longitude || 0,
        lat: location?.latitude || 0,
        userBio: user.bio || '',
      };

      // Add to store and persist to SQLite immediately
      addDanksagung(optimisticDanksagung);
      await persistDanksagungToSQLite(optimisticDanksagung);

      // Clear input immediately for better UX
      setWrittenText('');

      // Send to Supabase
      const { error } = await supabase.from('Danksagungen').insert({
        id: tempId,
        writtenText,
        userId: recipientUserId,
        authorId: user.id,
        location: typeof user.location === 'string' ? user.location : (user.location ? JSON.stringify(user.location) : ''),
        long: location?.longitude || 0,
        lat: location?.latitude || 0,
        vorname: user.vorname,
        nachname: user.nachname,
        profileImageUrl: user.profileImageUrl || '',
      });

      if (error) {
        console.error('❌ Error creating danksagung:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        // Remove optimistic danksagung on error
        removeDanksagung(tempId);
        await removeDanksagungFromSQLite(tempId);
        throw error;
      }

      console.log('✅ Danksagung created successfully:', tempId);
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      // Remove optimistic danksagung on error
      removeDanksagung(tempId);
      await removeDanksagungFromSQLite(tempId);
    } finally {
      setIsSubmitting(false);
    }
  }, [writtenText, user, recipientUserId, location, addDanksagung, removeDanksagung, db]);

  const adjustedFontSize = fontSize * 0.9;

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { fontSize: adjustedFontSize }]}
        value={writtenText}
        onChangeText={setWrittenText}
        placeholder="Schreibe eine Danksagung..."
        multiline
        maxLength={500}
        editable={!isSubmitting}
      />
      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!writtenText.trim() || isSubmitting}
      >
        <Text style={[styles.buttonText, { fontSize: adjustedFontSize }]}>
          {isSubmitting ? 'Wird gesendet...' : 'Danksagung senden'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  input: {
    height: 100,
    width: '100%',
    padding: 18,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'orange',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: 'lightgrey',
    opacity: 0.5,
  },
});

export default CreateDanksagung;