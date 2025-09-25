import React, { useContext, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { router } from 'expo-router';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { useAuthStore } from '@/components/stores/AuthStore';
import { extractPartnerDataFromChannel } from './utils/extractPartnerData';
import { useSQLiteContext } from 'expo-sqlite';
import { useChannels } from '@/components/services/Chat/hooks/useChannels';


const IconMenu: React.FC<{ 
  iconSize?: number; 
  iconColor?: string; 
  categoryIcon?: any;
  channelId?: string; // Pass channelId as prop
}> = ({
  iconSize = 24,
  iconColor = 'black',
  categoryIcon,
  channelId,
}) => {
  const { fontSize } = useContext(FontSizeContext);
  const [visible, setVisible] = useState(false);
  const { setSelectedUser } = useSelectedUserStore();
  const user = useAuthStore((s) => s.user);
  const [isMuted, setIsMuted] = useState(false);
  
  // Use SQLite context and hooks
  const db = useSQLiteContext();
  const channels = useChannels(db);
  const channel = channels.find((ch) => ch.id === channelId);
  const partnerData = channel && user?.id ? extractPartnerDataFromChannel(channel, user.id) : null;

  const adjustedFontSize = Math.min((fontSize / 24) * 22, 28);

  // Note: Mute state is now handled by useMuteStore, no need for useEffect

  const handleViewProfile = () => {
    if (!partnerData) return;
    setSelectedUser(partnerData as any);
    setVisible(false);
    setTimeout(() => {
      router.push('/(modal)/forreignProfile');
    }, 100);
  };

  // TODO: Implement block user functionality for new chat system
  const handleBlockUser = async () => {
    if (!channel || !partnerData) return;
    
    try {
      // TODO: Implement block user function for new chat system
      // await chatService.blockUser(partnerData.userId);
      console.log('✅ User blocked successfully');
    } catch (error) {
      console.error('❌ Error blocking user:', error);
    }
  };

  

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        {categoryIcon && (
            <Image source={categoryIcon as any} style={styles.icon} />
          )}
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

  icon: {
    width: 24,
    height: 24,
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

export default React.memo(IconMenu);