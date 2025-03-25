import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const underlineWidth = useRef(new Animated.Value(0)).current;

export const useUnderlineAnimation = () => {
  useEffect(() => {
    // Verzögerung von 500ms
    setTimeout(() => {
    Animated.spring(underlineWidth, {
      toValue: 1,
      useNativeDriver: true,

      tension: 20,  
      friction: 7   
      }).start();
    }, 500);
  }, []);
};
