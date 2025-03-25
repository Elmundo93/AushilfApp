import React, { useState } from 'react';
import { View, TextInput, Text, Platform, KeyboardAvoidingView } from 'react-native';
import PostFilters from '@/components/Pinnwand/Checkboxes/CheckboxGroups/PostFilters';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { supabase } from '@/components/config/supabase';
import { usePostStore } from '@/components/stores/postStore';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useLocationStore } from '@/components/stores/locationStore';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { usePostCountStore } from '@/components/stores/postCountStores';

const CreatePost: React.FC = () => {

  const { fontSize } = useContext(FontSizeContext);
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 18; // Ausgangsschriftgröße für das Label
  const maxFontSize = 45; // Passen Sie diesen Wert nach Bedarf an
  const minIconSize = 60;
  const maxIconSize = 180;
  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const [postText, setPostText] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const incrementPostCount = usePostCountStore((state) => state.incrementPostCount);
  const location = useLocationStore((state) => state.location); 

  
  const onSubmit = async () => {
    if (!postText || !selectedCategory || !selectedOption) {
      console.error('Bitte wähle eine Kategorie & schreibe eine Nachricht.');
      return;
    }

    try {
      const userData = useAuthStore.getState().user;
      
      if (!userData) {
        console.error('Benutzer nicht angemeldet');
        return;
      }

      const { data, error } = await supabase.from('Posts').insert({
        postText,
        category: selectedCategory,
        vorname: userData.vorname,
        nachname: userData.nachname,
        created_at: new Date().toISOString(),
        location: userData.location,
        option: selectedOption,
        userId: userData.id,
        profileImageUrl: userData.profileImageUrl || '',
        lat: location?.latitude,
        long: location?.longitude,
        userBio: userData.bio || '',
     
      });

      if (error) {
        throw error;
      }

      console.log('Post erfolgreich erstellt');
      incrementPostCount(); 
      router.back();
    } catch (error) {
      console.error('Fehler beim Erstellen des Posts:', error);
    }
  };

  
  

  return (
    <View style={styles.container}>
      <PostFilters 
        onOptionChange={setSelectedOption} 
        onCategoryChange={setSelectedCategory}
      />
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Verfasse deinen Pinnwand Beitrag!"
            multiline
            value={postText}
            onChangeText={setPostText}
          />
        </View>
  
        <View style={styles.postButtonContainer}>
          <TouchableOpacity 
            style={[styles.postButton, (!postText || !selectedCategory || !selectedOption) && styles.disabledButton]} 
            onPress={onSubmit}
            disabled={!postText || !selectedCategory || !selectedOption}
          >
            <Text style={[styles.postButtonText, { fontSize: finalFontSize }]}>Posten</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between', // This ensures proper spacing
  },
  filtersContainer: {
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    minHeight: 200, // Ensure minimum height for content
  },
  inputContainer: {
    flex: 1,
    marginVertical: 15,
  },
  input: {
    flex: 1,
    minHeight: 100,
    maxHeight: 150, // Reduced max height
    borderWidth: 2,
    borderColor: '#FFB74D',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#333',
    elevation: 3,
  },
  postButtonContainer: {
    paddingVertical: 15, // Reduced padding
    alignItems: 'flex-end',
    marginBottom: Platform.OS === 'ios' ? 10 : 0, // Add margin bottom for iOS
  },
  postButton: {
    backgroundColor: 'orange',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    padding: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'gray',
    opacity: 0.5,
  }
});

export default CreatePost;