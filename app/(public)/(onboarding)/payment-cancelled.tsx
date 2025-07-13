// app/(public)/(onboarding)/payment-cancelled.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AnimatedLogo,
  FloatingParticles,
  AnimatedText,
  AnimatedBackground,
} from '@/components/Animation';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaymentCancelled() {
  const router = useRouter();

  const handleRetry = () => {
    router.replace('/(public)/(onboarding)/subscribe');
  };

  return (
    <View style={styles.container}>
        <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Animated Background */}
      <AnimatedBackground color="#dc3545" />

      {/* Floating Particles */}
      <FloatingParticles count={6} color="#dc3545" />

      {/* Logo Animation */}
      <View style={styles.logoContainer}>
        <AnimatedLogo 
          size={120}
          logoText="🛑"
          color="#dc3545"
        />
      </View>

      {/* Enhanced Welcome Text */}
      <View style={styles.textContainer}>
        <AnimatedText
          fontSize={32}
          fontWeight="bold"
          color="#dc3545"
          enablePulse={true}
          enableGlow={true}
        >
          Zahlung abgebrochen
        </AnimatedText>
        <AnimatedText
          fontSize={24}
          fontWeight="600"
          color="#374151"
          enablePulse={true}
          enableGlow={true}
        >
          Du kannst es jederzeit erneut versuchen
        </AnimatedText>

        {/* Decorative elements */}
        <View style={styles.decorativeContainer}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.decorativeDot, { backgroundColor: '#dc3545' }]} />
          ))}
        </View>
      </View>

      {/* Message */}
      <AnimatedText
        style={styles.message}
        enablePulse={true}
        enableGlow={false}
      >
        Du hast den Verifizierungsprozess abgebrochen. Du kannst ihn jederzeit neu starten.
      </AnimatedText>

      {/* Button */}
      <Pressable style={styles.button} onPress={handleRetry}>
        <Text style={styles.buttonText}>Zurück zur App</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    position: 'relative',
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  decorativeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});