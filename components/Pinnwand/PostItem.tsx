import React, { useState, useContext } from 'react';
import { View, Image, Text, TouchableOpacity, Animated } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { useRouter } from 'expo-router';
import { Post } from '@/components/types/post';
import PostHeader from '@/components/Pinnwand/PostHeader';
import PostIcons from '@/components/Pinnwand/PostIcons';
import PostMenu from '@/components/Pinnwand/PostMenu';
import { useSelectedPostStore } from '@/components/stores/selectedPostStore'; 
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlaceholderAnimation } from '../Animation/PlaceholderAnimation';

interface PostItemProps {
  item: Post;
}

const PostItem: React.FC<PostItemProps> = ({ item }) => {
  const { fontSize } = useContext(FontSizeContext);
  const router = useRouter();
  const { setSelectedPost } = useSelectedPostStore();
 

  const maxFontSize = 24; 
  const defaultFontSize = 28; 
  const componentBaseFontSize = 22; 
  const minIconSize = 45;
  const maxIconSize = 60;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  // Ladezustände für: menu, header, icons
  const [loadingStates, setLoadingStates] = useState({
    menu: true,
    header: true,
    icons: true
  });

  const allLoaded = Object.values(loadingStates).every(state => state === false);

  const updateLoadingState = (component: 'menu' | 'header' | 'icons', isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [component]: isLoading
    }));
  };

  return (
    <View>
        

      <View style={styles.stringscontainer}>
        <Image source={require('@/assets/images/PinnwandHeader.png')} style={styles.strings} />
        <PostMenu 
          item={item} 
          updateLoadingState={(isLoading) => updateLoadingState('menu', isLoading)} 
          allLoaded={allLoaded} 
        />
      </View>

      <View style={styles.post}>
        <View style={styles.postInside}>
          <PostHeader 
            item={item} 
            updateLoadingState={(isLoading) => updateLoadingState('header', isLoading)} 
            allLoaded={allLoaded} 
          />
          <View style={styles.headerContainerPost}>
            <PostIcons 
              item={item} 
              updateLoadingState={(isLoading) => updateLoadingState('icons', isLoading)} 
              allLoaded={allLoaded} 
            />
            
            <View style={[styles.postContainer, { height: iconSize * 2 }]}>

            <ShimmerPlaceholder visible={allLoaded} style={styles.shimmerPostContainer}  shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }} >
              <Text style={[styles.postText, { fontSize: finalFontSize }]} numberOfLines={4}>
                {item.postText}
              </Text>
              </ShimmerPlaceholder>

            </View>
           
          </View>

          <View style={styles.buttonContainer}>

          <ShimmerPlaceholder visible={allLoaded} style={styles.shimmerButton} shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }} >
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setSelectedPost(item); 
                  router.push('/(modal)/postDetail'); 
                }}
              >
                <LinearGradient
                  colors={['#FFA500', '#FF8C00', '#fcb63d']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalButton}
                >
                  <Text style={[styles.buttonText, { fontSize: finalFontSize + 3 }]}>Beitrag ansehen!</Text>
                </LinearGradient>
              </TouchableOpacity>
              </ShimmerPlaceholder>

          </View>

        </View>
      </View>
      <View style={styles.trenner}></View>

    </View>
  );
};

const styles = createRStyle({
  trenner: {
    height: 5,
    backgroundColor: '#FFA500',
    opacity: 0.2,
    marginVertical: 30,

    width: '90%',
    alignSelf: 'center',
    borderRadius: 50,
  },
  stringscontainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  strings: {
    width: 100,
    height: 50,
    position: 'absolute',
    bottom: 0,
  },
  post: {
    width: '95%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    overflow: 'hidden',
    borderRadius: 50,
  },
  postInside: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 15,
    borderRadius: 50,
    marginVertical: 10,
    elevation: 3,
  },
  headerContainerPost: {
    flex: 1,
    flexDirection: 'row',
  },
  postContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    elevation: 3,
    width: '100%',
  },
  postText: {
    fontSize: 14,
    lineHeight: 25,
    color: '#333',
    textAlign: 'left',
  },
  buttonContainer: {
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalButton: {
    minHeight: 50,
    maxHeight: 150,
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmerPostContainer: {
    minHeight: 30,
    minWidth: 200,
    borderRadius: 25,
    overflow: 'visible',



  },
  shimmerButton: {
    minHeight: 50,
    minWidth: 200,
    borderRadius: 25,
  },
});

export default React.memo(PostItem);