import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';


const PinnwandHeader: React.FC = () => {
  const router = useRouter();
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 42;
  const defaultFontSize = 24;
  const componentBaseFontSize = 34;

  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="light" style={styles.blurView}>
        <View style={styles.content}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.welcomeText1, { fontSize: finalFontSize }]}>
            Willkommen auf der
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.welcomeText, { fontSize: finalFontSize }]}>
            Pinnwand!
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.welcomeText, { fontSize: finalFontSize }]}>
            Starte deine Suche
          </Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.welcomeText, { fontSize: finalFontSize }]}>
            und
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => router.push('/(modal)/createPost')}>
            <LinearGradient
              colors={['orange', 'rgb(255, 128, 0)']} 
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <Text numberOfLines={2} adjustsFontSizeToFit style={[styles.modalButtonText, { fontSize: finalFontSize }]}>
              Verfasse einen Pinnwandbeitrag!
            </Text>
            <Entypo name="new-message" size={30} color="white" style={styles.modalButtonIcon} />
          </TouchableOpacity>
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
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 10,
    position: 'relative',
    top: -15,
    borderWidth: 1,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopWidth: 0,
    borderColor: 'orange',
    overflow: 'hidden',
    zIndex: 1000,
  },
  blurView: {
    minHeight: 200,
    zIndex: 1000,
  },
  content: {
    paddingTop: 10,
    padding: 10,
  },
  welcomeText1: {
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  modalButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    width: 330,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 5,
 
    borderColor: 'rgba(255, 140, 0, 0.5)',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 5,
    fontSize: 18,
  },
  modalButtonIcon: {
    paddingHorizontal: 15,
  },
  lottieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
  },
  lottie: {
    alignSelf: 'center',
    width: 100,
    height: 40,
    zIndex: 1000,
    transform: [{ rotate: '180deg' }],
  },
});

export default PinnwandHeader;