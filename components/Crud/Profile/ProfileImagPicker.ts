import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { ImageUploadService } from '../../services/ImageUploadService';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useProfileImagePicker = () => {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Berechtigung erforderlich', 'Bitte erlauben Sie den Zugriff auf Ihre Galerie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const compressedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 500 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      await uploadImage(compressedImage.uri);
    }
  }, []);

  const uploadImage = async (uri: string) => {
    setIsUploading(true);
    try {
      const imageUploadService = new ImageUploadService();
      const url = await imageUploadService.uploadProfileImage(uri);
      console.log('Bild erfolgreich hochgeladen:', url);
      
      // Aktualisieren des Benutzerprofiles mit der neuen Bild-URL
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) {
        const user = JSON.parse(userString);
        user.profileImageUrl = url;
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      setProfileImageUrl(url);
      Alert.alert('Erfolg', 'Ihr Profilbild wurde erfolgreich aktualisiert.');
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error);
      Alert.alert('Fehler', 'Beim Hochladen des Bildes ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsUploading(false);
    }
  };

  return { pickImage, profileImageUrl, isUploading };
};