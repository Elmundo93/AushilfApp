import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated } from 'react-native';

interface AnimatedLoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  showProgressDots?: boolean;
  dotCount?: number;
  dotSize?: number;
  dotColor?: string;
  style?: any;
}

export default function AnimatedLoadingIndicator({
  size = 'large',
  color = '#ff9a00',
  showProgressDots = true,
  dotCount = 5,
  dotSize = 4,
  dotColor = '#f59e0b',
  style,
}: AnimatedLoadingIndicatorProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotAnims = useRef(
    Array.from({ length: dotCount }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Pulse animation for the main indicator
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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
    pulseAnimation.start();

    // Progress dots animation
    if (showProgressDots) {
      dotAnims.forEach((anim, index) => {
        const dotAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ])
        );
        dotAnimation.start();
      });
    }

    return () => {
      pulseAnimation.stop();
      dotAnims.forEach((anim) => {
        anim.stopAnimation();
      });
    };
  }, [showProgressDots, dotCount]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: pulseAnim,
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      <ActivityIndicator size={size} style={styles.spinner} color={color} />
      
      {/* Progress dots */}
      {showProgressDots && (
        <View style={styles.progressDots}>
          {dotAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.progressDot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: dotColor,
                  opacity: anim,
                  transform: [{ scale: anim }],
                },
              ]}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  spinner: {
    marginTop: 16,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginTop: 16,
  },
  progressDot: {
    // Default styles, will be overridden by props
  },
}); 