// components/Nachrichten/CustomChatHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NachrichtenMenu from '../NachrichtenMenu';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  currentUserImage: string;
  otherUserImage: string;
  currentUserName?: string;
  otherUserName?: string;
};

const CustomChatHeader: React.FC<Props> = ({
  currentUserImage,
  otherUserImage,
  currentUserName = '',
  otherUserName = '',
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['orange', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back-circle-outline" size={36} color="#333" />
      </TouchableOpacity>

      <View style={styles.profileInfo}>
        <View style={styles.imagesRow}>
          <Image source={{ uri: currentUserImage }} style={styles.profileImage} />
          <Image source={{ uri: otherUserImage }} style={[styles.profileImage, { marginLeft: -10 }]} />
        </View>
        <Text style={styles.namesText} numberOfLines={1}>
          {otherUserName}
        </Text>
      </View>

      <View style={styles.menuContainer}>
        <NachrichtenMenu iconSize={40} iconColor="#333" />
        <Text style={styles.menuHint}>⋯</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  backButton: {
    padding: 6,
  },
  profileInfo: {
    flex: 1,
    alignItems: 'center',
  },
  imagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  namesText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },
  menuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  menuHint: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});

export default CustomChatHeader;