import React, { useState, useContext, useCallback } from 'react';
import { View, Image, Text, TouchableOpacity, Animated, Pressable } from 'react-native';
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
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface PostItemProps {
  item: Post;
}

// Optimized button component with best practices
interface ViewPostButtonProps {
  onPress: () => void;
  fontSize: number;
  isLoading: boolean;
}

const ViewPostButton: React.FC<ViewPostButtonProps> = ({ onPress, fontSize, isLoading }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = useCallback(() => setIsPressed(true), []);
  const handlePressOut = useCallback(() => setIsPressed(false), []);

  const buttonTextSize = Math.min(fontSize + 3, 20);
  const iconSize = Math.min(fontSize + 6, 24);

  return (
    <ShimmerPlaceholder
      visible={!isLoading}
      style={styles.shimmerButton}
      shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']}
      shimmerStyle={{ locations: [0, 0.5, 1] }}
    >
      <Pressable
        style={[
          styles.optimizedButton,
          isPressed && styles.buttonPressed,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Beitrag ansehen"
        accessibilityHint="Öffnet die Detailansicht des Beitrags"
        accessibilityState={{ disabled: isLoading }}
      >
        <View style={styles.buttonContent}>
          <Text style={[styles.optimizedButtonText, { fontSize: buttonTextSize }]}>
            Beitrag ansehen!
          </Text>
          <Ionicons name="search" size={iconSize} color="orange" style={styles.buttonIcon} />
        </View>
      </Pressable>
    </ShimmerPlaceholder>
  );
};

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

  const handleViewPost = useCallback(() => {
    setSelectedPost(item);
    router.push('/(modal)/postDetail');
  }, [item, setSelectedPost, router]);

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

      <BlurView intensity={60} tint="light" style={styles.post}>
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
              <ShimmerPlaceholder 
                visible={allLoaded} 
                style={styles.shimmerPostContainer}  
                shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} 
                shimmerStyle={{ locations: [0, 0.5, 1] }}
              >
                <Text style={[styles.postText, { fontSize: finalFontSize }]} numberOfLines={4}>
                  {item.postText}
                </Text>
              </ShimmerPlaceholder>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <ViewPostButton
              onPress={handleViewPost}
              fontSize={finalFontSize}
              isLoading={!allLoaded}
            />
          </View>
        </View>
      </BlurView>
      <View style={styles.trenner}></View>
    </View>
  );
};

const styles = createRStyle({

  optimizedButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'orange',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,

  
  },
  
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  
  optimizedButtonText: {
    color: 'orange',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'System', // Replace with your app font if needed
  },
  
  shimmerButton: {
    minHeight: 50,
    minWidth: 200,
    borderRadius: 25,
    alignSelf: 'center', // Optional: centers the shimmer
  },
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
    borderColor: 'orange',
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
    marginTop: 10,
  },
  // Optimized button styles

  buttonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',

  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonIcon: {
    marginLeft: 4,
    
  },
  shimmerPostContainer: {
    minHeight: 30,
    minWidth: 200,
    borderRadius: 25,
    overflow: 'visible',
  },

  // Legacy styles for backward compatibility
  button: {
    padding: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  buttonText: {
    color: 'orange',
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
});

export default React.memo(PostItem);