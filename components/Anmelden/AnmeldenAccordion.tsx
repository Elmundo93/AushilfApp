import React, { useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Animated, Easing,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useAuthStore } from '@/components/stores/AuthStore';
import { AnmeldeAccordionProps } from '@/components/types/components';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite/next';
import { saveUserInfo } from '@/components/Crud/SQLite/Services/UserInfoService';
import { pushUserToSupabase } from '@/components/services/Storage/Syncs/UserSyncService';

const InputRow = ({ icon, placeholder, value, onChangeText, keyboardType = 'default', editableboolean = true }: any) => (
  <Animatable.View animation="fadeInUp" duration={500} style={styles.inputRow}>
    <MaterialCommunityIcons name={icon} size={22} color="#888" style={{ marginRight: 8 }} />
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={styles.input}
      placeholderTextColor="#aaa"
      editable={editableboolean}
    />
  </Animatable.View>
);

const AnmeldenAccordion = ({ isExpanded, onToggle, accordionTitle }: AnmeldeAccordionProps) => {
  const { user, setUser, setRegistrationSuccessConfirmed } = useAuthStore();
  const db = useSQLiteContext();
  const [isSaving, setIsSaving] = React.useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleSave = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      await saveUserInfo(db, user);
      await pushUserToSupabase(user);
      
      onToggle();
      setRegistrationSuccessConfirmed(true);
      
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      Alert.alert('Fehler', 'Beim Speichern ist etwas schiefgelaufen.');
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={onToggle}>
        <Text style={styles.title}>{accordionTitle}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <MaterialCommunityIcons name="chevron-down" size={28} color="#aaa" />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <Animatable.View animation="fadeInDown" duration={400} delay={50} style={styles.form}>
          <InputRow icon="account-outline" placeholder="Vorname" value={user?.vorname || ''} editableboolean={false} />
          <InputRow icon="account" placeholder="Nachname" value={user?.nachname || ''} editableboolean={false} />
          <InputRow icon="home-outline" placeholder="Wohnort" value={user?.wohnort || ''} onChangeText={(text: string) => setUser({ wohnort: text })} />
          <InputRow icon="road-variant" placeholder="Straße" value={user?.straße || ''} onChangeText={(text: string) => setUser({ straße: text })} />
          <InputRow icon="numeric" placeholder="Hausnummer" value={user?.hausnummer || ''} onChangeText={(text: string) => setUser({ hausnummer: text })} />
          <InputRow icon="map-marker" placeholder="PLZ" value={user?.plz || ''} onChangeText={(text: string) => setUser({ plz: text })} keyboardType="numeric" />
          <InputRow icon="email-outline" placeholder="Email" value={user?.email || ''} editableboolean={false} />
          <InputRow icon="phone" placeholder="Telefonnummer" value={user?.telefonnummer || ''} onChangeText={(text: string) => setUser({ telefonnummer: text })} keyboardType="phone-pad" />
          <InputRow icon="file-document-outline" placeholder="Steuernummer" value={user?.steuernummer || ''} onChangeText={(text: string) => setUser({ steuernummer: text })} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            <LinearGradient colors={['#FF9F43', '#FF8C00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
              {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Daten speichern</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    marginVertical: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
    color: '#444',
  },
  form: {
    marginTop: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#333',
  },
  saveButton: {
    marginTop: 24,
    borderRadius: 32,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 32,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
});

export default AnmeldenAccordion;