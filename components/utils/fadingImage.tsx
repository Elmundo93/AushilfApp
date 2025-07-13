import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface FadingImageProps {
  uri: string;
  index?: number;
  delay?: number;
  isSelected?: boolean;
  onLoad?: () => void;
}

// Global tracking for animated avatars to prevent re-animation
const animatedAvatars = new Set<string>();

export function FadingImage({ 
  uri, 
  index = 0, 
  delay = 0, 
  isSelected = false,
  onLoad 
}: FadingImageProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  
  // Create a unique key for this avatar based on uri and index
  const avatarKey = `${uri}-${index}`;
  const hasAnimated = animatedAvatars.has(avatarKey);

  useEffect(() => {
    if (!hasAnimated) {
      const animationDelay = delay + (index * 50); // Staggered animation
      
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          delay: animationDelay,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          delay: animationDelay,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Mark this avatar as animated globally
        animatedAvatars.add(avatarKey);
      });
    } else {
      // If already animated, set to final values immediately
      opacity.setValue(1);
      scale.setValue(1);
    }
  }, [avatarKey, hasAnimated, index, delay]);

  // Handle selection without re-triggering animation
  // Removed selection animation to prevent jumping
  // useEffect(() => {
  //   if (hasAnimated && isSelected) {
  //     // Just a subtle scale effect for selection
  //     Animated.spring(scale, {
  //       toValue: 1.05,
  //       useNativeDriver: true,
  //     }).start(() => {
  //       Animated.spring(scale, {
  //         toValue: 1,
  //         useNativeDriver: true,
  //       }).start();
  //     });
  //   }
  // }, [isSelected, hasAnimated]);

  const handleLoad = () => {
    onLoad?.();
  };

  return (
    <Animated.Image
      source={{ uri }}
      style={[
        styles.avatar, 
        { 
          opacity,
          transform: [{ scale }]
        }
      ]}
      onLoad={handleLoad}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});