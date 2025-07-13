import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { supabase } from '@/components/config/supabase';
import { useAuthStore } from '@/components/stores/AuthStore';
import { decode } from 'base64-arraybuffer';

const AVATAR_COLLECTIONS = [
  {
    label: 'Avataaars',
    baseUrl: 'https://api.dicebear.com/7.x/avataaars/png?seed=',
    seeds: ['Andrea', 'Jude', 'Chase', 'Vivian', 'Maria', 'Liliana', 'Ryker', 'Aiden'],
  },
  {
    label: 'Adventurer',
    baseUrl: 'https://api.dicebear.com/7.x/adventurer/png?seed=',
    seeds: ['Jude', 'Vivian', 'Jade', 'Liliana', 'Aiden', 'Andrea', 'Sadie'],
  },
  {
    label: 'Notionists',
    baseUrl: 'https://api.dicebear.com/7.x/notionists/png?seed=',
    seeds: ['Sara', 'Riley', 'Ryan', 'Andrea', 'Adrian', 'Liliana', 'Vivian', 'Maria', 'Jameson'],
  },
];

const getAvatarUrl = (baseUrl: string, seed: string) => `${baseUrl}${seed}`;

interface AvatarSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  currentImageUrl?: string | null;
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  visible,
  onClose,
  currentImageUrl,
}) => {
  const { user, setUser } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImageUrl || null);
  const [uploading, setUploading] = useState(false);

  // Platform-specific settings navigation
  const openAppSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else if (Platform.OS === 'android') {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Fehler beim Öffnen der Einstellungen:', error);
      await Linking.openSettings();
    }
  };

  // Improved permission handling
  const handlePermissionRequest = async () => {
    try {
      let { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        if (canAskAgain) {
          const { status: newStatus, canAskAgain: newCanAskAgain } = 
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          status = newStatus;
          canAskAgain = newCanAskAgain;
        }
      }

      if (status !== 'granted') {
        if (!canAskAgain) {
          Alert.alert(
            'Foto-Zugriff erforderlich',
            'Du hast den Zugriff auf deine Fotos dauerhaft deaktiviert. Um ein Profilbild auszuwählen, musst du dies in den Einstellungen aktivieren.',
            [
              { text: 'Einstellungen öffnen', onPress: openAppSettings, style: 'default' },
              { text: 'Abbrechen', style: 'cancel' },
            ],
            { cancelable: true }
          );
          return false;
        } else {
          Alert.alert(
            'Foto-Zugriff benötigt',
            'Um ein Profilbild auszuwählen, benötigt die App Zugriff auf deine Fotos.',
            [
              { text: 'Erneut versuchen', onPress: () => handlePermissionRequest(), style: 'default' },
              { text: 'Abbrechen', style: 'cancel' },
            ],
            { cancelable: true }
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Fehler bei Berechtigungsanfrage:', error);
      Alert.alert('Fehler', 'Es gab ein Problem beim Zugriff auf deine Fotos. Bitte versuche es später erneut.');
      return false;
    }
  };

  const pickImage = async () => {
    const hasPermission = await handlePermissionRequest();
    if (!hasPermission) {
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
      } else {
        Alert.alert('Fehler', 'Kein Bild ausgewählt');
      }
    } catch (error) {
      console.error('Fehler beim Bildauswahl:', error);
      Alert.alert('Fehler', 'Beim Öffnen der Bildauswahl ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    }
  };

  const uploadImage = async (imageUrl: string) => {
    try {
      setUploading(true);

      if (!user || !user.id) {
        Alert.alert('Fehler', 'Du bist nicht angemeldet.');
        return;
      }

      // If it's already a URL (avatar), use it directly
      if (imageUrl.startsWith('http')) {
        const { error: updateError } = await supabase
          .from('Users')
          .update({ profileImageUrl: imageUrl })
          .eq('id', user.id);

        if (updateError) {
          throw updateError;
        }

        setUser({
          ...user,
          profileImageUrl: imageUrl,
        });

        Alert.alert('Erfolg', 'Dein Profilbild wurde erfolgreich aktualisiert!', [{ text: 'OK' }]);
        onClose();
        return;
      }

      // If it's a local file, upload it
      const fileExt = imageUrl.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}.${fileExt}`;
      const filePath = fileName;

      const base64 = await FileSystem.readAsStringAsync(imageUrl, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const arrayBuffer = decode(base64);
      const mimeType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, arrayBuffer, {
          upsert: true,
          contentType: mimeType,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;

      if (!publicUrl) {
        throw new Error('Fehler beim Abrufen der Bild-URL.');
      }

      const { error: updateError } = await supabase
        .from('Users')
        .update({ profileImageUrl: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setUser({
        ...user,
        profileImageUrl: publicUrl,
      });

      Alert.alert('Erfolg', 'Dein Profilbild wurde erfolgreich aktualisiert!', [{ text: 'OK' }]);
      onClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Fehler', error.message || 'Beim Hochladen des Bildes ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarSelect = (baseUrl: string, seed: string) => {
    const uri = getAvatarUrl(baseUrl, seed);
    setSelectedImage(uri);
  };

  const handleSave = () => {
    if (selectedImage) {
      uploadImage(selectedImage);
    } else {
      Alert.alert('Fehler', 'Bitte wähle ein Bild oder einen Avatar aus.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFB41E', '#FF9900']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profilbild ändern</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <BlurView intensity={100} tint="light" style={styles.formCard}>
            {/* Preview Section */}
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Vorschau</Text>
              <Image 
                source={
                  selectedImage 
                    ? { uri: selectedImage } 
                    : require('@/assets/images/avatar-thinking-4-svgrepo-com.png')
                } 
                style={styles.previewImage} 
              />
            </View>

            {/* Image Picker Button */}
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="camera" size={40} color="#666" />
              <Text style={styles.imageButtonText}>Foto auswählen</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>Oder wähle einen Avatar</Text>
              <View style={styles.orLine} />
            </View>

            {/* Avatar Collections */}
            {AVATAR_COLLECTIONS.map(({ label, baseUrl, seeds }) => (
              <View key={label} style={styles.avatarSection}>
                <Text style={styles.avatarCollectionLabel}>{label}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {seeds.map((seed) => {
                    const uri = getAvatarUrl(baseUrl, seed);
                    const isSelected = selectedImage === uri;
                    return (
                      <TouchableOpacity
                        key={seed}
                        onPress={() => handleAvatarSelect(baseUrl, seed)}
                        style={[
                          styles.avatarContainer,
                          isSelected && styles.avatarSelectedBorder,
                        ]}
                      >
                        <Image source={{ uri }} style={styles.avatar} />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ))}

            {/* Save Button */}
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={uploading}
            >
              <LinearGradient
                colors={['#FFB41E', '#FF9900']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {uploading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Speichern</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formCard: {
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  previewSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ff9a00',
  },
  imageButton: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 20,
    borderColor: '#ff9a00',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageButtonText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#666',
  },
  avatarSection: {
    marginBottom: 20,
  },
  avatarCollectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  avatarContainer: {
    marginRight: 10,
    padding: 2,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelectedBorder: {
    borderColor: '#ff9a00',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  saveButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 20,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  saveButtonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
});

export default AvatarSelectionModal; 