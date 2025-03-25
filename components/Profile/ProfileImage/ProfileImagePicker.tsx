import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Image, Alert, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/components/config/supabase';
import { useAuthStore } from '@/components/stores/AuthStore';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { decode } from 'base64-arraybuffer';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileImagePicker: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 38; // Adjust as needed
  const defaultFontSize = 22; // Default font size in context
  const componentBaseFontSize = 18; // Base font size for the label
  const minIconSize = 120;
  const maxIconSize = 200;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [image, setImage] = useState(user?.profileImageUrl || null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    // Get the current permission status
    let { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      if (canAskAgain) {
        // Request permission
        const { status: newStatus, canAskAgain: newCanAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = newStatus;
        canAskAgain = newCanAskAgain;
      }
    }

    if (status !== 'granted') {
      if (!canAskAgain) {
        // Cannot ask again, prompt user to go to settings
        Alert.alert(
          'Permission Required',
          'Permission to access media library is required. Please enable it in your device settings.',
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel' },
          ],
          { cancelable: true }
        );
      } else {
        // User denied permission, but we can ask again next time
        Alert.alert('Permission Denied', 'Permission to access media library is required!');
      }
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // If the user canceled, exit
    if (result.canceled) {
      return;
    }

    // Upload the image
    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      uploadImage(uri);
    } else {
      Alert.alert('Error', 'No image selected');
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);

      if (!user || !user.id) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }

      const fileExt = uri.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = fileName; // Save in root directory

      // Read the file as Base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert Base64 to ArrayBuffer
      const arrayBuffer = decode(base64);

      // Set the correct MIME type
      const mimeType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

      // Upload the image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, arrayBuffer, {
          upsert: true,
          contentType: mimeType,
        });

      if (uploadError) {
        console.log('Upload Error:', uploadError);
        throw uploadError;
      }

      // Get the public URL of the uploaded image
      const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);

      const publicUrl = data?.publicUrl;

      if (!publicUrl) {
        throw new Error('Failed to get public URL of the image.');
      }

      console.log('publicUrl', publicUrl);

      // Update the user's profileImageUrl in Supabase
      const { error: updateError } = await supabase
        .from('Users')
        .update({ profileImageUrl: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update the user data in your app's state
      setUser({
        ...user,
        profileImageUrl: publicUrl,
      });
      setImage(publicUrl);
      console.log('image', publicUrl);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred while uploading the image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ShimmerPlaceholder
    visible={imageLoaded}
      style={[styles.avatar,  { width: iconSize, height: iconSize }]} 
      LinearGradient={LinearGradient}
      shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}
    >
    <TouchableOpacity onPress={pickImage} style={styles.container}>
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : image ? (
        <Image source={{ uri: image }} style={[styles.profileImage, { width: iconSize, height: iconSize }]} onLoadEnd={() => {
          setImageLoaded(true);
        }} />
      ) : (
        <Image source={require('@/assets/images/Placeholder.png')} style={[styles.profileImage, { width: iconSize, height: iconSize }]} />
      )}
    </TouchableOpacity>
    </ShimmerPlaceholder> 
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  profileImage: {
    borderRadius: 100,
  
    alignSelf: 'center',
  },
  placeholder: {
    backgroundColor: '#ccc',
  },
  avatar: {
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },
});

export default ProfileImagePicker;