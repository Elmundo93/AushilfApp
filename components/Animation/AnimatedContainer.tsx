import React from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useContainerAnimation } from '@/components/hooks/useContainerAnimation';

interface AnimatedContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  enabled?: boolean;
  delay?: number;
  duration?: number;
  scale?: number;
  translateY?: number;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  style,
  enabled = true,
  delay = 0,
  duration = 300,
  scale = 0.95,
  translateY = 20,
}) => {
  const { animatedStyle } = useContainerAnimation({
    enabled,
    delay,
    duration,
    scale,
    translateY,
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}; 