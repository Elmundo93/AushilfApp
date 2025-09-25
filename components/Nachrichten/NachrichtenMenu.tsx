import React, { useContext, useState } from 'react';
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
import { useAuthStore } from '@/components/stores/AuthStore';
import { useMuteStore } from '@/components/stores/useMuteStore';
import { extractPartnerDataFromChannel } from './utils/extractPartnerData';
import { useSQLiteContext } from 'expo-sqlite';
import { useChannels } from '@/components/services/Chat/hooks/useChannels';
import { supabase } from '@/components/config/supabase';
// optional: falls du users_local in SQLite hast
// import { getDB } from '@/components/Crud/SQLite/bridge';

const NachrichtenMenu: React.FC<{ 
  iconSize?: number; 
  iconColor?: string;
  channelId?: string; // Pass channelId as prop instead of using store
}> = ({
  iconSize = 24,
  iconColor = 'black',
  channelId,
}) => {
  const { fontSize } = useContext(FontSizeContext);
  const [visible, setVisible] = useState(false);
  const [isMuting, setIsMuting] = useState(false);
  const { setSelectedUser } = useSelectedUserStore();
  const user = useAuthStore((s) => s.user);
  const db = useSQLiteContext();
  
  // Use SQLite hook to get channels
  const channels = useChannels(db);
  
  // Find channel using the new structure
  const channel = channels.find((ch) => ch.id === channelId);
  
  // Extract partner data from channel
  const partnerData = channel && user?.id ? extractPartnerDataFromChannel(channel, user.id) : null;

  // Enhanced mute state management
  const { isUserMuted, isChannelMuted, toggleUserMute, toggleChannelMute, setLoading } = useMuteStore();

  const adjustedFontSize = Math.min((fontSize / 24) * 22, 28);

  const handleViewProfile = async () => {
    if (!partnerData) return;
    try {
      setVisible(false);

      // 1) Basis aus Channel
      let full = { ...partnerData };

      // 2) Falls bio/kategorien fehlen → on-demand laden
      if (!full.bio || !full.kategorien || !full.vorname || !full.nachname || !full.profileImageUrl) {
        // a) optional aus lokaler SQLite (wenn vorhanden)
        // const db = getDB();
        // const local = await db.getFirstAsync<any>('select id, vorname, nachname, bio, kategorien, profileImageUrl from users_local where id = ?', [partnerData.userId]);
        // if (local) { ...merge... }

        // b) Supabase-Fallback
        const { data, error } = await supabase
          .from('Users')
          .select('id, vorname, nachname, bio, kategorien, profileImageUrl')
          .eq('id', partnerData.userId)
          .maybeSingle();
        if (!error && data) {
          full = {
            userId: partnerData.userId,
            vorname: partnerData.vorname ?? data.vorname ?? undefined,
            nachname: partnerData.nachname ?? data.nachname ?? undefined,
            profileImageUrl: (partnerData.profileImageUrl ?? data.profileImageUrl ?? '') || undefined,
            bio: partnerData.bio ?? data.bio ?? undefined,
            kategorien: partnerData.kategorien ?? (Array.isArray(data.kategorien) ? data.kategorien : undefined),
          };
        }
      }

      // 3) In Store schreiben
      setSelectedUser(full as any);

      // 4) Navigation (erst zurück, dann Modal)
      router.back();
      setTimeout(() => { router.push('/(modal)/forreignProfile'); }, 80);
    } catch (e) {
      console.warn('viewProfile failed', e);
    }
  };

  const handleToggleUserMute = async () => {
    if (!partnerData) return;
    setVisible(false);
    setLoading(true);

    try {
      const isUserMutedState = isUserMuted(partnerData.userId);
      
      if (isUserMutedState) {
        // TODO: Implement unmuteUser function for new chat system
        // await chatService.unmuteUser(partnerData.userId);
        toggleUserMute(partnerData.userId);
        Alert.alert('Erfolg', `${partnerData.vorname || 'Benutzer'} wurde wieder hörbar.`);
      } else {
        // TODO: Implement muteUser function for new chat system
        // await chatService.muteUser(partnerData.userId);
        toggleUserMute(partnerData.userId, {
          vorname: partnerData.vorname,
          nachname: partnerData.nachname,
          profileImageUrl: partnerData.profileImageUrl,
        });
        Alert.alert('Erfolg', `${partnerData.vorname || 'Benutzer'} wurde stummgeschaltet.`);
      }
    } catch (e: any) {
      Alert.alert('Fehler', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChannelMute = async () => {
    if (!channelId) return;
    
    const isChannelMutedState = isChannelMuted(channelId);
    
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
              console.log('🔇 Starting channel mute toggle for channelId:', channelId);
              
              if (isChannelMutedState) {
                // TODO: Implement unmuteChannel function for new chat system
                // await chatService.unmuteChannel(channelId);
                toggleChannelMute(channelId);
                Alert.alert('Erfolg', 'Channel wurde wieder hörbar gemacht.');
              } else {
                // TODO: Implement muteChannel function for new chat system
                // await chatService.muteChannel(channelId);
                toggleChannelMute(channelId);
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
              text={partnerData && isUserMuted(partnerData.userId) ? 'Stummschaltung aufheben' : 'Benutzer stummschalten'}
              fontSize={adjustedFontSize}
            />
           
            <MenuItem
              onPress={handleToggleChannelMute}
              text={channelId && isChannelMuted(channelId) ? 'Channel wieder hörbar machen' : 'Channel stummschalten'}
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