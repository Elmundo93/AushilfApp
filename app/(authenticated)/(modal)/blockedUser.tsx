// File: app/(authenticated)/(aushilfapp)/nachrichten/blockedUsers.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { chatService } from '@/components/services/StreamChat/chatService';
import { router } from 'expo-router';

interface BlockedUser {
  userId: string;
  name: string;
}

const BlockedUsersScreen = () => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

  const fetchBlockedUsers = async () => {
    try {
      const blocks = await chatService.getBlockedUsers();
      setBlockedUsers(blocks);
    } catch (e) {
      console.error('❌ Fehler beim Laden der Blockierungen:', e);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const handleUnblock = async (userId: string) => {
    try {
      await chatService.unblockUser(userId);
      setBlockedUsers((prev) => prev.filter((u) => u.userId !== userId));
      Alert.alert('Erfolg', 'Nutzer wurde entblockt.');
    } catch (e) {
      console.error('❌ Fehler beim Entblocken:', e);
      Alert.alert('Fehler', 'Entblocken fehlgeschlagen.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blockierte Kontakte</Text>

      <FlatList
        data={blockedUsers}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Text style={styles.nameText}>{item.name || item.userId}</Text>
            <TouchableOpacity
              style={styles.unblockButton}
              onPress={() => handleUnblock(item.userId)}
            >
              <Text style={styles.unblockText}>Entblocken</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Keine blockierten Kontakte.</Text>
        }
      />

      <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
        <Text style={{ fontWeight: 'bold' }}>Schließen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BlockedUsersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  nameText: { fontSize: 18 },
  unblockButton: {
    backgroundColor: 'orange',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  unblockText: { color: 'white', fontWeight: 'bold' },
  closeBtn: { marginTop: 20, alignSelf: 'center' },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#777',
  },
});