import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

interface AnimatedLogoProps {
  size?: number;
  showWaves?: boolean;
  showRing?: boolean;
  showGlow?: boolean;
  logoText?: string;
  color?: string;
  onAnimationComplete?: () => void;
}

export default function AnimatedLogo({
  size = 120,
  showWaves = true,
  showRing = true,
  showGlow = true,

  color = '#f59e0b',
  onAnimationComplete,
}: AnimatedLogoProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const waveAnim1 = useRef(new Animated.Value(1)).current;
  const waveAnim2 = useRef(new Animated.Value(1)).current;
  const waveAnim3 = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Pulse animation
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

    // Rotate animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    // Wave animations
    const waveAnimation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim1, {
          toValue: 2.5,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const waveAnimation2 = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim2, {
          toValue: 2.5,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim2, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const waveAnimation3 = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim3, {
          toValue: 2.5,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim3, {
          toValue: 1,
          duration: 3000,
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

    // Start all animations
    pulseAnimation.start();
    rotateAnimation.start();
    if (showWaves) {
      waveAnimation1.start();
      waveAnimation2.start();
      waveAnimation3.start();
    }
    if (showGlow) {
      glowAnimation.start();
    }

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
      waveAnimation1.stop();
      waveAnimation2.stop();
      waveAnimation3.stop();
      glowAnimation.stop();
    };
  }, [showWaves, showGlow]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const waveSize = size;
  const ringSize = size + 20;

  return (
    <View style={[styles.container, { width: ringSize, height: ringSize }]}>
      {/* Pulsing Waves */}
      {showWaves && (
        <>
          <Animated.View
            style={[
              styles.wave,
              {
                width: waveSize,
                height: waveSize,
                borderRadius: waveSize / 2,
                borderColor: color,
                transform: [{ scale: waveAnim1 }],
                opacity: waveAnim1.interpolate({
                  inputRange: [1, 2.5],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.wave,
              {
                width: waveSize,
                height: waveSize,
                borderRadius: waveSize / 2,
                borderColor: color,
                transform: [{ scale: waveAnim2 }],
                opacity: waveAnim2.interpolate({
                  inputRange: [1, 2.5],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.wave,
              {
                width: waveSize,
                height: waveSize,
                borderRadius: waveSize / 2,
                borderColor: color,
                transform: [{ scale: waveAnim3 }],
                opacity: waveAnim3.interpolate({
                  inputRange: [1, 2.5],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />
        </>
      )}

      {/* Rotating Ring */}
      {showRing && (
        <Animated.View
          style={[
            styles.rotatingRing,
            {
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderColor: color,
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        />
      )}

      {/* Main Logo */}
      <Animated.View
        style={[
          styles.mainLogo,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.logoPlaceholder,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
          ]}
        >
        <Image source={require('@/assets/images/BienenLogoNeat.png')} style={{ width: size, height: size }} />
        </View>
      </Animated.View>

      {/* Glowing Effect */}
      {showGlow && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    position: 'absolute',
    borderWidth: 2,
  },
  rotatingRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  mainLogo: {
    position: 'relative',
    zIndex: 10,
  },
  logoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    textAlign: 'center',
  },
  glowEffect: {
    position: 'absolute',
  },
}); 