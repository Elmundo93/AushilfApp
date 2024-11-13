import { useState, useEffect, useRef } from 'react';
import { Keyboard, Animated } from 'react-native';

const useKeyboard = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [opacity]);

  return { isKeyboardVisible, opacity };
};

export default useKeyboard;