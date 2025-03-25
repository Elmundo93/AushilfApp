import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const usePlaceholderAnimation = (allLoaded: boolean) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

  
    useEffect(() => {

      if (allLoaded) {
       
        

          // Then, fade in the content
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          })

      }
    }, [allLoaded]);
  
    return { fadeAnim };
  };