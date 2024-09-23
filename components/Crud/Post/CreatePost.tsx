import React, { useState } from 'react';
import { View, TextInput, Text, Platform, KeyboardAvoidingView } from 'react-native';
import PostFilters from '../../Checkboxes/CheckboxGroups/PostFilters';
import { createRStyle } from 'react-native-full-responsive';
import { router } from 'expo-router';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { supabase } from '../../config/supabase';
import { usePostStore } from '../../stores/postStores';
import { useAuthStore } from '../../stores/AuthStore';



const CreatePost: React.FC = () => {
  const [postText, setPostText] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const incrementPostCount = usePostStore((state) => state.incrementPostCount);

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
        profileImage: userData.profileImageUrl || ''
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
    <ScrollView
    contentContainerStyle={styles.container}


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
          <Text style={styles.postButtonText}>Posten</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = createRStyle({
container: {
  flexGrow: 1,
  backgroundColor: 'white',
  paddingTop: '16rs',
},
flex: {
  flex: 1,
  backgroundColor: 'white',
},
input: {
  height: '100rs',
  borderWidth: '2rs',
  borderColor: '#FFB74D',
  borderRadius: '15rs',
  marginTop: '16rs',
  paddingHorizontal: '15rs',
  paddingVertical: '10rs',
  fontSize: '16rs',
  backgroundColor: 'white',
  color: '#333',

  elevation: 3,
},
inputContainer: {
  marginTop: '-25rs',
  marginHorizontal: '10rs',
},
postButtonContainer: {
  flexDirection: 'row-reverse', 
  alignItems: 'center',
  padding: '20rs',
},
postButton: {
  backgroundColor: 'orange',
  borderStyle: 'solid',
  borderWidth: '1rs',
  borderColor: 'gray',
  borderRadius: '25rs',
  padding: '20rs',
},
postButtonText: {
  color: 'white',
  fontSize: '16rs',
  fontWeight: 'bold',
},
disabledButton: {
  backgroundColor: 'gray',
  opacity: 0.5,
}
});

export default CreatePost;