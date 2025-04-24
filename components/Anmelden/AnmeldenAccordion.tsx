import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Animated, Easing,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useAuthStore } from '@/components/stores/AuthStore';
import { AnmeldeAccordionProps } from '@/components/types/components';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite/next';
import { saveUserInfo } from '@/components/Crud/SQLite/Services/UserInfoService';
import { pushUserToSupabase } from '@/components/services/Storage/Syncs/UserSyncService';
import { User } from '@/components/types/auth';

const InputRow = ({ icon, placeholder, value, onChangeText, keyboardType = 'default' }: any) => (
  <Animatable.View animation="fadeInUp" duration={400} style={styles.inputRow}>
    <MaterialCommunityIcons name={icon} size={22} color="#888" style={{ marginRight: 8 }} />
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={styles.input}
      placeholderTextColor="#aaa"
    />
  </Animatable.View>
);

const AnmeldenAccordion = ({
  isExpanded,
  onToggle,
  accordionTitle,
  onFieldChange,
}: AnmeldeAccordionProps & { onFieldChange?: (count: number) => void }) => {
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

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const inputValues = [
    vorname, nachname, wohnort, straße, hausnummer,
    plz, email, telefonnummer, steuernummer,
  ];

  const updateProgress = () => {
    const filledCount = inputValues.filter(Boolean).length;
    onFieldChange?.(filledCount);
  };

  useEffect(() => {
    if (!user || !isExpanded) return;

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

  useEffect(() => {
    updateProgress();
  }, [vorname, nachname, straße, hausnummer, plz, wohnort, email, telefonnummer, steuernummer]);

  useEffect(() => {
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

  const handleSave = async () => {
    const updatedUser: User = {
      ...user,
      vorname, nachname, straße, hausnummer, plz,
      wohnort, email, telefonnummer, steuernummer,
      id: user?.id ?? '',
      created_at: user?.created_at ?? new Date().toISOString(),
      location: user?.location ?? null,
    };

    try {
      setIsSaving(true);
      await saveUserInfo(db, updatedUser);
      await pushUserToSupabase(updatedUser);
      setUser(updatedUser);
      Alert.alert('Gespeichert', 'Deine Daten wurden gespeichert und synchronisiert.');
      onToggle();
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      Alert.alert('Fehler', 'Beim Speichern ist etwas schiefgelaufen.');
    } finally {
      setIsSaving(false);
    }
  };

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
          <InputRow icon="account-outline" placeholder="Vorname" value={vorname} onChangeText={setVorname} />
          <InputRow icon="account" placeholder="Nachname" value={nachname} onChangeText={setNachname} />
          <InputRow icon="home-outline" placeholder="Wohnort" value={wohnort} onChangeText={setWohnort} />
          <InputRow icon="road-variant" placeholder="Straße" value={straße} onChangeText={setStraße} />
          <InputRow icon="numeric" placeholder="Hausnummer" value={hausnummer} onChangeText={setHausnummer} />
          <InputRow icon="map-marker" placeholder="PLZ" value={plz} onChangeText={setPlz} keyboardType="numeric" />
          <InputRow icon="email-outline" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <InputRow icon="phone" placeholder="Telefonnummer" value={telefonnummer} onChangeText={setTelefonnummer} keyboardType="phone-pad" />
          <InputRow icon="file-document-outline" placeholder="Steuernummer" value={steuernummer} onChangeText={setSteuernummer} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            <LinearGradient
              colors={['#FF9F43', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Daten speichern</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    marginVertical: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
  },
  form: {
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 32,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 32,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AnmeldenAccordion;