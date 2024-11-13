import React from 'react';
import { View, Text } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { LinearGradient } from 'expo-linear-gradient';

const EmptyListComponent = () => {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 45; // Passen Sie diesen Wert nach Bedarf an

  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = Math.min(fontSize, maxFontSize);

  return (
  <View style={styles.emptyListContainer}>
  <LinearGradient
      colors={['orange', 'white', 'orange']}
      style={styles.gradient}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.5, 1]}
    >
    <Text style={[styles.emptyListText, { fontSize: adjustedFontSize }]}>Kein Eintrag für diese Kategorie gefunden 🤷</Text>
    <Text style={[styles.emptyListText, { fontSize: adjustedFontSize }]}>Bitte wähle einen anderen Filter!✌️</Text>
    </LinearGradient>
    </View>
  );
};

const styles = createRStyle({
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50,
    borderRadius: 50,

  },
  gradient: {
    borderRadius: 50,
    padding: 20,
  },
  emptyListText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default EmptyListComponent;