import React, { useState } from 'react';
import { KeyboardAvoidingView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { View, Text } from 'react-native';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { signInWithPassword } from '@/components/services/AuthService';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    setLoading(true);
    try {
    const { userData } = await signInWithPassword(email, password);
      if (!userData) {
        Alert.alert('Anmeldefehler', 'Ungültige Anmeldeinformationen');
      } else {
        // Erfolgreiche Anmeldung
        router.replace('/pinnwand');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('@/assets/images/people.jpg')} resizeMode="cover" style={styles.imageBackground} />
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
            placeholderTextColor={'#666'}
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            secureTextEntry={true}
            value={password}
            style={styles.input}
            placeholder="Passwort"
            placeholderTextColor={'#666'}
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
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
    </SafeAreaView>
  );
};

export default Page;

const styles = createRStyle({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.2
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
    backgroundColor: '#4a90e2',
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