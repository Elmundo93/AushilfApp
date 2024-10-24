import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Image } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { Link } from 'expo-router';
import GoogleLogin from '@/components/Auth/GoogleAuth';
import { handleAppleSignIn } from '@/components/Auth/AppleAuth'; // Importiere die Apple Login Funktion
import { router } from 'expo-router';



const Registration = () => {

    const { promptAsync } = GoogleLogin();
  return (
    <SafeAreaView style={styles.container}>
         <Image source={require('@/assets/images/people.jpg')} resizeMode="center" style={styles.imageBackground}/>
         
            
            <View style={styles.welcomeView}>
            <Link href=".." asChild  style={styles.backButton}>
            <TouchableOpacity  >
            <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
            </Link>
                      <Text style={styles.welcomeText}>Registrieren</Text>
                    </View>
      <View style={styles.content}>
        <View style={styles.greenView}>

        <Text style={styles.greenText}>
          Registriere dich schnell und einfach mit Google oder Apple oder stelle dich manuell vor!
        </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={() => promptAsync()}
          >
            <AntDesign name="google" size={24} color="#4285F4" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Anmeldung mit Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.appleButton]}
            onPress={handleAppleSignIn} // Die importierte Funktion hier verwenden
          >
            <AntDesign name="apple1" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.appleButtonText]}>Anmeldung mit Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.manualButton]}
            onPress={() => router.push('/manuellRegistration')}
          >
            <FontAwesome name="user" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.manualButtonText]}>Manuell Anmelden</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4a90e2',
        alignItems: 'center',
        height:'100%'
    },
  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 150,
    opacity: 0.8
  
},
welcomeView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    justifyContent: 'center', // Zentriert den Inhalt horizontal
    position: 'relative', // Ermöglicht absolute Positionierung des backButton
    marginTop: 18,
},
  backButton: {
    position: 'absolute',
    top: 10, // Angepasst, um mit dem Padding des welcomeView übereinzustimmen
    left: 10,
    zIndex: 1, // Stellt sicher, dass der Button über dem Text liegt
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',  
    letterSpacing: 0.5,
    // Entfernen Sie jegliche Positionierungseigenschaften, falls vorhanden
  },
  
greenView: {

    padding: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 80,

},
greenText: {
    fontSize: 24,
    color: 'black',
    padding: 5,
    fontWeight: 'bold'
},
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    marginBottom: 30,
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {

  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  appleButtonText: {
    color: '#ffffff',
  },
  manualButton: {
    backgroundColor: '#007AFF',
  },
  manualButtonText: {
    color: '#ffffff',
  },
});

export default Registration;