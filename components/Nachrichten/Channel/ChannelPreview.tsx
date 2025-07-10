import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { StoredChannel } from '@/components/types/stream';
import { useMuteStore } from '@/components/stores/useMuteStore';
import { useAuthStore } from '@/components/stores/AuthStore';
import { extractPartnerData } from '@/components/services/StreamChat/lib/extractPartnerData';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Category icons
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
};

interface ChannelPreviewProps {
  channel: StoredChannel;
  onSelect: (channel: StoredChannel) => void;
}

const ChannelPreview: React.FC<ChannelPreviewProps> = ({ channel, onSelect }) => {
  const { fontSize } = useContext(FontSizeContext);
  const { isChannelMuted, isUserMuted } = useMuteStore();
  const user = useAuthStore((s) => s.user);
  
  // Extract partner data to get the correct name to display
  const partnerData = extractPartnerData(channel, user?.id ?? '');
  
  // Check if channel or user is muted
  const isChannelMutedState = isChannelMuted(channel.cid);
  const isUserMutedState = partnerData?.userId ? isUserMuted(partnerData.userId) : false;
  const isMuted = isChannelMutedState || isUserMutedState;

  // Get category and icon
  const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
  const isValidCategory = (category: string) => validCategories.includes(category);
  
  const category = (channel.custom_post_category_choosen && isValidCategory(channel.custom_post_category_choosen)) 
    ? channel.custom_post_category_choosen 
    : channel.custom_post_category;
  const categoryIcon = category ? categoryIcons[category as keyof typeof categoryIcons] : null;

  const adjustedFontSize = Math.min((fontSize / 24) * 16, 20);
  const subFontSize = Math.min((fontSize / 24) * 14, 18);

  const containerStyle = [
    styles.container,
    isMuted && styles.mutedContainer
  ].filter(Boolean) as any;

  // Use partner data for display name and image
  const displayName = `${partnerData.vorname} ${partnerData.nachname}`.trim() || 'Unbekannter Benutzer';
  const displayImage = partnerData.profileImageUrl || channel.custom_post_profileImage;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={() => onSelect(channel)}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={
            displayImage
              ? { uri: displayImage }
              : require('@/assets/images/DefaultAvatar.png')
          }
          style={styles.avatar}
        />
        {isMuted && (
          <View style={styles.muteIndicator}>
            <MaterialCommunityIcons name="volume-off" size={12} color="white" />
          </View>
        )}
        {categoryIcon && (
          <Image source={categoryIcon as any} style={styles.categoryIcon} />
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { fontSize: adjustedFontSize }, isMuted && styles.mutedText]}>
            {displayName}
          </Text>
          {channel.last_message_at && (
            <Text style={[styles.time, { fontSize: subFontSize }, isMuted && styles.mutedText]}>
              {new Date(channel.last_message_at).toLocaleDateString('de-DE')}
            </Text>
          )}
        </View>
        
        <Text style={[styles.lastMessage, { fontSize: subFontSize }, isMuted && styles.mutedText]}>
          {channel.last_message_text || 'Keine Nachrichten'}
        </Text>
        
        {isMuted && (
          <Text style={[styles.mutedLabel, { fontSize: subFontSize }]}>
            {isChannelMutedState ? 'Channel stummgeschaltet' : 'Benutzer stummgeschaltet'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  mutedContainer: {
    backgroundColor: '#f8f8f8',
    opacity: 0.7,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  muteIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#666',
    borderRadius: 8,
    padding: 2,
  },
  categoryIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontWeight: '600',
    color: '#333',
  },
  time: {
    color: '#666',
  },
  lastMessage: {
    color: '#666',
    marginBottom: 4,
  },
  mutedText: {
    color: '#999',
  },
  mutedLabel: {
    color: '#ff6b6b',
    fontStyle: 'italic',
  },
});

export default ChannelPreview;

