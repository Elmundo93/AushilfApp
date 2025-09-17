// components/Nachrichten/Channel/ChannelPreview.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useMuteStore } from '@/components/stores/useMuteStore';
import type { ChannelRow } from '@/components/types/chat';

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

type ChannelPartner = { userId: string; name: string; avatarUrl?: string | null };

type Props = {
  channel: ChannelRow;                        // ← neu: SQLite-Shape
  onSelect: (channel: ChannelRow) => void;    // ← neu: gibt ChannelRow zurück
  partner?: ChannelPartner;                   // ← optional: Name/Avatar (z.B. via useChannelPartner)
};

const ChannelPreview: React.FC<Props> = ({ channel, onSelect, partner }) => {
  const { fontSize } = useContext(FontSizeContext);
  const { isChannelMuted, isUserMuted } = useMuteStore();

  const isMutedChannel = isChannelMuted(channel.id);
  const isMutedUser = partner?.userId ? isUserMuted(partner.userId) : false;
  const isMuted = isMutedChannel || isMutedUser;

  const category =
    channel.custom_category && (validCategories as readonly string[]).includes(channel.custom_category)
      ? channel.custom_category
      : undefined;
  const categoryIcon = category ? categoryIcons[category as keyof typeof categoryIcons] : null;

  const adjustedFontSize = Math.min((fontSize / 24) * 16, 20);
  const subFontSize = Math.min((fontSize / 24) * 14, 18);

  const displayName = partner?.name ?? 'Chat';
  const displayImage = partner?.avatarUrl ?? null;

  const lastDate =
    channel.last_message_at != null
      ? new Date(channel.last_message_at).toLocaleDateString('de-DE')
      : undefined;

  return (
    <TouchableOpacity
      style={[styles.container, isMuted && styles.mutedContainer]}
      onPress={() => onSelect(channel)}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={displayImage ? { uri: displayImage } : require('@/assets/images/DefaultAvatar.png')}
          style={styles.avatar}
        />
        {isMuted && (
          <View style={styles.muteIndicator}>
            <MaterialCommunityIcons name="volume-off" size={12} color="white" />
          </View>
        )}
        {categoryIcon && <Image source={categoryIcon as any} style={styles.categoryIcon} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { fontSize: adjustedFontSize }, isMuted && styles.mutedText]}>
            {displayName}
          </Text>
          {lastDate && (
            <Text style={[styles.time, { fontSize: subFontSize }, isMuted && styles.mutedText]}>
              {lastDate}
            </Text>
          )}
        </View>

        <Text style={[styles.lastMessage, { fontSize: subFontSize }, isMuted && styles.mutedText]}>
          {channel.last_message_text ?? 'Keine Nachrichten'}
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
});

export default ChannelPreview;