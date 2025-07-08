import React, { useContext, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,

} from 'react-native';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { router } from 'expo-router';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { useAuthStore } from '@/components/stores/AuthStore';
import { extractPartnerData } from '@/components/services/StreamChat/lib/extractPartnerData';
import { Image } from 'react-native';
import { chatService } from '@/components/services/StreamChat/chatService';


const IconMenu: React.FC<{ iconSize?: number; iconColor?: string, categoryIcon?: any }> = ({
  iconSize = 24,
  iconColor = 'black',
  categoryIcon,
}) => {
  const { fontSize } = useContext(FontSizeContext);
  const [visible, setVisible] = useState(false);
  const { setSelectedUser } = useSelectedUserStore();
  const { channels } = useStreamChatStore();
  const { cid } = useActiveChatStore();
  const user = useAuthStore((s) => s.user);
  const [isMuted, setIsMuted] = useState(false);
  const channel = channels.find((ch) => ch.cid === cid);
  const partnerData = channel ? extractPartnerData(channel, user?.id ?? '') : null;

  const adjustedFontSize = Math.min((fontSize / 24) * 22, 28);

  useEffect(() => {
    const checkIfMuted = async () => {
      if (!partnerData) return;
      const client = useAuthStore.getState().streamChatClient;
      const mutedIds = client?.mutedUsers?.map((m) => m.target.id);
      setIsMuted(mutedIds?.includes(partnerData.userId) ?? false);
    };
  
    checkIfMuted();
  }, [partnerData]);

  const handleViewProfile = () => {
    if (!partnerData) return;
    setSelectedUser(partnerData);
    setVisible(false);
    setTimeout(() => {
      router.push('/(modal)/forreignProfile');
    }, 100);
  };

  const handleBlockUser = async () => {
    if (!channel || !partnerData) return;
    
    try {
      await chatService.blockUser(partnerData.userId);
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