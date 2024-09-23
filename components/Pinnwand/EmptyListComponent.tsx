import React from 'react';
import { View, Text } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';

const EmptyListComponent = () => (
  <View style={styles.emptyListContainer}>
    <Text style={styles.emptyListText}>Kein Eintrag für diese Kategorie gefunden 🤷</Text>
    <Text style={styles.emptyListText}>Bitte wähle einen anderen Filter!✌️</Text>
  </View>
);

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