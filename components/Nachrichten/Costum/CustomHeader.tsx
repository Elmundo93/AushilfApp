// components/Nachrichten/CustomChatHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NachrichtenMenu from '../NachrichtenMenu';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/components/stores/AuthStore';
import { styles } from './customHStyles';


type Props = {

  otherUserImage: string;

  otherUserName?: string;
};

const CustomChatHeader: React.FC<Props> = ({
  otherUserImage,
  otherUserName = '',
}) => {
  const router = useRouter();
  const { user } = useAuthStore();
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
          <Image source={{ uri: user?.profileImageUrl }} style={styles.profileImage} />
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



export default CustomChatHeader;