import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useAuthStore } from '@/components/stores/AuthStore';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import AvatarSelectionModal from './AvatarSelectionModal';

const ProfileImagePicker: React.FC = () => {
  const { user } = useAuthStore();
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
  const [modalVisible, setModalVisible] = useState(false);

  // Update image when user changes
  React.useEffect(() => {
    setImage(user?.profileImageUrl || null);
  }, [user?.profileImageUrl]);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <ShimmerPlaceholder
        visible={imageLoaded}
        style={[styles.avatar, { width: iconSize, height: iconSize }]} 
        LinearGradient={LinearGradient}
        shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} 
        shimmerStyle={{ locations: [0, 0.5, 1] }}
      >
        <TouchableOpacity 
          onPress={() => setModalVisible(true)} 
          style={styles.container}
          accessibilityLabel="Profilbild ändern"
          accessibilityHint="Öffnet die Profilbild-Auswahl mit Avataren und Foto-Upload"
        >
          {image ? (
            <Image 
              source={{ uri: image }} 
              style={[styles.profileImage, { width: iconSize, height: iconSize }]} 
              onLoadEnd={() => setImageLoaded(true)}
              accessibilityLabel="Aktuelles Profilbild"
            />
          ) : (
            <Image 
              source={require('@/assets/images/Placeholder.png')} 
              style={[styles.profileImage, { width: iconSize, height: iconSize }]}
              accessibilityLabel="Standard Profilbild"
            />
          )}
        </TouchableOpacity>
      </ShimmerPlaceholder>

      <AvatarSelectionModal
        visible={modalVisible}
        onClose={handleModalClose}
        currentImageUrl={user?.profileImageUrl}
      />
    </>
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