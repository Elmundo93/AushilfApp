import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import ProfileAvatar from '../../components/ProfileImage/ProfileAvatar';
import { useProfileImagePicker } from '../../components/Crud/Profile/ProfileImagPicker';
import { User } from '../../components/types/auth';

const EinstellungenPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { pickImage, profileImageUrl, isUploading } = useProfileImagePicker();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (userString) {
          setUser(JSON.parse(userString) as User);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (profileImageUrl && user) {
      setUser({ ...user, profileImageUrl });
    }
  }, [profileImageUrl]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      router.push('/login');
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
    }
  };

  if (!user) {
    return <View style={styles.container}><Text>Laden...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} disabled={isUploading}>
        {isUploading ? (
          <View style={styles.avatarContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <ProfileAvatar imageUri={user.profileImageUrl} />
        )}
      </TouchableOpacity>
      {/* ... Rest des JSX bleibt unverändert ... */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
   
    elevation: 3,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default EinstellungenPage;