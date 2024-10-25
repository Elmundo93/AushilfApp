import React, { useState } from 'react';
import { View, TextInput, Text, Platform, KeyboardAvoidingView } from 'react-native';
import PostFilters from '../../Checkboxes/CheckboxGroups/PostFilters';
import { createRStyle } from 'react-native-full-responsive';
import { router } from 'expo-router';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { supabase } from '../../config/supabase';
import { usePostStore } from '../../stores/postStores';
import { useAuthStore } from '../../stores/AuthStore';
import { useLocationStore } from '../../stores/locationStore';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';

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

  const incrementPostCount = usePostStore((state) => state.incrementPostCount);
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
        profileImage: userData.profileImageUrl || '',
     
      });

      if (error) {
        throw error;
      }

      console.log('Post erfolgreich erstellt');
      incrementPostCount(); // Erhöht den postCount, was den useEffect in PinnwandFilters auslöst
      router.back();
    } catch (error) {
      console.error('Fehler beim Erstellen des Posts:', error);
    }
  };

  
  

  return (
    <View
    style={styles.container}


  >
      <PostFilters 
        onOptionChange={setSelectedOption} 
        onCategoryChange={setSelectedCategory}
      />

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
  );
};


const styles = StyleSheet.create({
container: {
  
  backgroundColor: 'transparent',
  paddingTop: 16,
},
flex: {
  flex: 1,
  backgroundColor: 'white',
},
input: {
  height: 100,
  borderWidth: 2,
  borderColor: '#FFB74D',
  borderRadius: 15,
  marginTop: 16,
  paddingHorizontal: 15,
  paddingVertical: 10,
  fontSize: 16,
  backgroundColor: 'white',
  color: '#333',

  elevation: 3,
},
inputContainer: {
 
},
postButtonContainer: {
  flexDirection: 'row-reverse', 
  alignItems: 'center',
  padding: 20,
},
postButton: {
  backgroundColor: 'orange',
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 25,
  padding: 20,
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