import React from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';

const PermissionDeniedScreen = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Standortberechtigung benötigt</Text>
      <Text style={styles.message}>
        Die App benötigt Zugriff auf deinen Standort, um relevante Posts in deiner Nähe zu zeigen. Bitte aktiviere die Standortberechtigung in den Einstellungen.
      </Text>
      <Button title="Einstellungen öffnen" onPress={() => Linking.openSettings()} />
      <Button title="Erneut versuchen" onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 16, 
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default PermissionDeniedScreen;