import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { signUp } from '@/components/services/Auth/AuthService';
import { User } from '@/components/types/auth';

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    vorname: '',
    nachname: '',
    location: ''
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || 
        !formData.vorname || !formData.nachname || !formData.location) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Fehler', 'Die Passwörter stimmen nicht überein.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
  
    try {
      const userData: User = {
        email: formData.email,
        vorname: formData.vorname,
        nachname: formData.nachname,
        location: formData.location,
        id: '',
        created_at: ''  
      };
  
      const result = await signUp(formData.email, formData.password, userData);
  
      if (result.error) {
        throw new Error(result.error);
      }
  
      // Erfolgreiche Registrierung
      router.replace('/(authenticated)/(aushilfapp)/pinnwand');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
      Alert.alert('Fehler bei der Registrierung', errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label: string, name: keyof typeof formData, placeholder: string, secureTextEntry = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={formData[name]}
        style={styles.input}
        placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
        placeholder={placeholder}
        autoCapitalize="none"
        onChangeText={(text) => handleInputChange(name, text)}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.formContainer}>
          {renderInput("Vorname:", "vorname", "Vorname")}
          {renderInput("Nachname:", "nachname", "Nachname")}
          {renderInput("E-Mail Adresse:", "email", "Email")}
          {renderInput("Ort:", "location", "Ort")}
          {renderInput("Passwort:", "password", "Passwort", )}
          {renderInput("Passwort wiederholen:", "confirmPassword", "Passwort wiederholen", )}
        </View>
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrieren!</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a90e2',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    

  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Page;