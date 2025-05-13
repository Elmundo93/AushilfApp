import React, { useContext, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/components/stores/AuthStore';
import { FortschrittCircle } from '@/components/Anmelden/FortschrittsCircle';
import AnmeldenAccordion from '@/components/Anmelden/AnmeldenAccordion'; // falls nicht schon importiert

const AnmeldungPage = () => {
  const { fontSize } = useContext(FontSizeContext);
  const router = useRouter();
  const registrationProgress = useAuthStore(state => state.registrationProgress);
  const anmeldungsToggle = useAuthStore(state => state.anmeldungsToggle);
  const setAnmeldungsToggle = useAuthStore(state => state.setAnmeldungsToggle);
  const defaultFontSize = 18;
  const componentBaseFontSize = 26;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const maxFontSize = 30;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.textContainer}>
      
        {/* Fortschrittsanzeige */}
        <FortschrittCircle percent={registrationProgress} />

        {/* Accordion */}
        <AnmeldenAccordion 
          isExpanded={anmeldungsToggle} 
          onToggle={() => setAnmeldungsToggle(!anmeldungsToggle)} 
          accordionTitle="Anmeldedaten speichern" 
        />

        {/* Vorteile */}
        <View style={styles.ul}>
          <View style={styles.li}>
            <Text style={styles.arrowIcon}>✅</Text>
            <Text style={[styles.liText, { fontSize: finalFontSize }]} adjustsFontSizeToFit={true} numberOfLines={2}>
              Automatische{'\n'}Datenübertragung
            </Text>
          </View>
          <View style={styles.li}>
            <Text style={[styles.arrowIcon]}>⬇️</Text>
            <Text style={[styles.liText, { fontSize: finalFontSize }]} adjustsFontSizeToFit={true} numberOfLines={3}>
              Mit einem{'\n'}Klick zur Minijobzentrale!
            </Text>
          </View>
        </View>

        {/* Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/webView')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={['#FF9F43', '#FF8C00']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.buttonText, { fontSize: finalFontSize }]}>
                Anmelden!
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  textContainer: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width: '100%',
    maxWidth: 500,
    marginBottom: 40,
  },
  lottie: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  ul: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 30,
  },
  arrowIcon: {
    marginRight: 12,
    fontSize: 30,
  },
  liText: {
    color: '#333',
    flex: 1,
    lineHeight: 30,
    paddingTop: 2,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 25,
    marginBottom: 20,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default AnmeldungPage;