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
import { useSQLiteContext } from 'expo-sqlite';
import { useMuteStore } from '@/components/stores/useMuteStore';

const NachrichtenMenu: React.FC<{ iconSize?: number; iconColor?: string }> = ({
  iconSize = 24,
  iconColor = 'black',
}) => {
  const { fontSize } = useContext(FontSizeContext);
  const [visible, setVisible] = useState(false);
  const [isMuting, setIsMuting] = useState(false);
  const { setSelectedUser } = useSelectedUserStore();
  const { channels } = useStreamChatStore();
  const { cid } = useActiveChatStore();
  const user = useAuthStore((s) => s.user);
  const channel = channels.find((ch) => ch.cid === cid);
  const partnerData = channel ? extractPartnerData(channel, user?.id ?? '') : null;
  const db = useSQLiteContext();

  // Enhanced mute state management
  const { isUserMuted, isChannelMuted, toggleUserMute, toggleChannelMute, setLoading } = useMuteStore();
  const isUserMutedState = partnerData ? isUserMuted(partnerData.userId) : false;
  const isChannelMutedState = cid ? isChannelMuted(cid) : false;

  const adjustedFontSize = Math.min((fontSize / 24) * 22, 28);

  const handleViewProfile = () => {
    if (!partnerData) return;
    console.log('partnerData', partnerData);
    setSelectedUser(partnerData);
    setVisible(false);
    router.back();
    
    setTimeout(() => {
      router.push('/(modal)/forreignProfile');
    }, 100);
  };

  const handleToggleUserMute = async () => {
    if (!partnerData) return;
    setVisible(false);
    setLoading(true);

    try {
      if (isUserMutedState) {
        await chatService.unmuteUser(partnerData.userId);
        toggleUserMute(partnerData.userId);
        Alert.alert('Erfolg', `${partnerData.vorname} wurde wieder hörbar.`);
      } else {
        await chatService.muteUser(partnerData.userId);
        toggleUserMute(partnerData.userId, {
          vorname: partnerData.vorname,
          nachname: partnerData.nachname,
          profileImageUrl: partnerData.profileImageUrl,
        });
        Alert.alert('Erfolg', `${partnerData.vorname} wurde stummgeschaltet.`);
      }
    } catch (e: any) {
      Alert.alert('Fehler', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChannelMute = async () => {
    if (!cid) return;
    
    // Show confirmation dialog
    Alert.alert(
      isChannelMutedState ? 'Channel wieder hörbar machen?' : 'Channel stummschalten?',
      isChannelMutedState 
        ? 'Möchten Sie diesen Channel wieder hörbar machen?'
        : 'Möchten Sie diesen Channel stummschalten? Sie erhalten keine Benachrichtigungen mehr.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: isChannelMutedState ? 'Hörbar machen' : 'Stummschalten',
          style: 'default',
          onPress: async () => {
            setVisible(false);
            setIsMuting(true);
            setLoading(true);
            
            try {
              console.log('🔇 Starting channel mute toggle for cid:', cid);
              
              if (isChannelMutedState) {
                await chatService.unmuteChannel(cid);
                toggleChannelMute(cid);
                Alert.alert('Erfolg', 'Channel wurde wieder hörbar gemacht.');
              } else {
                await chatService.muteChannel(cid);
                toggleChannelMute(cid);
                Alert.alert('Erfolg', 'Channel wurde stummgeschaltet.');
              }
              
            } catch (e: any) {
              console.error('❌ Channel mute toggle failed:', e);
              Alert.alert(
                'Fehler beim Stummschalten', 
                e.message || 'Der Channel konnte nicht stummgeschaltet werden. Bitte versuchen Sie es erneut.'
              );
            } finally {
              setIsMuting(false);
              setLoading(false);
            }
          },
        },
      ]
    );
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
           
            <MenuItem
  onPress={handleToggleUserMute}
  text={isUserMutedState ? 'Stummschaltung aufheben' : 'Benutzer stummschalten'}
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