import React from 'react';
import { View, Image } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { Post } from '../types/post';

interface PostIconsProps {
  item: Post;
}

const PostIcons: React.FC<PostIconsProps> = ({ item }) => {
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
      <Image source={require('@/assets/images/bienenlogo.png')} style={styles.icon} />
      <Image source={optionIcon} style={styles.icon} />
      <Image source={categoryIcon} style={styles.icon} />
    </View>
  );
};

const styles = createRStyle({
  iconContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default React.memo(PostIcons);