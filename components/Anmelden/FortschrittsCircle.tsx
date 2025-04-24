// components/Anmelden/FortschrittCircle.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LottieView from 'lottie-react-native';

export const FortschrittCircle = ({ filled, total }: { filled: number, total: number }) => {
  const percent = Math.round((filled / total) * 100);
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (percent === 100) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.reset();
    }
  }, [percent]);

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={120}
        width={12}
        fill={percent}
        tintColor="#FF8C00"
        backgroundColor="#eee"
        rotation={0}
        duration={500}
        lineCap="round"
      >
        {() => (
          <Text style={styles.percentText}>
            {percent}%
          </Text>
        )}
      </AnimatedCircularProgress>

      {/* Erfolgseffekt */}
      {percent === 100 && (
        <View style={styles.lottieContainer}>
          <LottieView
            ref={lottieRef}
            source={require('@/assets/animations/Success.json')}
            autoPlay={false}
            loop={false}
            style={styles.lottie}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#444',
  },
  lottieContainer: {
    position: 'absolute',
    top: -25,
    right: -25,
    width: 80,
    height: 80,
    zIndex: 1,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});