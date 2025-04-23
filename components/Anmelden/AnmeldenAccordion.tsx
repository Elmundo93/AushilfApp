import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createRStyle } from 'react-native-full-responsive';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useAuthStore } from '@/components/stores/AuthStore';
import { AnmeldeAccordionProps } from '@/components/types/components';
import { LinearGradient } from 'expo-linear-gradient';
import { useSQLiteContext } from 'expo-sqlite/next';
import { saveUserInfo } from '@/components/Crud/SQLite/Services/UserInfoService';
import { pushUserToSupabase } from '@/components/services/Storage/Syncs/UserSyncService';

const AnmeldenAccordion = ({ isExpanded, onToggle, accordionTitle }: AnmeldeAccordionProps) => {
  const { fontSize } = useContext(FontSizeContext);
  const { user, setUser } = useAuthStore();
  const db = useSQLiteContext();

  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [straße, setStraße] = useState('');
  const [hausnummer, setHausnummer] = useState('');
  const [plz, setPlz] = useState('');
  const [wohnort, setWohnort] = useState('');
  const [email, setEmail] = useState('');
  const [telefonnummer, setTelefonnummer] = useState('');
  const [steuernummer, setSteuernummer] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const maxFontSize = 45;
  const defaultFontSize = 24;
  const componentBaseFontSize = 24;
  const minIconSize = 40;
  const maxIconSize = 120;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  useEffect(() => {
    if (!isExpanded || !user) return;

    setVorname(user.vorname ?? '');
    setNachname(user.nachname ?? '');
    setStraße(user.straße ?? '');
    setHausnummer(user.hausnummer ?? '');
    setPlz(user.plz ?? '');
    setWohnort(user.wohnort ?? '');
    setEmail(user.email ?? '');
    setTelefonnummer(user.telefonnummer ?? '');
    setSteuernummer(user.steuernummer ?? '');
  }, [isExpanded]);

  const handleSave = async () => {
    const updatedUser = {
      ...user,
      vorname,
      nachname,
      straße,
      hausnummer,
      plz,
      wohnort,
      email,
      telefonnummer,
      steuernummer,
      id: user?.id ?? '',
      created_at: user?.created_at ?? new Date().toISOString(),
      location: user?.location ?? '',
    };

    try {
      setIsSaving(true);
      await saveUserInfo(db, updatedUser);
      await pushUserToSupabase(updatedUser);
      setUser(updatedUser);
      Alert.alert('Gespeichert', 'Deine Daten wurden gespeichert und synchronisiert.');
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      Alert.alert('Fehler', 'Beim Speichern ist etwas schiefgelaufen.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.accordContainer}>
      <TouchableOpacity style={styles.accordHeader} onPress={onToggle}>
        <Text style={[styles.accordTitle, { fontSize: finalFontSize }]}>{accordionTitle}</Text>
        <MaterialCommunityIcons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={iconSize} 
          color="#bbb" 
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.formContainer}>
          <TextInput style={styles.inputField} placeholder="Vorname" value={vorname} onChangeText={setVorname} />
          <TextInput style={styles.inputField} placeholder="Nachname" value={nachname} onChangeText={setNachname} />
          <TextInput style={styles.inputField} placeholder="Wohnort" value={wohnort} onChangeText={setWohnort} />
          <TextInput style={styles.inputField} placeholder="Straße" value={straße} onChangeText={setStraße} />
          <TextInput style={styles.inputField} placeholder="Hausnummer" value={hausnummer} onChangeText={setHausnummer} />
          <TextInput style={styles.inputField} placeholder="PLZ" value={plz} onChangeText={setPlz} />
          <TextInput style={styles.inputField} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.inputField} placeholder="Telefonnummer" value={telefonnummer} onChangeText={setTelefonnummer} keyboardType="phone-pad" />
          <TextInput style={styles.inputField} placeholder="Steuernummer" value={steuernummer} onChangeText={setSteuernummer} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            <LinearGradient
              colors={['#FFA500', '#FF8C00', '#fcb63d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalButton}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Daten speichern</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = createRStyle({
  accordContainer: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: '25rs',
    marginTop: '10rs',
    width: '320rs',
    alignSelf: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  accordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10rs',
  },
  accordTitle: {
    fontSize: '16rs',
    fontWeight: 'bold',
    color: '#333',
    padding: '5rs',
  },
  formContainer: {
    padding: '10rs',
  },
  inputField: {
    height: 40,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
  },
});

export default AnmeldenAccordion;