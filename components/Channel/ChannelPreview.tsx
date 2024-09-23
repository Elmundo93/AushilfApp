import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Channel as ChannelType } from 'stream-chat';
import { format } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import { ChannelMetadata, ChannelPreviewProps } from '../types/stream';



const ChannelPreview: React.FC<ChannelPreviewProps> = React.memo(({ channel, onSelect }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [partnerData, setPartnerData] = useState<{
    name: string;
    image: string;
    location: string;
  } | null>(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const userDataString = await SecureStore.getItemAsync('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setCurrentUserId(userData.id);
      }
    };

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserId && channel.state.members) {
      const metadata = channel.data?.metadata as ChannelMetadata;
      const createdBy = channel.data?.created_by as { id: string } | undefined;
      const isCurrentUserPost = createdBy && createdBy.id === currentUserId;

      if (isCurrentUserPost) {
        setPartnerData({
          name: `${metadata.userVorname} ${metadata.userNachname}`,
          image: metadata.userProfilImage || '',
          location: metadata.userLocation || '',
        });
      } else {
        setPartnerData({
          name: `${metadata.postVorname} ${metadata.postNachname}`,
          image: metadata.postProfilImage || '',
          location: metadata.postLocation || '',
        });
      }
    }
  }, [currentUserId, channel.state.members, channel.data]);

  const lastMessage = channel.state.messages[channel.state.messages.length - 1];
  const lastMessageText = lastMessage ? lastMessage.text : 'Keine Nachrichten';
  const lastMessageDate = lastMessage ? format(new Date(lastMessage.created_at), 'HH:mm') : '';

  const unreadCount = channel.countUnread();

  const getOptionIcon = (option: string) => {
    switch (option) {
      case 'bieten':
        return require('@/assets/images/RaisingHandBackgroundColor.png');
      case 'suchen':
        return require('@/assets/images/LookingForBackgroundColor.png');
      default:
        return null;
    }
  };

  const metadata = channel.data?.metadata as ChannelMetadata;
  const postOption = metadata.postOption;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onSelect(channel)}>
      <Image source={{ uri: partnerData?.image }} style={styles.avatar} />
      <View style={styles.middleContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.channelName}>{partnerData?.name}</Text>
          {postOption && (
            <Image source={getOptionIcon(postOption)} style={styles.optionIcon} />
          )}
        </View>
        <Text style={styles.location}>{partnerData?.location}</Text>
        <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
          {lastMessageText}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.date}>{lastMessageDate}</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  location: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  optionIcon: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
  lastMessage: {
    color: '#555',
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  date: {
    color: '#999',
    fontSize: 12,
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
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChannelPreview;