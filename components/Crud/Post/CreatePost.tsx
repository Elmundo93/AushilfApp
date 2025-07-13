import React, { useState } from 'react';
import { View, TextInput, Text, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import PostFilters from '@/components/Pinnwand/Checkboxes/CheckboxGroups/PostFilters';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { supabase } from '@/components/config/supabase';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useLocationStore } from '@/components/stores/locationStore';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { usePostCountStore } from '@/components/stores/postCountStores';
import NetInfo from '@react-native-community/netinfo';

const CreatePost: React.FC = () => {
  const { fontSize } = useContext(FontSizeContext);
  const defaultFontSize = 22;
  const componentBaseFontSize = 18;
  const maxFontSize = 45;
  const minIconSize = 60;
  const maxIconSize = 180;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const [postText, setPostText] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const incrementPostCount = usePostCountStore((state) => state.incrementPostCount);
  const location = useLocationStore((state) => state.location);

  const onSubmit = async () => {
    console.log('=== Starting post creation process ===');
    
    if (!postText || !selectedCategory || !selectedOption) {
      console.error('Validation failed:', { postText, selectedCategory, selectedOption });
      Alert.alert('Fehler', 'Bitte wähle eine Kategorie & schreibe eine Nachricht.');
      return;
    }

    try {
      console.log('Getting user data...');
      const userData = useAuthStore.getState().user;
      
      if (!userData) {
        console.error('No user data found in AuthStore');
        Alert.alert('Fehler', 'Bitte melde dich erneut an.');
        return;
      }

      console.log('User data retrieved:', { 
        userId: userData.id,
        vorname: userData.vorname,
        nachname: userData.nachname
      });

      console.log('Verifying user in database...');
      const { data: userCheck, error: userError } = await supabase
        .from('Users')
        .select('id')
        .eq('id', userData.id)
        .single();

      if (userError) {
        console.error('Error checking user in database:', userError);
        Alert.alert('Fehler', 'Benutzer nicht gefunden. Bitte melde dich erneut an.');
        return;
      }

      if (!userCheck) {
        console.error('User not found in database');
        Alert.alert('Fehler', 'Benutzer nicht gefunden. Bitte melde dich erneut an.');
        return;
      }

      console.log('User verified in database:', userCheck);

      console.log('Checking network connectivity...');
      const net = await NetInfo.fetch();
      console.log('Network status:', {
        isConnected: net.isConnected,
        isInternetReachable: net.isInternetReachable,
        type: net.type
      });

      if (!net.isConnected || !net.isInternetReachable) {
        console.error('Network connection issues:', net);
        Alert.alert('Keine Verbindung', 'Bitte überprüfe deine Internetverbindung.');
        return;
      }

      console.log('Preparing post data...');
      const postData = {
        postText,
        category: selectedCategory,
        vorname: userData.vorname,
        nachname: userData.nachname,
        created_at: new Date().toISOString(),
        location: userData.wohnort,
        option: selectedOption,
        userId: userData.id,
        profileImageUrl: userData.profileImageUrl || '',
        lat: location?.latitude,
        long: location?.longitude,
        userBio: userData.bio || '',
        kategorien: userData.kategorien || [],
      };

      console.log('Post data prepared:', postData);

      console.log('Attempting to insert post into Supabase...');
      const { data, error } = await supabase
        .from('Posts')
        .insert(postData)
        .select();

      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          postData: postData
        });
        Alert.alert('Fehler', 'Der Post konnte nicht erstellt werden. Bitte versuche es später erneut.');
        return;
      }

      if (!data || data.length === 0) {
        console.error('No data returned after post creation');
        Alert.alert('Fehler', 'Der Post wurde erstellt, aber keine Daten zurückgegeben.');
        return;
      }

      console.log('Post successfully created:', data);
      incrementPostCount();
      
      console.log('Navigating back...');
      router.back();
    } catch (err) {
      console.error('Unexpected error in post creation:', err);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut.');
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
    justifyContent: 'space-between',
  },
  filtersContainer: {
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    minHeight: 200,
  },
  inputContainer: {
    flex: 1,
    marginVertical: 15,
  },
  input: {
    flex: 1,
    minHeight: 100,
    maxHeight: 150,
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
    paddingVertical: 15,
    alignItems: 'flex-end',
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
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