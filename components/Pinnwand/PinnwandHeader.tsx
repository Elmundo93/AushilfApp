import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import LottieView from 'lottie-react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import {LinearGradient} from 'expo-linear-gradient';
const PinnwandHeader: React.FC = () => {
  const router = useRouter();
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 42; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 24; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 34; // Ausgangsschriftgröße für das Label

  // Berechnung der angepassten Schriftgröße
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;


  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={[styles.welcomeText, { fontSize: finalFontSize }]}>Wilkommen auf der Pinnwand!</Text>
        <Text style={[styles.welcomeText2, { fontSize: finalFontSize }]}>Starte deine Suche und </Text>
        <View style={styles.modalButtonContainer}>
        <TouchableOpacity onPress={() => router.push('/(modal)/createPost')}>
          <LinearGradient
            colors={['#FFA500', '#FF8C00', '#fcb63d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalButton}
          >
            <Text style={[styles.modalButtonText, { fontSize: finalFontSize }]}>Verfasse einen Pinnwandbeitrag!</Text>
            <Entypo name="new-message" size={30} color="white" style={styles.modalButtonIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      </View>
      <View style={styles.lottieContainer}>
        {[1, 2, 3].map((_, index) => (
          <LottieView
            key={index}
            source={require('@/assets/animations/SpinnigGreenArrow.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        ))}
      </View>
    </View>
  );
};

const styles = createRStyle({
  headerContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: '24rs',
    fontWeight: 'bold',
    marginBottom: '10rs',
    alignSelf: 'center',
  },
  welcomeText2: {
    fontSize: '24rs',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'orange',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  modalButton: {
    borderRadius: 25,
    paddingVertical: '10rs',
    marginTop: '10rs',
    width: '330rs',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    shadowColor: 'green',
    elevation: 2,
  },
  modalButtonIcon: {
    paddingLeft: '15rs',
  },
  modalButtonText: {
    color: 'white',
    fontSize: '24rs',
    fontWeight: 'bold',
    flexShrink: 1,
  },
  lottieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  lottie: {
    alignSelf: 'center',
    width: '100rs',
    height: '40rs',
    zIndex: 1000,
    transform: [{ rotate: '180deg' }],
  },
});

export default PinnwandHeader;