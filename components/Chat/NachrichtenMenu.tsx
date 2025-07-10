import React, { useContext } from 'react';
import { Alert, Text } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { chatService } from '@/components/services/StreamChat/chatService';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useSQLiteContext } from 'expo-sqlite';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';

type Props = {
  chatPartnerId: string;
};

const NachrichtenMenu: React.FC<Props> = ({ chatPartnerId }) => {
  const { fontSize } = useContext(FontSizeContext);
  const currentUserId = useAuthStore((s) => s.user?.id ?? '');
  const router = useRouter();
  const { cid } = useActiveChatStore((s) => s);
  const db = useSQLiteContext();

  // Get the channel from StreamChat store
  const channels = useStreamChatStore((s) => s.channels);
  const channel = channels.find((ch: any) => ch.cid === cid);
  
  // Check mute/block status from StreamChat client
  const streamClient = useAuthStore((s) => s.streamChatClient);
  const mutedIds = streamClient?.mutedUsers?.map((m: any) => m.target.id) || [];
  const isMuted = mutedIds.includes(chatPartnerId);
  
  // For now, we'll assume not blocked unless we have explicit block data
  const isBlocked = false;

  const handleToggleMute = async () => {
    try {
      if (isMuted) {
        await chatService.unmuteUser(chatPartnerId);
        Alert.alert('Erfolg', 'Nutzer wurde entstummschaltet.');
      } else {
        await chatService.muteUser(chatPartnerId);
        Alert.alert('Erfolg', 'Nutzer wurde stummgeschaltet.');
      }
    } catch (e) {
      console.error('❌ Fehler beim (Ent-)Muten:', e);
      Alert.alert('Fehler', 'Stummschalten fehlgeschlagen.');
    }
  };

  const handleBlock = () => {
    Alert.alert(
      'Benutzer blockieren?',
      'Du wirst keine Nachrichten mehr von diesem Nutzer erhalten. Der Chat wird gelöscht.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Blockieren',
          style: 'destructive',
          onPress: async () => {
            try {
              await chatService.blockUser(chatPartnerId); // Zielnutzer blockieren
              await chatService.deleteChannel('messaging', chatPartnerId, db); // Chat löschen
              Alert.alert('Erfolg', 'Benutzer wurde blockiert und Chat gelöscht.');
              router.back(); // Zurück zur Übersicht
            } catch (e) {
              console.error('❌ Fehler beim Blockieren:', e);
              Alert.alert('Fehler', 'Die Aktion konnte nicht abgeschlossen werden.');
            }
          },
        },
      ]
    );
  };

  const menuFontSize = Math.min((fontSize / 24) * 22, 28);

  return (
    <Menu>
      <MenuTrigger>
        <MaterialCommunityIcons
          name="dots-horizontal-circle-outline"
          size={24}
          color="black"
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsWrapper: { elevation: 5 },
          optionsContainer: { width: 220 },
          optionWrapper: {
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
          },
          optionText: {
            fontSize: menuFontSize,
            fontWeight: '500',
          },
        }}
      >
        <MenuOption onSelect={handleToggleMute}>
          <Text style={{ fontSize: menuFontSize }}>
            {isMuted ? 'Stummschaltung aufheben' : 'Benutzer stummschalten'}
          </Text>
        </MenuOption>
        {!isBlocked && (
          <MenuOption onSelect={handleBlock}>
            <Text style={{ fontSize: menuFontSize, color: 'red' }}>
              Benutzer blockieren
            </Text>
          </MenuOption>
        )}
      </MenuOptions>
    </Menu>
  );
};

export default React.memo(NachrichtenMenu);