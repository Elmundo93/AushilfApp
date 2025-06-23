import React, { useContext, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Platform, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/components/stores/AuthStore';
import { FortschrittCircle } from '@/components/Anmelden/FortschrittsCircle';
import AnmeldenAccordion from '@/components/Anmelden/AnmeldenAccordion';
import { pushUserToSupabase } from '@/components/services/Storage/Syncs/UserSyncService';

interface UserData {
  vorname?: string;
  nachname?: string;
  wohnort?: string;
  straße?: string;
  hausnummer?: string;
  plz?: string;
  email?: string;
  telefonnummer?: string;
  steuernummer?: string;
  [key: string]: string | undefined;
}

const convertUserToUserData = (user: any): UserData => {
  if (!user) return {};
  return {
    vorname: user.vorname,
    nachname: user.nachname,
    wohnort: user.wohnort,
    straße: user.straße,
    hausnummer: user.hausnummer,
    plz: user.plz,
    email: user.email,
    telefonnummer: user.telefonnummer,
    steuernummer: user.steuernummer,
  };
};

const mergeUserData = (user: any, userData: UserData): any => {
  return {
    ...user,
    ...userData,
  };
};

const AnmeldungPage = () => {
  const { fontSize } = useContext(FontSizeContext);
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const registrationProgress = useAuthStore(state => state.registrationProgress);
  const anmeldungsToggle = useAuthStore(state => state.anmeldungsToggle);
  const setAnmeldungsToggle = useAuthStore(state => state.setAnmeldungsToggle);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUserData, setTempUserData] = useState<UserData>(convertUserToUserData(user));

  const defaultFontSize = 18;
  const componentBaseFontSize = 26;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const maxFontSize = 30;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempUserData(convertUserToUserData(user));
  };

  const handleSave = async () => {
    if (!tempUserData || !user) return;
    
    setIsSaving(true);
    try {
      const updatedUser = mergeUserData(user, tempUserData);
      await pushUserToSupabase(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert(
        'Erfolg',
        'Deine Daten wurden erfolgreich gespeichert.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      Alert.alert(
        'Fehler',
        'Beim Speichern ist ein Fehler aufgetreten. Bitte versuche es erneut.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempUserData(convertUserToUserData(user));
  };

  const handleFieldChange = (field: string, value: string) => {
    if (tempUserData) {
      setTempUserData({ ...tempUserData, [field]: value });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.textContainer}>
        <FortschrittCircle percent={registrationProgress} />

        <AnmeldenAccordion 
          isExpanded={anmeldungsToggle} 
          onToggle={() => setAnmeldungsToggle(!anmeldungsToggle)} 
          accordionTitle="Anmeldedaten speichern" 
          isOnboarding={false}
          isSaving={isSaving}
          onSave={handleSave}
          isEditing={isEditing}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onFieldChange={handleFieldChange}
          tempUserData={tempUserData}
        />

        <View style={styles.ul}>
          <View style={styles.li}>
            <Text style={styles.arrowIcon}>✅</Text>
            <Text style={[styles.liText, { fontSize: finalFontSize }]} adjustsFontSizeToFit={true} numberOfLines={2}>
              Automatische{'\n'}Datenübertragung
            </Text>
          </View>
          <View style={styles.li}>
            <Text style={[styles.arrowIcon]}>⬇️</Text>
            <Text style={[styles.liText, { fontSize: finalFontSize }]} adjustsFontSizeToFit={true} numberOfLines={3}>
              Mit einem{'\n'}Klick zur Minijobzentrale!
            </Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/webView')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={['#FF9F43', '#FF8C00']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.buttonText, { fontSize: finalFontSize }]}>
                Anmelden!
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  textContainer: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? '#eee' : '#f0f0f0',
    elevation: Platform.OS === 'android' ? 4 : 0,
    width: '100%',
    maxWidth: 500,
    marginBottom: 40,
  },
  ul: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 30,
  },
  arrowIcon: {
    marginRight: 12,
    fontSize: 30,
  },
  liText: {
    color: '#333',
    flex: 1,
    lineHeight: 30,
    paddingTop: 2,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 25,
    marginBottom: 20,
    elevation: 5,
  },
  gradientButton: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AnmeldungPage;