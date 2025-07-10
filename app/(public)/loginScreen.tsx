import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useLoading } from '@/components/provider/LoadingContext';
import { useAuth } from '@/components/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { withLoading } = useLoading();
  const { loginWithEmail } = useAuth();

  const beeAnimation = require('@/assets/animations/Bee.json');

  const handleEmailLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Fehler', 'Bitte E-Mail und Passwort eingeben.');
    }

    try {
      setLoading(true);
      await withLoading(async () => {
        const user = await loginWithEmail(email, password);
        // Navigation übernimmt der AuthProvider!
        return user;
      }, 'Anmeldung läuft...');
    } catch (e) {
      Alert.alert('Login fehlgeschlagen', 'Prüfen Sie Ihre Zugangsdaten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(public)/')}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <LottieView
          source={beeAnimation}
          autoPlay
          loop
          style={styles.lottie}
        />

        <Text style={styles.welcome}>Willkommen!</Text>
        <Text style={styles.subtitle}>Bitte logge dich mit deiner E-Mail ein.</Text>

        <View style={styles.box}>
          <TextInput
            style={styles.input}
            placeholder="E-Mail"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
            maxFontSizeMultiplier={1.2}
          />
          <TextInput
            style={styles.input}
            placeholder="Passwort"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
            maxFontSizeMultiplier={1.2}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleEmailLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Einloggen</Text>
            )}
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>Neu hier?</Text>
            <View style={styles.orLine} />
          </View>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/(public)/(onboarding)/intro' as any)}
          >
            <Text style={[styles.buttonText, styles.secondaryText]}>Jetzt registrieren!</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Info', 'Passwort-Funktion folgt.')}
            style={styles.forgotContainer}
          >
            <Text style={styles.forgot}>Passwort vergessen?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    zIndex: 2,
  },
  lottie: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  welcome: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  box: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'orange',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'orange',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  secondaryText: {
    color: 'orange',
  },
  forgotContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  forgot: {
    fontSize: 14,
    color: '#333',
    textDecorationLine: 'underline',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    color: '#555',
    fontSize: 16,
  },
});