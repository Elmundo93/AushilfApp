import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import LottieView from 'lottie-react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';

const PinnwandHeader: React.FC = () => {
  const router = useRouter();

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Wilkommen auf der Pinnwand!</Text>
        <Text style={styles.welcomeText2}>Starte deine Suche und </Text>
        <TouchableOpacity style={styles.modalButton} onPress={() => router.push('/(modal)/createPost')}>
          <Text style={styles.modalButtonText}>Verfasse einen Pinnwandbeitrag!</Text>
          <Entypo name="new-message" size={30} color="white" style={styles.modalButtonIcon} />
        </TouchableOpacity>
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
    marginVertical: '20rs',
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
  modalButton: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    paddingVertical: '10rs',
    marginTop: '10rs',
    width: '330rs',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
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