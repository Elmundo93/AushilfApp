import React from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useLoading } from '@/components/provider/LoadingContext';

const { width } = Dimensions.get('window');
const LOGO_SRC = require('@/assets/images/BienenLogoNeat.png');

export const LoadingModal = () => {
  const { isLoading, loadingMessage, loadingStep } = useLoading();

  const glow = useSharedValue(1);
  glow.value = withRepeat(withTiming(1.6, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: glow.value * 0.3,
  }));

  return (
    <Modal visible={isLoading} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />

        {/* Optional animated sparkles */}
        <View style={styles.sparkleContainer}>
          {[...Array(6)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.sparkle,
                {
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.container}>
          {/* Glowing Pulse */}
          <Animated.View style={[styles.glowRing, glowStyle]} />

          {/* Static Logo */}
          <Image source={LOGO_SRC} style={styles.logo} resizeMode="contain" />

          <Text style={styles.message}>{loadingMessage}</Text>


          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(loadingStep / 3) * 100}%` }]} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(253, 253, 253, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: width * 0.75,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  logo: {
    width: 100,
    height: 100,
    zIndex: 2,
  },
  glowRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#facc15',
    opacity: 0.5,
    zIndex: 1,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  step: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 4,
  },
  sparkleContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  sparkle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fcd34d',
    opacity: 0.6,
  },
}); 