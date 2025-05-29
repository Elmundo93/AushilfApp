// app/(public)/onboarding/userInfo.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, Modal, ScrollView } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

export default function UserInfoScreen() {
  const router = useRouter();
  const { fullName, phone, city, taxId, email, street, setField, password } = useOnboardingStore();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = () => {
    router.push('intent' as any);
  };

  const beeAnimation = require('@/assets/animations/Bee.json');
  const pathname = usePathname();

  const steps = ['intro', 'userinfo', 'intent','about', 'profileImage', 'password'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  return (
    <SafeAreaView style={styles.container}>
    
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(public)/(onboarding)/profileImage')}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topContainer}>
            <LottieView
              source={beeAnimation}
              autoPlay
              loop
              style={styles.lottie}
            />
            <View style={styles.progressContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, index <= currentStep && styles.activeDot]}
                />
              ))}
            </View>
            <View style={styles.titleCard}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Zum Schluss noch ein Passwort!</Text>
              </View>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => setField('email', text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Passwort</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Passwort"
                    keyboardType="default"
                    value={password}
                    onChangeText={(text) => setField('password', text)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            
              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Weiter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Datenschutzinformationen</Text>
            <Text style={styles.modalText}>
             Bis auf deinen Namen, sind alle Daten die du hier angibst nur für dich ersichtlich und werden sicher in der AushilfApp gespeichert.
             Falls du über die AushilfApp einen Anmeldevorgang startest, werden die angegebenen Daten automatisch und unkompliziert in den Anmeldeprozess der Minijobzentrale übernommen. 

          
            </Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.modalButtonText}>Verstanden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
 
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
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
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: 'white',
    transform: [{ scale: 1.2 }],
  },
  lottie: {
    position: 'absolute',
    top: -50,
    left: 130,
    right: 0,
    bottom: 0,
    width: 120,
    height: 120,
    alignSelf: 'center',
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    gap: 10,
  },
  topContainer: {
    paddingTop: 20,
    marginTop: 30,
  },
  titleCard: {
    padding: 25,
    borderRadius: 25,
    shadowColor: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    marginTop: -40,
  },
  inputContainer: {
    marginVertical: 5,
  },
  inputLabel: {
    position: 'absolute',
    top: -15,
    left: 10,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    zIndex: 10,
    backgroundColor: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  infoButton: {
    marginLeft: 10,
    padding: 5,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
});