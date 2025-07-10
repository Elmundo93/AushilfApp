import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useMuteStore } from '@/components/stores/useMuteStore';
import { chatService } from '@/components/services/StreamChat/chatService';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';

interface MutedUsersListProps {
  onUserUnmute?: (userId: string) => void;
}

const MutedUsersList: React.FC<MutedUsersListProps> = ({ onUserUnmute }) => {
  const { fontSize } = useContext(FontSizeContext);
  const { mutedUsers, toggleUserMute, setLoading } = useMuteStore();

  const adjustedFontSize = Math.min((fontSize / 24) * 16, 20);
  const subFontSize = Math.min((fontSize / 24) * 14, 18);

  const handleUnmuteUser = async (user: any) => {
    setLoading(true);
    
    try {
      await chatService.unmuteUser(user.userId);
      toggleUserMute(user.userId);
      
      if (onUserUnmute) {
        onUserUnmute(user.userId);
      }
      
      Alert.alert('Erfolg', `${user.vorname} wurde wieder hörbar gemacht.`);
    } catch (e: any) {
      Alert.alert('Fehler', e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMutedUser = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUnmuteUser(item)}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={
            item.profileImageUrl
              ? { uri: item.profileImageUrl }
              : require('@/assets/images/DefaultAvatar.png')
          }
          style={styles.avatar}
        />
        <View style={styles.muteIndicator}>
          <MaterialCommunityIcons name="volume-off" size={12} color="white" />
        </View>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { fontSize: adjustedFontSize }]}>
          {item.vorname} {item.nachname}
        </Text>
        <Text style={[styles.mutedDate, { fontSize: subFontSize }]}>
          Stummgeschaltet am {new Date(item.mutedAt).toLocaleDateString('de-DE')}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.unmuteButton}
        onPress={() => handleUnmuteUser(item)}
      >
        <MaterialCommunityIcons name="volume-high" size={20} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (mutedUsers.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="volume-off" size={20} color="#666" />
        <Text style={styles.headerText}>
          Stummgeschaltete Benutzer ({mutedUsers.length})
        </Text>
      </View>
      
      <FlatList
        data={mutedUsers}
        keyExtractor={(item) => item.userId}
        renderItem={renderMutedUser}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  muteIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#666',
    borderRadius: 6,
    padding: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  mutedDate: {
    color: '#666',
    fontStyle: 'italic',
  },
  unmuteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
  },
});

export default MutedUsersList; 