import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Chat } from '@/stores/useChatStore';
import { useChatStore } from '@/stores/useChatStore';
import { format } from 'date-fns';

import DefaultAvatar from '@/assets/images/DefaultAvatar.png';
import GartenIcon from '@/assets/images/GartenIconWithBackground.png';
import HaushaltIcon from '@/assets/images/HaushaltWithBackground.png';
import SozialesIcon from '@/assets/images/SozialesIconWithBackground.png';
import GastroIcon from '@/assets/images/GastroIconWithBackground.png';
import HandwerkIcon from '@/assets/images/HandwerkIconWithBackground.png';
import BildungIcon from '@/assets/images/BildungsIconWithBackground.png';

const categoryIcons: Record<string, any> = {
  garten: GartenIcon,
  haushalt: HaushaltIcon,
  soziales: SozialesIcon,
  gastro: GastroIcon,
  handwerk: HandwerkIcon,
  bildung: BildungIcon,
};

type Props = {
  chat: Chat;
  currentUserId: string;
  onPress: (chat: Chat) => void;
};

export const ChatPreview = ({ chat, currentUserId, onPress }: Props) => {
  const messages = useChatStore((s) => s.messages[chat.id] ?? []);
  const lastMessage = messages[messages.length - 1];
  const unread = messages.some((m) => !m.read && m.sender_id !== currentUserId);

  const partnerName = chat.user1 === currentUserId
    ? `${chat.post_author_vorname} ${chat.post_author_nachname?.charAt(0)}.`
    : `${chat.initiator_vorname} ${chat.initiator_nachname?.charAt(0)}.`;

  const partnerImage = chat.user1 === currentUserId
    ? chat.post_author_profile_image
    : chat.initiator_profile_image;

  const categoryIcon = chat.category ? categoryIcons[chat.category] : null;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(chat)}>
      <Image
        source={partnerImage ? { uri: partnerImage } : DefaultAvatar}
        style={styles.avatar}
      />
      {categoryIcon && (
        <Image source={categoryIcon} style={styles.icon} />
      )}
      <View style={styles.middle}>
        <Text style={styles.name}>{partnerName}</Text>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
          {lastMessage?.content ?? 'Noch keine Nachricht'}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>
          {lastMessage?.created_at
            ? format(new Date(lastMessage.created_at), 'HH:mm')
            : ''}
        </Text>
        {unread && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  middle: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    color: '#555',
    fontSize: 14,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
  unreadDot: {
    marginTop: 4,
    width: 12,
    height: 12,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
});