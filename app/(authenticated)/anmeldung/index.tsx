import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';

const AnmeldungPage = () => {
  return (
    <View style={styles.container}>
      
      
        <View style={styles.textContainer}>
        <Text style={styles.text}>Du hast eine helfende Hand gefunden, oder hast die Möglichkeit eine zu sein?</Text>
        <Text style={styles.text}>Dann erfahre alles was du über die Anmeldung wissen musst, schnell und einfach</Text>
        <Link href='/pinnwand'>
          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.minijob-zentrale.de/DE/home/home_node.html')}>
            <Text style={styles.buttonText}>Hier!</Text>
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
  textContainer: {
    backgroundColor: '#f8f8f8',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
   
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  text: {
    fontSize: 22,
    color: '#444',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
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
    fontSize: 20,
    color: 'white',
  },
});

export default AnmeldungPage;