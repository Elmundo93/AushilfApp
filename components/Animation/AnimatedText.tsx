import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

interface AnimatedTextProps {
  children: React.ReactNode;
  style?: any;
  glowColor?: string;
  pulseDuration?: number;
  glowDuration?: number;
  enablePulse?: boolean;
  enableGlow?: boolean;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
}

export default function AnimatedText({
  children,
  style,
  glowColor = '#f59e0b',
  pulseDuration = 2000,
  glowDuration = 2000,
  enablePulse = true,
  enableGlow = true,
  fontSize = 18,
  fontWeight = 'normal',
  color = '#333',
}: AnimatedTextProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    if (enablePulse) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: pulseDuration,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: pulseDuration,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    }
  }, [enablePulse, pulseDuration]);

  useEffect(() => {
    // Glow animation - using opacity instead of textShadowRadius
    if (enableGlow) {
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: glowDuration,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: glowDuration,
            useNativeDriver: true,
          }),
        ])
      );
      glowAnimation.start();

      return () => {
        glowAnimation.stop();
      };
    }
  }, [enableGlow, glowDuration]);

  return (
    <Animated.Text
      style={[
        styles.text,
        {
          fontSize,
          fontWeight,
          color,
          opacity: enableGlow ? glowAnim : pulseAnim,
          transform: enablePulse ? [{ scale: pulseAnim }] : [],
        },
        style,
      ]}
    >
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
}); 