import React, { useState } from 'react';
import { Image, StyleSheet, ImageStyle, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { UserProfile } from '@/components/types/auth';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';

interface ProfileImageProps {
  style?: ImageStyle;
  imageUrl: string;
  userId: string;
  vorname: string;
  nachname: string;
  profileImageUrl: string;
  userBio: string;
  kategorien: string[];
}

const ProfileImage: React.FC<ProfileImageProps> = ({ style, imageUrl, userId, vorname, nachname, profileImageUrl, userBio, kategorien }) => {
  const { fontSize } = useContext(FontSizeContext);
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 18; // Ausgangsschriftgröße für das Label
  const maxFontSize = 28; // Passen Sie diesen Wert nach Bedarf an
  const minIconSize = 60;
  const maxIconSize = 180;
  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const [imageLoaded, setImageLoaded] = useState(false);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const { setSelectedUser } = useSelectedUserStore();
  const handleViewProfile = () => {
    const userProfile: UserProfile = {
      userId: userId,
      vorname: vorname,
      nachname: nachname,
      profileImageUrl: profileImageUrl,
      bio: userBio,
      kategorien: kategorien || [],
    };
    setSelectedUser(userProfile);
    router.push({ pathname: '/(modal)/forreignProfile' });
  };


  console.log('userId', userId);
  console.log('vorname', vorname);
  console.log('nachname', nachname);
  console.log('profileImageUrl', profileImageUrl);
  console.log('userBio', userBio);
  console.log('kategorien', kategorien);

  return (
    <ShimmerPlaceholder
    visible={imageLoaded}
      style={[styles.avatar,  { width: iconSize, height: iconSize }]} 
      LinearGradient={LinearGradient}
      shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}
    >
      <TouchableOpacity onPress={handleViewProfile}>
    <Image
      source={imageUrl ? { uri: imageUrl } : require('@/assets/images/bienenlogo.png')}
      style={[styles.avatar,  { width: iconSize, height: iconSize }]} 
        onLoadEnd={() => setImageLoaded(true)}
      />
    </TouchableOpacity>
    </ShimmerPlaceholder>
  );
};

const styles = StyleSheet.create({
  avatar: {
   
    borderRadius: 50,
  },
});

export default ProfileImage;