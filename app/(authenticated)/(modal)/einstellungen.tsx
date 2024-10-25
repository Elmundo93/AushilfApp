import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { signOut } from '@/components/services/AuthService';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { LinearGradient } from 'expo-linear-gradient';
const EinstellungenPage: React.FC = () => {

  const { fontSize, setFontSize } = useContext(FontSizeContext);
  const maxFontSize = 38; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 24; // Ausgangsschriftgröße für das Label
  const minIconSize = 35;
  const maxIconSize = 60;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  // Berechnung der angepassten Schriftgröße
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;

  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
  };

  const handleSignOut = async () => {
    await signOut();
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
          <Text style={[styles.cardText, { fontSize: finalFontSize }]}>Schriftgröße anpassen</Text>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={20}
          maximumValue={48}
          step={1}
          value={fontSize}
          onValueChange={handleFontSizeChange}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1EB1FC"
        />
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
        <TouchableOpacity style={styles.cardContent}>
          <MaterialIcons name="connect-without-contact" size={iconSize} color="black" />
          <Text style={[styles.cardText, { fontSize: finalFontSize }]}>Geblockte Kontakte verwalten</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.cardContent}>
          <MaterialIcons name="logout" size={iconSize} color="black" />
          <Text style={[styles.cardText, { fontSize: finalFontSize }]} onPress={handleSignOut}>Ausloggen</Text>
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
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    marginLeft: 10,
  },
  slider: {
    width: '100%',
    marginVertical: 18,
  },
});

export default EinstellungenPage;