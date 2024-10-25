import React from 'react';
import { View, Image } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { Post } from '../types/post';
import { useAuthStore } from '@/components/stores/AuthStore';
import { ImageSourcePropType } from 'react-native';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
interface PostIconsProps {
  item: Post;
}

const PostIcons: React.FC<PostIconsProps> = ({ item }) => {
  const { user } = useAuthStore();
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 42; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 34; // Ausgangsschriftgröße für das Label
  const minIconSize = 45;
  const maxIconSize = 60;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  
  

  // Berechnung der angepassten Schriftgröße
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;

  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const getOptionIcon = (option: string) => {
    switch (option) {
      case 'bieten':
        return require('@/assets/images/RaisingHandBackgroundColor.png');
      case 'suchen':
        return require('@/assets/images/LookingForBackgroundColor.png');
      default:
        return require('@/assets/images/bienenlogo.png');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gastro':
        return require('@/assets/images/GastroIconBackgroundColor.png');
      case 'garten':
        return require('@/assets/images/GartenIconBackgroundColor.png');
      case 'haushalt':
        return require('@/assets/images/HaushaltIconBackgroundColor.png');
      case 'soziales':
        return require('@/assets/images/SozialesIconBackgroundColor.png');
      default:
        return require('@/assets/images/bienenlogo.png');
    }
  };

  const optionIcon = getOptionIcon(item.option);
  const categoryIcon = getCategoryIcon(item.category);

  

  return (
    <View style={styles.iconContainer}>
    
      <Image source={optionIcon} style={[styles.icon, { width: iconSize, height: iconSize }]} />
      <Image source={categoryIcon} style={[styles.icon, { width: iconSize, height: iconSize }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginRight: 10,
    alignSelf: 'center',
  },
  icon: {
   
    marginBottom: 5,
    borderRadius: 50,
  },
});

export default React.memo(PostIcons);