import React, { useEffect, useState } from 'react';
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
import { useLoading } from '@/components/provider/LoadingContext';
import { useAuth } from '@/components/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { OAuthFlowManager } from '@/components/services/Auth/OAuthFlowManager';
import { supabase } from '@/components/config/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setIsLoading } = useLoading();
  const { loginWithEmail, loginWithOAuth, finalizeOAuthLogin } = useAuth();

  useEffect(() => {
    const maybeFinalizeOAuth = async () => {
      const isPending = await OAuthFlowManager.isPending();
      if (!isPending) {
        console.log('ℹ️ Kein ausstehender OAuth-Login. Breche ab.');
        return;
      }
  
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const user = await finalizeOAuthLogin();
          if (user) {
            console.log('✅ OAuth erfolgreich abgeschlossen');
            router.replace('/(authenticated)/(aushilfapp)/pinnwand');
          }
        } else {
          console.warn('⚠️ Session nach OAuth-Redirect ist leer');
        }
      } catch (e) {
        console.error('❌ Fehler beim Finalisieren des OAuth-Flows:', e);
      } finally {
        setLoading(false);
      }
    };
  
    maybeFinalizeOAuth();
  }, []);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Fehler', 'Bitte E-Mail und Passwort eingeben.');
    }

    setLoading(true);
    setIsLoading(true);

    try {
      const user = await loginWithEmail(email, password);
      if (user) {
        router.replace('/(authenticated)/(aushilfapp)/pinnwand');
      }
    } catch (e) {
      Alert.alert('Login fehlgeschlagen', 'Prüfen Sie Ihre Zugangsdaten.');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setIsLoading(true);

    try {
      await loginWithOAuth(provider);
      // Supabase + WebBrowser-Redirect wird nun erwartet.
      // Finalisierung passiert im useEffect oben.
    } catch (e) {
      console.error(`❌ Fehler bei OAuth (${provider})`, e);
      await OAuthFlowManager.clear(); // Immer aufräumen
      Alert.alert('Fehler', `Login mit ${provider} fehlgeschlagen.`);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['orange', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <Text style={styles.title}>Anmelden</Text>

        <View style={styles.box}>
          <TextInput
            style={styles.input}
            placeholder="E-Mail"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Passwort"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleEmailLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Weiter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.oauth]}
            onPress={() => handleOAuth('google')}
            disabled={loading}
          >
            <View style={styles.oauthButtonContent}>
              <Ionicons name="logo-google" size={24} color="#000" />
              <Text style={[styles.buttonText, styles.oauthText]}>
                Mit Google anmelden
              </Text>
            </View>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.button, styles.oauth, styles.appleButton]}
              onPress={() => handleOAuth('apple')}
              disabled={loading}
            >
              <View style={styles.oauthButtonContent}>
                <Ionicons name="logo-apple" size={24} color="#000" />
                <Text style={[styles.buttonText, styles.oauthText]}>
                  Mit Apple anmelden
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    marginBottom: 20,
  },
  box: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 4,
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
    marginBottom: 15,
  },
  buttonText: { color: '#fff', fontSize: 18 },
  oauth: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#000' },
  oauthText: { color: '#000', marginLeft: 10 },
  oauthButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleButton: { marginTop: 10 },
});