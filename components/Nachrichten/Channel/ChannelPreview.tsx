import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import { format, isValid } from 'date-fns';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { ChannelPreviewProps } from '@/components/types/stream';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { useRouter } from 'expo-router';
import DefaultAvatar from '@/assets/images/DefaultAvatar.png';
import GartenIconWithBackground from '@/assets/images/GartenIconWithBackground.png';
import HaushaltWithBackground from '@/assets/images/HaushaltWithBackground.png';
import SozialesIconWithBackground from '@/assets/images/SozialesIconWithBackground.png';
import GastroIconWithBackground from '@/assets/images/GastroIconWithBackground.png';
import HandwerkIconWithBackground from '@/assets/images/HandwerkIconWithBackground.png';
import BildungsIconWithBackground from '@/assets/images/BildungsIconWithBackground.png';
import { UserProfile } from '@/components/types/auth';
import { styles } from './styles';
const categoryIcons = {
  gastro: GastroIconWithBackground,
  garten: GartenIconWithBackground,
  haushalt: HaushaltWithBackground,
  soziales: SozialesIconWithBackground,
  handwerk: HandwerkIconWithBackground,
  bildung: BildungsIconWithBackground,
};

const ChannelPreview: React.FC<ChannelPreviewProps> = ({ channel, onSelect }) => {
  const { fontSize } = useContext(FontSizeContext);
  const { setSelectedUser } = useSelectedUserStore();
  const router = useRouter();

  const minIconSize = 30;
  const maxIconSize = 50;
  const adjustedFontSize = fontSize * 1.2;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  const partnerData: UserProfile = {
    userId: channel.partner_user_id as string || '',
    vorname: channel.custom_user_vorname || '',
    nachname: channel.custom_user_nachname || '',
    profileImageUrl: channel.custom_user_profileImage || '',
    bio: channel.custom_user_userBio || '',
    kategorien: channel.custom_post_category ? [channel.custom_post_category] : [],
  };

  const rawDate = new Date(channel.last_message_at ?? '');
  const lastMessageDate = isValid(rawDate) ? format(rawDate, 'HH:mm') : '';
  const lastMessageText = channel.last_message_text || 'Keine Nachrichten';
  const unreadCount = channel.unread_count || 0;

  const category = channel.custom_post_category as keyof typeof categoryIcons;
  const categoryIcon = categoryIcons[category] ?? null;

  const handleAvatarPress = () => {
    setSelectedUser(partnerData);
    router.push('/(modal)/forreignProfile');
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity onPress={handleAvatarPress}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              partnerData.profileImageUrl
                ? { uri: partnerData.profileImageUrl as string }
                : DefaultAvatar as any
            }
            style={[styles.avatar, { width: iconSize + 12, height: iconSize + 12 }]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contentContainer} onPress={() => onSelect(channel)}>
        <View style={styles.leftContainer}>
          {categoryIcon && (
            <Image source={categoryIcon as any} style={[styles.icon, { width: iconSize, height: iconSize }]} />
          )}
        </View>
        <View style={styles.middleContainer}>
          <Text style={[styles.channelName, { fontSize: adjustedFontSize }]}>
            {partnerData.vorname} {partnerData.nachname?.[0] || ''}.
          </Text>
          <Text style={[styles.lastMessage, { fontSize: adjustedFontSize }]} numberOfLines={1}>
            {lastMessageText}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={[styles.date, { fontSize: adjustedFontSize - 6 }]}>{lastMessageDate}</Text>
          {unreadCount > 0 && (
            <View style={[styles.unreadBadge, { width: iconSize - 8, height: iconSize - 8 }]}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChannelPreview;

// Styles bleiben gleich wie bei dir

