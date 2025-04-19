import React, { useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, LayoutAnimation, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AnmeldenAccordion from '@/components/Anmelden/AnmeldenAccordion';
import { ScrollView } from 'react-native';

const AnmeldungPage = () => {
  const { fontSize } = useContext(FontSizeContext);
  const defaultFontSize = 20;
  const componentBaseFontSize = 26;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const maxFontSize = 40;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonScale = new Animated.Value(1);

  const toggleAccordion = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(prev => !prev);
  }, []);

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
        <Text style={[styles.heading, { fontSize: finalFontSize * 1.2 }]}>
          Minijob anmelden
        </Text>
        
        <View style={styles.ul}>
          <View style={styles.li}>
            <View style={styles.bullet} />
            <Text style={[styles.liText, { fontSize: finalFontSize }]}>
              Direkt zur Anmeldung mit einem Klick
            </Text>
          </View>
          
          <View style={styles.li}>
            <View style={styles.bullet} />
            <Text style={[styles.liText, { fontSize: finalFontSize }]}>
              Anmeldedaten sicher speichern
            </Text>
          </View>
          
          <View style={styles.li}>
            <View style={styles.bullet} />
            <Text style={[styles.liText, { fontSize: finalFontSize }]}>
              Automatische Datenübertragung ✌️
            </Text>
          </View>
        </View>

        <AnmeldenAccordion
          isExpanded={isExpanded}
          onToggle={toggleAccordion}
          accordionTitle="Anmeldedaten speichern"
          style={styles.accordion}
        />
        
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
    backgroundColor: '#ffffff',
    padding: 20,
  },
  accordion: {
    marginBottom: 20,
  },
  textContainer: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width: '100%',
    maxWidth: 500,
    marginBottom: 40,
  },
  heading: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 40,
    fontWeight: 'bold',
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
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF8C00',
    marginRight: 12,
  },
  liText: {
    color: '#333',
    flex: 1,
    lineHeight: 28,
    paddingTop: 2,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 25,
    marginBottom: 20,
    shadowColor: '#FF8C00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
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