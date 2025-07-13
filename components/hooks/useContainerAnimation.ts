import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface UseContainerAnimationProps {
  enabled?: boolean;
  delay?: number;
  duration?: number;
  scale?: number;
  translateY?: number;
}

export const useContainerAnimation = ({
  enabled = true,
  delay = 0,
  duration = 300,
  scale = 0.95,
  translateY = 20,
}: UseContainerAnimationProps = {}) => {
  const opacity = useRef(new Animated.Value(enabled ? 0 : 1)).current;
  const scaleValue = useRef(new Animated.Value(enabled ? scale : 1)).current;
  const translateYValue = useRef(new Animated.Value(enabled ? translateY : 0)).current;

  useEffect(() => {
    if (enabled) {
      // Start animation immediately
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []); // Empty dependency array to run only once on mount

  return {
    opacity,
    scale: scaleValue,
    translateY: translateYValue,
    animatedStyle: {
      opacity,
      transform: [
        { scale: scaleValue },
        { translateY: translateYValue }
      ]
    }
  };
}; 