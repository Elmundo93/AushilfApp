import React, { useState } from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileImageProps {
  style?: ImageStyle;
  imageUrl: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ style, imageUrl }) => {
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
  return (
    <ShimmerPlaceholder
    visible={imageLoaded}
      style={[styles.avatar,  { width: iconSize, height: iconSize }]} 
      LinearGradient={LinearGradient}
      shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}
    >
    <Image
      source={imageUrl ? { uri: imageUrl } : require('@/assets/images/bienenlogo.png')}
      style={[styles.avatar,  { width: iconSize, height: iconSize }]} 
      onLoadEnd={() => setImageLoaded(true)}
    />
    </ShimmerPlaceholder>
  );
};

const styles = StyleSheet.create({
  avatar: {
   
    borderRadius: 50,
  },
});

export default ProfileImage;