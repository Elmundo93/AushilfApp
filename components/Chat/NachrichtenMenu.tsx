// 📁 components/Chat/NachrichtenMenu.tsx
import React, { useContext } from 'react';
import { Alert, Text } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useChatStore } from '@/stores/useChatStore';
import { blockUserInChat } from '@/services/blockUserInChat';
import { unblockUserInChat } from '@/services/unblockUserInChat';
import { FontSizeContext } from '@/components/provider/FontSizeContext';

type Props = {
  chatId: string;
};

const NachrichtenMenu: React.FC<Props> = ({ chatId }) => {
  const { fontSize } = useContext(FontSizeContext);
  const currentUserId = useAuthStore((s) => s.user?.id ?? '');
  const router = useRouter();
  const chat = useChatStore((s) => s.chats[chatId]);

  const handleToggleBlock = () => {
    if (!chat) return;

    const isBlocked = chat.blocked_by === currentUserId;

    Alert.alert(
      isBlocked ? 'Blockierung aufheben?' : 'Benutzer blockieren?',
      isBlocked
        ? 'Möchtest du die Blockierung dieses Nutzers wirklich aufheben?'
        : 'Du wirst keine Nachrichten mehr von diesem Nutzer erhalten. Fortfahren?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: isBlocked ? 'Aufheben' : 'Blockieren',
          style: 'destructive',
          onPress: async () => {
            try {
              if (isBlocked) {
                await unblockUserInChat(chatId);
                Alert.alert('Erfolg', 'Blockierung wurde aufgehoben.');
              } else {
                await blockUserInChat(chatId, currentUserId);
                Alert.alert('Erfolg', 'Benutzer wurde blockiert.');
                router.back();
              }
            } catch (e) {
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
          optionsContainer: { width: 200 },
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
        <MenuOption onSelect={handleToggleBlock}>
          <Text style={{ fontSize: menuFontSize }}>
            {chat?.blocked_by === currentUserId
              ? 'Blockierung aufheben'
              : 'Benutzer blockieren'}
          </Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export default React.memo(NachrichtenMenu);