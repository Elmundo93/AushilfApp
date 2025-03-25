// LoginScreen.tsx
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  View,
  Text,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { createRStyle } from 'react-native-full-responsive';
import useKeyboard from '@/components/Keyboard/useKeyboard';
import { useLoading } from '@/components/provider/LoadingContext';
import { useAuthStore } from '@/components/stores/AuthStore';
import { signInWithPassword } from '@/components/services/AuthService';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { opacity } = useKeyboard();
  const { setIsLoading } = useLoading();
  const router = useRouter();
  
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    setLoading(true);
    setIsLoading(true);

    try {
      const { userData } = await signInWithPassword(email, password);
     
      if (!userData) {
        Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');

      }
      else if (userData ) {
        console.log('User data:', userData);
        router.replace('/(authenticated)/(aushilfapp)/pinnwand');
        
      }

    } catch (error) {
      console.error('Login error:', error);

    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('@/assets/images/peopleWhiteBackground.png')}
        resizeMode="cover"
        style={styles.imageBackground}
      />
      <LinearGradient
        colors={['orange', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.contentContainer}>
        <View style={styles.welcomeView}>
          <Link href=".." asChild>
            <TouchableOpacity style={styles.backButton}>
              <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
          </Link>
          <Animated.Text style={[styles.welcomeText, { opacity: opacity }]}>
            Anmelden
          </Animated.Text>
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              Bitte geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein, um sich anzumelden.
            </Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              value={email}
              style={styles.input}
              placeholder="E-Mail"
              placeholderTextColor="#666"
              autoCapitalize="none"
              onChangeText={setEmail}
            />
            <TextInput
              secureTextEntry
              value={password}
              style={styles.input}
              placeholder="Passwort"
              placeholderTextColor="#666"
              autoCapitalize="none"
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Anmelden</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = createRStyle({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '150rs',
    opacity: 0.8,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    zIndex: 3,
  },
  welcomeView: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    position: 'relative',
    marginTop: 18,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: '20rs',
  },
  headerContainer: {
    marginBottom: '30rs',
    alignItems: 'center',
    marginTop: '-100rs',
  },
  headerText: {
    fontSize: '28rs',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10rs',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20rs',
    borderRadius: '15rs',
    elevation: 3,
  },
  input: {
    height: '50rs',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: '25rs',
    paddingHorizontal: '15rs',
    fontSize: '16rs',
    marginBottom: '15rs',
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: 'orange',
    height: '50rs',
    borderRadius: '25rs',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20rs',
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: '18rs',
    fontWeight: 'bold',
  },
});