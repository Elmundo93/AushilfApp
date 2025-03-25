import React, { useEffect, useState, useContext } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import { Post } from '@/components/types/post';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlaceholderAnimation } from '@/components/Animation/PlaceholderAnimation';

interface PostIconsProps {
  item: Post;
  allLoaded: boolean;
  updateLoadingState: (isLoading: boolean) => void;
}

const PostIcons: React.FC<PostIconsProps> = ({ item, allLoaded, updateLoadingState }) => {
  const { fontSize } = useContext(FontSizeContext);
  const minIconSize = 45;
  const maxIconSize = 60;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  const [imagesLoaded, setImagesLoaded] = useState({ optionIcon: false, categoryIcon: false });

  useEffect(() => {
    if (imagesLoaded.optionIcon && imagesLoaded.categoryIcon) {
      updateLoadingState(false);
    }
  }, [imagesLoaded]);

  const { fadeAnim} = usePlaceholderAnimation(allLoaded);

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
      case 'handwerk':
        return require('@/assets/images/HandwerkIconWithBackground.png');
      case 'bildung':
        return require('@/assets/images/BildungsIconWithBackground.png');
      default:
        return require('@/assets/images/bienenlogo.png');
    }
  };

  const optionIcon = getOptionIcon(item.option);
  const categoryIcon = getCategoryIcon(item.category);

  return (
    <View style={styles.iconContainer}>

        <ShimmerPlaceholder LinearGradient={LinearGradient} visible={allLoaded} style={styles.ShimmerIcon} shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}>
          <Image
            source={optionIcon}
            style={[styles.icon, { width: iconSize, height: iconSize }]}
            onLoadEnd={() => setImagesLoaded((prev) => ({ ...prev, optionIcon: true }))}
            onError={() => setImagesLoaded((prev) => ({ ...prev, optionIcon: true }))}
          />
          </ShimmerPlaceholder>


          <ShimmerPlaceholder LinearGradient={LinearGradient} visible={allLoaded} style={styles.ShimmerIcon}shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}>
          <Image
            source={categoryIcon}
            style={[styles.icon, { width: iconSize, height: iconSize }]}
            onLoadEnd={() => setImagesLoaded((prev) => ({ ...prev, categoryIcon: true }))}
            onError={() => setImagesLoaded((prev) => ({ ...prev, categoryIcon: true }))}
          />
        </ShimmerPlaceholder>


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
  ShimmerIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,

  },
});

export default React.memo(PostIcons);