import React, { useContext, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { router } from 'expo-router';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { chatService } from '@/components/services/StreamChat/chatService';
import { useAuthStore } from '@/components/stores/AuthStore';
import { extractPartnerData } from '@/components/services/StreamChat/lib/extractPartnerData';

const NachrichtenMenu: React.FC<{ iconSize?: number; iconColor?: string }> = ({
  iconSize = 24,
  iconColor = 'black',
}) => {
  const { fontSize } = useContext(FontSizeContext);
  const [visible, setVisible] = useState(false);
  const { setSelectedUser } = useSelectedUserStore();
  const { channels } = useStreamChatStore();
  const { cid } = useActiveChatStore();
  const user = useAuthStore((s) => s.user);
  const [isMuted, setIsMuted] = useState(false);
  const channel = channels.find((ch) => ch.cid === cid);
  console.log('Channel structure:', JSON.stringify(channel, null, 2));
  const partnerData = channel ? extractPartnerData(channel, user?.id ?? '') : null;

  const adjustedFontSize = Math.min((fontSize / 24) * 22, 28);

  console.log('partnerData', partnerData);
  console.log('user', user);

  

  useEffect(() => {
    const checkIfMuted = async () => {
      if (!partnerData) return;
      const client = useAuthStore.getState().streamChatClient;
      const mutedIds = client?.mutedUsers?.map((m) => m.target.id);
      setIsMuted(mutedIds?.includes(partnerData.userId) ?? false);
    };
  
    checkIfMuted();
  }, [partnerData]);

  const handleViewProfile = () => {
    if (!partnerData) return;
    setSelectedUser(partnerData);
    setVisible(false);
    setTimeout(() => {
      router.push('/(modal)/forreignProfile');
    }, 100);
  };

  const handleBlockUser = async () => {
    if (!partnerData) return;
    setVisible(false);
    try {
      await chatService.blockUser(partnerData.userId);
      Alert.alert('Erfolg', `${partnerData.vorname} wurde blockiert.`);
    } catch (e: any) {
      Alert.alert('Fehler beim Blockieren', e.message);
    }
  };
  
  const handleToggleMute = async () => {
    if (!partnerData) return;
    setVisible(false);
    const client = useAuthStore.getState().streamChatClient;

    try {
      if (isMuted) {
        await chatService.unmuteUser(partnerData.userId);
        Alert.alert('Erfolg', `${partnerData.vorname} wurde wieder hörbar.`);
      } else {
        await chatService.muteUser(partnerData.userId);
        Alert.alert('Erfolg', `${partnerData.vorname} wurde stummgeschaltet.`);
      }
    
      const mutedIds = client?.mutedUsers?.map((m) => m.target.id);
      setIsMuted(mutedIds?.includes(partnerData.userId) ?? false);
    } catch (e: any) {
      Alert.alert('Fehler', e.message);
    }
  };

  const handleDeleteChat = async () => {
    if (!cid) return;
    setVisible(false);
    try {
      const [type, id] = cid.split(':');
      await chatService.deleteChannel(type, id);
      Alert.alert('Erfolg', 'Chat wurde gelöscht.');
      // optional: Zustand aktualisieren oder Navigation zurück
    } catch (e: any) {
      Alert.alert('Fehler beim Löschen', e.message);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <MaterialCommunityIcons
          name="dots-horizontal-circle-outline"
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menuBox}>
            <MenuItem onPress={handleViewProfile} text="Profil betrachten" fontSize={adjustedFontSize} />
            <MenuItem onPress={handleDeleteChat} text="Chat löschen" fontSize={adjustedFontSize} />
            <MenuItem
  onPress={handleToggleMute}
  text={isMuted ? 'Stummschaltung aufheben' : 'Benutzer stummschalten'}
  fontSize={adjustedFontSize}
/>
           
           
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const MenuItem = ({
  onPress,
  text,
  fontSize,
  danger = false,
}: {
  onPress: () => void;
  text: string;
  fontSize: number;
  danger?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.menuItem, danger && styles.blockDanger]}
    onPress={onPress}
  >
    <Text style={[styles.menuText, danger && styles.blockDangerText, { fontSize }]}>
      {text}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 75,
    paddingRight: 10,
  },
  menuBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 200,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  menuText: {
    fontWeight: '500',
    color: '#222',
  },
  blockDanger: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  blockDangerText: {
    backgroundColor: 'red',
    color: 'white',
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
});

export default React.memo(NachrichtenMenu);