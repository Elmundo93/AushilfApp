import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '@/components/hooks/useAuth';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const EinstellungenPage: React.FC = () => {
  const { fontSize, setFontSize } = useContext(FontSizeContext);
  const defaultFontSize = 22;
  const readingModeFontSize = 32;
  const componentBaseFontSize = 24;
  const minIconSize = 35;
  const maxIconSize = 60;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const { logout } = useAuth();

  const isReadingMode = fontSize > defaultFontSize;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = adjustedFontSize;

  const toggleReadingMode = () => {
    setFontSize(isReadingMode ? defaultFontSize : readingModeFontSize);
  };

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['orange', 'white']}
        style={styles.gradient}
      />
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Entypo name="open-book" size={iconSize} color="black" />
          <Text style={[styles.cardText, { fontSize: finalFontSize }]}>Lesehilfe-Modus</Text>
          <Switch
            value={isReadingMode}
            onValueChange={toggleReadingMode}
            trackColor={{ false: '#d3d3d3', true: 'orange' }}
            thumbColor={isReadingMode ? '#1EB1FC' : '#f4f3f4'}
          />
        </View>
        <Text style={[styles.descriptionText, { fontSize: finalFontSize * 0.8 }]}>
          Vergößert die Schrift
        </Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.cardContent}>
          <FontAwesome name="credit-card" size={iconSize} color="black" />
          <Text style={[styles.cardText, { fontSize: finalFontSize }]}>Zahlungsmethode anpassen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.cardContent}>
          <MaterialIcons name="security" size={iconSize} color="black" />
          <Text style={[styles.cardText, { fontSize: finalFontSize }]}>Datenschutzrichtlinien</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.cardContent} onPress={() => router.push('(modal)/blockedUser' as any)}>
          <MaterialIcons name="connect-without-contact" size={iconSize} color="black" />
          <Text style={[styles.cardText, { fontSize: finalFontSize }]}>Geblockte Kontakte verwalten</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.cardContent}  onPress={handleSignOut}>
          <MaterialIcons name="logout" size={iconSize} color="black" />
          <Text style={[styles.cardText, { fontSize: finalFontSize }]}>Ausloggen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',

    backgroundColor: 'white',
    padding: 20,
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  card: {
    
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    elevation: 3,
    marginBottom: 20,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,

    flexWrap: 'wrap',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  cardText: {
    fontSize: 18,
    marginLeft: 10,
    flex: 1,
  },
  slider: {
    width: '100%',
    marginVertical: 18,
  },
  descriptionText: {
    marginTop: 10,
    fontSize: 16,
    alignSelf: 'center',
  },
});

export default EinstellungenPage;