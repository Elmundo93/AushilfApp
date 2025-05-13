import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LottieView from 'lottie-react-native';
import { useAuthStore } from '@/components/stores/AuthStore';


export const FortschrittCircle = ({ percent }: { percent: number }) => {
  const lottieRef = useRef<LottieView>(null);
  const registrationSuccessConfirmed = useAuthStore(state => state.registrationSuccessConfirmed);
  const anmeldungsToggle = useAuthStore(state => state.anmeldungsToggle);
  const registrationProgress = useAuthStore(state => state.registrationProgress);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    if (percent === 100 && registrationSuccessConfirmed && anmeldungsToggle) {
      lottieRef.current?.play();
      startPulse();
      setShowSuccessAnimation(true);
    } else {
      lottieRef.current?.reset();
      pulseAnim.setValue(1);
      setShowSuccessAnimation(false);
    }
  }, [percent, registrationSuccessConfirmed]);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const getTintColor = () => {
    return percent === 100 ? '#FFD700' : '#FF8C00'; // Gold bei 100%, Orange sonst
  };

  return (
    <View style={styles.container}>
      <View style={styles.successTextContainer}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <AnimatedCircularProgress
          size={120}
          width={12}
          fill={percent}
          tintColor={getTintColor()}
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
      </Animated.View>

      { registrationSuccessConfirmed && (
        <Animated.View style={styles.lottieContainer}>
          <LottieView
            ref={lottieRef}
            source={require('@/assets/animations/Success.json')}
            autoPlay={false}
            loop={false}
            style={styles.lottie}
          />
        </Animated.View>
        
      )}
      </View>
      {registrationSuccessConfirmed && registrationProgress === 100 && (
        <View style={styles.successTextContainer}>
          <Text style={styles.successText}>Anmeldedaten vollständig!</Text>
          <Text style={styles.successText}>Jetzt kannst du loslegen!</Text>
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
    top: -40,
    right: -40,
    width: 100,   // etwas größer
    height: 100,
    zIndex: 1,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  successTextContainer: {
 
  },
  successText: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
});

export default FortschrittCircle;