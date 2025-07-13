import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  duration?: number;
  opacity?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FloatingParticles({
  count = 6,
  color = '#f59e0b',
  size = 12,
  duration = 3000,
  opacity = 0.7,
}: FloatingParticlesProps) {
  const particleAnims = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Create particle animations
    particleAnims.forEach((anim, index) => {
      const particleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      );
      particleAnimation.start();
    });

    return () => {
      particleAnims.forEach((anim) => {
        anim.stopAnimation();
      });
    };
  }, [count, duration]);

  return (
    <View style={styles.container}>
      {particleAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              left: Math.random() * screenWidth,
              top: Math.random() * screenHeight,
              opacity: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, opacity],
              }),
              transform: [
                { scale: anim },
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
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
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
}); 