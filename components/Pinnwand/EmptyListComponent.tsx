import React from 'react';
import { View, Text } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';

const EmptyListComponent = () => {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 45; // Passen Sie diesen Wert nach Bedarf an

  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = Math.min(fontSize, maxFontSize);

  return (
  <View style={styles.emptyListContainer}>
    <Text style={[styles.emptyListText, { fontSize: adjustedFontSize }]}>Kein Eintrag für diese Kategorie gefunden 🤷</Text>
    <Text style={[styles.emptyListText, { fontSize: adjustedFontSize }]}>Bitte wähle einen anderen Filter!✌️</Text>
    </View>
  );
};

const styles = createRStyle({
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyListText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default EmptyListComponent;