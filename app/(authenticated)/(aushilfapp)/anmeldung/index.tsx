import React, { useCallback, useContext, useState } from 'react';
import { View, Text, StyleSheet, LayoutAnimation } from 'react-native';
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



  const toggleAccordion = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(prev => !prev);
  }, []);




  return (
    <ScrollView style={styles.container}>
       <AnmeldenAccordion
          isExpanded={isExpanded}
          onToggle={toggleAccordion}
          accordionTitle="Anmeldedaten speichern"
          style={styles.accordion}
        />
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
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/webView')}
        >
          <Text style={[styles.buttonText, { fontSize: finalFontSize }]}>
            Hier!
          </Text>
        </TouchableOpacity>
        <Text style={[styles.text, { fontSize: finalFontSize }]}>
          (Deine Anmeldedaten werden automatisch übertragen! ✌️)
        </Text>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    backgroundColor: 'white',
    padding: 20,
  },
  accordion: {
    marginBottom: 20,
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
    maxWidth: 500,
    marginBottom: 40,
  },
  text: {
    color: '#444',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 40,
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