import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

interface ProfileAvatarProps {
  style?: ImageStyle;
}

const ForeignProfileAvatar: React.FC<ProfileAvatarProps> = ({ style }) => {
  const { selectedUser } = useSelectedUserStore();
;
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 38; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 24; // Ausgangsschriftgröße für das Label
  const minIconSize = 120  ;
  const maxIconSize = 200;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageSource = selectedUser?.profileImageUrl
        ? { uri: selectedUser.profileImageUrl }
    : require('@/assets/images/bienenlogo.png');

  return (
   
    <ShimmerPlaceholder
    visible={imageLoaded}
      style={[styles.avatar,  { width: iconSize, height: iconSize }]} 
      LinearGradient={LinearGradient}
      shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}
    >
    <TouchableOpacity onPress={() => {
      console.log('ProfileAvatar pressed');
    }}>
    <Image
      source={imageSource}
      style={[styles.avatar, style, { width: iconSize, height: iconSize }]}
      onLoadEnd={() => {
        setImageLoaded(true);
      }}
    />
    </TouchableOpacity>
    </ShimmerPlaceholder>
  );
};

const styles = StyleSheet.create({
  avatar: {
   
    borderRadius: 100,
    marginBottom: 14,

  },
  shimmerImage: {
   
    borderRadius: 100,
    marginBottom: 14,
  },
});

export default ForeignProfileAvatar;
