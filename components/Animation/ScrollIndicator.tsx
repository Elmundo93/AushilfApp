import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ScrollIndicatorProps {
  isVisible: boolean;
  onPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ 
  isVisible, 
  onPress 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isVisible && !shouldShow) {
      setShouldShow(true);
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Start bounce animation
      startBounceAnimation();
    } else if (!isVisible && shouldShow) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShouldShow(false);
      });
    }
  }, [isVisible]);

  const startBounceAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  };

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  if (!shouldShow) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          opacity: fadeAnim,
          transform: [{ translateY }]
        }
      ]}
    >
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <LinearGradient
          colors={['rgba(255, 154, 0, 0.9)', 'rgba(255, 195, 0, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <Ionicons 
            name="chevron-down" 
            size={24} 
            color="white" 
          />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 1000,
  },
  touchable: {
    borderRadius: 25,
  },
  gradientContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 