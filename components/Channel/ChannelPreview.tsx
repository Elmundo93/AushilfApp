// ChannelPreview.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import { format } from 'date-fns';
import { ChannelPreviewProps } from '../types/stream';
import { useAuthStore } from '../stores/AuthStore';

import RaisingHandImage from '@/assets/images/RaisingHandBackgroundColor.png';
import LookingForImage from '@/assets/images/LookingForBackgroundColor.png';
import DefaultAvatar from '@/assets/images/DefaultAvatar.png';
import GartenIconWithBackground from '@/assets/images/GartenIconWithBackground.png';
import HaushaltWithBackground from '@/assets/images/HaushaltWithBackground.png';
import SozialesIconWithBackground from '@/assets/images/SozialesIconWithBackground.png';
import GastroIconWithBackground from '@/assets/images/GastroIconWithBackground.png';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { UserProfile } from '@/components/types/auth';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';

const ChannelPreview: React.FC<ChannelPreviewProps> = React.memo(
  ({ channel, onSelect }) => {
    const currentUser = useAuthStore((state) => state.user);
    const [partnerData, setPartnerData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { fontSize } = useContext(FontSizeContext);
    const { setSelectedUser } = useSelectedUserStore();
    const router = useRouter();
    const defaultFontSize = 22;
    const componentBaseFontSize = 22;
    const maxFontSize = 28;
    const minIconSize = 30;
    const maxIconSize = 50;
    const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
    const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
    const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

    useEffect(() => {
      const fetchPartnerData = async () => {
        if (currentUser && channel.state.members) {
          const otherMember = Object.values(channel.state.members).find(
            (member) => member.user_id !== currentUser.id
          );

          if (otherMember && otherMember.user) {
            const user = otherMember.user as any;
            console.log('Other member user data:', user);

            const newPartnerData: UserProfile = {

              userId: user.id,
              vorname: user.vorname || '',
              nachname: user.nachname || '',
              profileImage: user.image || '',
              userBio: user.userBio || '',
            };

            setPartnerData(newPartnerData);
          } else {
            setPartnerData(null);
          }
        }
        setLoading(false);
      };

      fetchPartnerData();
    }, [currentUser?.id, channel.cid]);

    const handleAvatarPress = () => {
      if (partnerData) {
        setSelectedUser(partnerData);
        router.push('/(modal)/forreignProfile');
      }
    };

    if (loading) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }

    const messages = channel.state.messages || [];
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const lastMessageText = lastMessage?.text || 'Keine Nachrichten';
    const lastMessageDate = lastMessage?.created_at
      ? format(new Date(lastMessage.created_at), 'HH:mm')
      : '';

    const unreadCount = channel.countUnread();

    const postOption = channel.data?.custom_post_option;
    const postCategory = channel.data?.custom_post_category;

    const optionIcons: { [key: string]: ImageSourcePropType } = {
      bieten: RaisingHandImage as ImageSourcePropType,
      suchen: LookingForImage as ImageSourcePropType,
    };

    const categoryIcons: { [key: string]: ImageSourcePropType } = {
      gastro: GastroIconWithBackground as ImageSourcePropType,
      garten: GartenIconWithBackground as ImageSourcePropType,
      haushalt: HaushaltWithBackground as ImageSourcePropType,
      soziales: SozialesIconWithBackground as ImageSourcePropType,
    };

    const optionIcon =
      (postOption && optionIcons[postOption as keyof typeof optionIcons]) ||
      null;
    const categoryIcon =
      (postCategory &&
        categoryIcons[postCategory as keyof typeof categoryIcons]) ||
      null;

      const renderLeftActions = () => {
        return (
          <View style={styles.leftActionsContainer}>
          <TouchableOpacity style={ styles.leftActionInnerContainer} onPress={() => onSelect(channel)}>
            <Text>Löschen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ styles.leftActionInnerContainer} onPress={() => onSelect(channel)}>
            <Text>Blocken</Text>
          </TouchableOpacity>
          </View>
        );
      };

      return (
        <Swipeable renderLeftActions={() => renderLeftActions()}>
        <View style={styles.outerContainer}>
          <TouchableOpacity onPress={handleAvatarPress}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  partnerData?.profileImage
                    ? { uri: partnerData.profileImage }
                    : DefaultAvatar as ImageSourcePropType
                }
                style={[styles.avatar, { width: iconSize + 12, height: iconSize + 12 }]}
              />
            </View>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.contentContainer}
            onPress={() => onSelect(channel)}
          >
          <View style={styles.leftContainer}>
            <View style={styles.iconsContainer}>
              {categoryIcon && (
                <Image source={categoryIcon} style={[styles.icon, { width: iconSize, height: iconSize }]} />
              )}
            </View>
          </View>
          <View style={styles.middleContainer}>
            <Text style={[styles.channelName, { fontSize: finalFontSize }]}>
              {partnerData?.vorname + ' ' + (partnerData?.nachname ? partnerData.nachname[0] + '.' : '') || 'Unbekannt'}
            </Text>
            <Text
              style={[styles.lastMessage, { fontSize: finalFontSize }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {lastMessageText}
            </Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={[styles.date, { fontSize: finalFontSize - 8 }]}>{lastMessageDate}</Text>
            {unreadCount > 0 && (
              <View style={[styles.unreadBadge, { width: iconSize - 8, height: iconSize - 8 }]}>
                <Text style={[styles.unreadText]}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      </Swipeable>
    );
  }
);

export default ChannelPreview;

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    borderWidth: 1,

  },
  leftActionInnerContainer: {
    backgroundColor: 'red',
    borderWidth: 1,
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  leftContainer: {
    marginRight: 10,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 25,
  },
  iconsContainer: {
    marginLeft: 5,
  },
  icon: {

    marginVertical: 2,
    borderRadius: 25,
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  channelName: {
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#555',
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  date: {
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  unreadText: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
});