import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';

interface Props {
  user: any;
  danksagungCount: number;
  bioText: string;
  setBioText: (text: string) => void;
  bioEditMode: boolean;
  setBioEditMode: (active: boolean) => void;
}

const UserProfileHeader: React.FC<Props> = ({
  user,
  danksagungCount,
  bioText,
  setBioText,
  bioEditMode,
  setBioEditMode,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileTopRow}>
        <Image
          source={{ uri: user?.profileImageUrl || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <View style={styles.countCard}>
          <Text style={styles.countNumber}>{danksagungCount}</Text>
          <Text style={styles.countLabel}>Danksagungen</Text>
        </View>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>
          {user?.vorname} {user?.nachname}{' '}
          {user?.bio && <Octicons name="verified" size={20} color="dodgerblue" />}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        <View style={styles.bioWrapper}>
          {bioEditMode ? (
            <TextInput
              style={styles.bioInput}
              value={bioText}
              onChangeText={setBioText}
              onBlur={() => setBioEditMode(false)}
              multiline
              placeholder="Erzähl etwas über dich..."
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setBioEditMode(true)}>
              <Text style={styles.bioText}>
                {bioText?.trim() ? bioText : 'Tippe, um deine Bio hinzuzufügen...'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default UserProfileHeader;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  profileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ccc',
  },
  countCard: {
    marginLeft: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  countNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  countLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  profileInfo: {
    marginTop: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
  bioWrapper: {
    marginTop: 10,
  },
  bioText: {
    fontSize: 14,
    color: '#444',
  },
  bioInput: {
    fontSize: 14,
    color: '#333',
    padding: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 40,
  },
});