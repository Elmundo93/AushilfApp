import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';
import { useSelectedUserStore } from '../stores/selectedUserStore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Link } from 'expo-router';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
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


  const imageSource = selectedUser?.profileImage
        ? { uri: selectedUser.profileImage }
    : require('@/assets/images/bienenlogo.png');

  return (
   
    <TouchableOpacity onPress={() => {
      console.log('ProfileAvatar pressed');
    }}>
    <Image
      source={imageSource}
      style={[styles.avatar, style, { width: iconSize, height: iconSize }]}
    />
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  avatar: {
   
    borderRadius: 40,
  },
});

export default ForeignProfileAvatar;