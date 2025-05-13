//AskForLocation.tsx
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocationRequest } from '@/components/Location/locationRequest';
import { useLocationStore } from '@/components/stores/locationStore';
import { useState } from 'react';
import React from 'react';

const AskForLocation = () => {
  const { requestLocation } = useLocationRequest();
  const { setLocationPermission } = useLocationStore();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const requestLocationPermission = async () => {
    if (loading) return;

    setLoading(true);
    setErrorMsg('');

    const permissionGranted = await requestLocation();

    if (permissionGranted) {
      try {
        setLocationPermission(true);
      } catch (error) {
        console.error('Fehler bei setLocationPermission:', error);
        setErrorMsg('Ein unerwarteter Fehler ist aufgetreten.');
      }
    } else {
      setErrorMsg('Standort konnte nicht aktiviert werden. Bitte prüfe die Einstellungen.');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="location" size={50} color="orange" style={styles.icon} />
        
        <Text style={styles.title}>Standort erforderlich</Text>
        <Text style={styles.description}>
          Damit dir Beiträge aus deiner Nähe angezeigt werden können, benötigt die App Zugriff auf deinen Standort.
        </Text>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={requestLocationPermission}
          disabled={loading}
          accessibilityLabel="Standort aktivieren"
          accessibilityHint="Ermöglicht das Anzeigen von Beiträgen in deiner Umgebung"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="navigate" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Standort aktivieren</Text>
            </>
          )}
        </TouchableOpacity>

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: 'orange',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    marginTop: 16,
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default AskForLocation;