import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface AnimatedBackgroundProps {
  showPattern?: boolean;
  showElements?: boolean;
  color?: string;
  opacity?: number;
  elementCount?: number;
}

export default function AnimatedBackground({
  showPattern = true,
  showElements = true,
  color = '#f59e0b',
  opacity = 0.05,
  elementCount = 2,
}: AnimatedBackgroundProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      {showPattern && (
        <View style={[styles.backgroundPattern, { opacity }]}>
          <View style={[styles.circle, styles.circle1, { borderColor: color }]} />
          <View style={[styles.circle, styles.circle2, { borderColor: color }]} />
          <View style={[styles.circle, styles.circle3, { borderColor: color }]} />
          <View style={[styles.circle, styles.circle4, { borderColor: color }]} />
        </View>
      )}

      {/* Animated Background Elements */}
      {showElements && (
        <>
          <Animated.View
            style={[
              styles.backgroundElement,
              styles.element1,
              {
                backgroundColor: color,
                opacity: glowAnim,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.backgroundElement,
              styles.element2,
              {
                backgroundColor: color,
                opacity: glowAnim,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 999,
  },
  circle1: {
    top: 40,
    left: 40,
    width: 128,
    height: 128,
  },
  circle2: {
    top: 80,
    right: 80,
    width: 96,
    height: 96,
  },
  circle3: {
    bottom: 80,
    left: 80,
    width: 160,
    height: 160,
  },
  circle4: {
    bottom: 40,
    right: 40,
    width: 64,
    height: 64,
  },
  backgroundElement: {
    position: 'absolute',
    borderRadius: 999,
  },
  element1: {
    top: '25%',
    left: '25%',
    width: 8,
    height: 8,
  },
  element2: {
    top: '75%',
    right: '25%',
    width: 12,
    height: 12,
  },
}); 