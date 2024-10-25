import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
const AnmeldungPage = () => {
  const { fontSize } = useContext(FontSizeContext);
  const defaultFontSize = 20; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 26; // Ausgangsschriftgröße für das Label

  // Berechnung der angepassten Schriftgröße
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;

  // Optional: Grenzen setzen
  const maxFontSize = 40;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <LinearGradient
        colors={['orange', 'white']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradient}
      />
        <Text style={[styles.text, { fontSize: finalFontSize }]}>
          Du hast eine helfende Hand gefunden, oder hast die Möglichkeit eine zu sein?
        </Text>
        <Text style={[styles.text, { fontSize: finalFontSize }]}>
          Dann erfahre alles was du über die Anmeldung wissen musst, schnell und einfach
        </Text>
        <Link href='/pinnwand'>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => Linking.openURL('https://www.minijob-zentrale.de/DE/service/formulare/haushaltshilfe-anmelden/_node.html')}
          >
            <Text style={[styles.buttonText, { fontSize: finalFontSize }]}>Hier!</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
  },
  textContainer: {
    backgroundColor: '#f8f8f8',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
    maxWidth: 500, // Maximale Breite hinzugefügt
    
  },
  text: {
    color: '#444',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 40, // Erhöht für besseren Zeilenabstand
  },
  button: {
    backgroundColor: '#ff8c00',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AnmeldungPage;