// components/Nachrichten/Channel/ChannelPreview.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useMuteStore } from '@/components/stores/useMuteStore';
import type { ChannelRow } from '@/components/types/chat';
import { extractPartnerDataFromChannel, getChannelDisplayName, getChannelDisplayImage } from '../utils/extractPartnerData';
import { formatRelativeDate } from '@/components/utils/formateRelativeDate';
// Category icons (optional)
import GastroIconWithBackground from '@/assets/images/GastroIconWithBackground.png';
import GartenIconWithBackground from '@/assets/images/GartenIconWithBackground.png';
import HaushaltWithBackground from '@/assets/images/HaushaltWithBackground.png';
import SozialesIconWithBackground from '@/assets/images/SozialesIconWithBackground.png';
import HandwerkIconWithBackground from '@/assets/images/HandwerkIconWithBackground.png';
import BildungsIconWithBackground from '@/assets/images/BildungsIconWithBackground.png';

const categoryIcons = {
  gastro: GastroIconWithBackground,
  garten: GartenIconWithBackground,
  haushalt: HaushaltWithBackground,
  soziales: SozialesIconWithBackground,
  handwerk: HandwerkIconWithBackground,
  bildung: BildungsIconWithBackground,
} as const;

const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'] as const;

type Props = {
  channel: ChannelRow;
  onSelect: (channel: ChannelRow) => void;
  currentUserId: string;
  unreadCount: number;
};

const ChannelPreview: React.FC<Props> = ({ channel, onSelect, currentUserId, unreadCount = 0 }) => {  const { fontSize } = useContext(FontSizeContext);
  const { isChannelMuted, isUserMuted } = useMuteStore();

  // Extract partner data from channel
  const partnerData = extractPartnerDataFromChannel(channel, currentUserId);
  
  const isMutedChannel = isChannelMuted(channel.id);
  const isMutedUser = partnerData?.userId ? isUserMuted(partnerData.userId) : false;
  const isMuted = isMutedChannel || isMutedUser;

  const category =
    channel.custom_category && (validCategories as readonly string[]).includes(channel.custom_category)
      ? channel.custom_category
      : undefined;
  const categoryIcon = category ? categoryIcons[category as keyof typeof categoryIcons] : null;

  const adjustedFontSize = Math.min((fontSize / 24) * 16, 20);
  const subFontSize = Math.min((fontSize / 24) * 14, 18);

  const displayName = getChannelDisplayName(channel, currentUserId);
  const displayImage = getChannelDisplayImage(channel, currentUserId);

    const lastDate = formatRelativeDate(channel.last_message_at ?? undefined);
    const hasUnread = unreadCount > 0;

  return (
    <TouchableOpacity
      style={[styles.container, isMuted && styles.mutedContainer]}
      onPress={() => onSelect(channel)}
    >
      <View style={styles.avatarContainer}>
        {displayImage
          ? <Image source={{ uri: displayImage }} style={styles.avatar} />
          : <Image source={require('@/assets/images/DefaultAvatar.png')} style={styles.avatar} />
        }
         {hasUnread && (
         <View style={styles.unreadBadge}>
           <Text style={styles.unreadText}>       
                  {unreadCount > 99 ? '99+' : String(unreadCount)}            </Text>
         </View>
       )}
        {isMuted && (
          <View style={styles.muteIndicator}>
            <MaterialCommunityIcons name="volume-off" size={12} color="white" />
          </View>
        )}
        {categoryIcon && <Image source={categoryIcon as any} style={styles.categoryIcon} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
        <Text style={[
             styles.name,
             { fontSize: adjustedFontSize },
             hasUnread && styles.bold,
             isMuted && styles.mutedText
           ]}>            {displayName}
          </Text>
          {lastDate && (
            <Text style={[
                styles.time,
                { fontSize: subFontSize },
               hasUnread && styles.timeBold,
                isMuted && styles.mutedText
              ]}>              {lastDate}
            </Text>
          )}
        </View>

        <Text style={[
           styles.lastMessage,
           { fontSize: subFontSize },
           hasUnread && styles.bold,
           isMuted && styles.mutedText
         ]}>          {channel.last_message_text ?? 'Keine Nachrichten'}
        </Text>

        {isMuted && (
          <Text style={[styles.mutedLabel, { fontSize: subFontSize }]}>
            {isMutedChannel ? 'Channel stummgeschaltet' : 'Benutzer stummgeschaltet'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: 'white' },
  mutedContainer: { backgroundColor: '#f8f8f8', opacity: 0.7 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  muteIndicator: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#666', borderRadius: 8, padding: 2 },
  categoryIcon: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: 10 },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontWeight: '600', color: '#333' },
  time: { color: '#666' },
  lastMessage: { color: '#666', marginBottom: 4 },
  mutedText: { color: '#999' },
  mutedLabel: { color: '#ff6b6b', fontStyle: 'italic' },
  unreadBadge: {
      position: 'absolute',
      top: -4,
      left: -4,
      minWidth: 18,
      height: 18,
       paddingHorizontal: 4,
      borderRadius: 9,
      backgroundColor: '#ff6b00', // AushilfApp-Orange? ggf. aus Theme holen
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'white',
    },
    unreadText: { color: 'white', fontSize: 11, fontWeight: '700' },
    bold: { fontWeight: '700', color: '#111' },
    timeBold: { color: '#111', fontWeight: '700' },

});

export default ChannelPreview;