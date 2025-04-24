import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useAuthStore } from '@/components/stores/AuthStore';
import { Channel, MessageInput, MessageList } from 'stream-chat-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useStreamChatStore,
} from '@/components/stores/useStreamChatStore';
import { CustomInputField } from '@/components/Nachrichten/Costum/CustomInputField';
import { CustomMessageBubble } from '@/components/Nachrichten/Costum/CustomMessageBubble';
import CustomChatHeader from '@/components/Nachrichten/Costum/CustomHeader';

export default function ChannelScreen() {
  const { cid: cidParam } = useLocalSearchParams<{ cid: string }>();
  const { fontSize } = useContext(FontSizeContext);

  const {
    channel,
    setChannel,
    setCid,
    setLoading,
    setCurrentUserId,
  } = useStreamChatStore();

  const client = useAuthStore.getState().streamChatClient;
  const userId = useAuthStore.getState().user?.id ?? '';

  const handleSendMessage = async (content: string) => {
    if (!channel) return;

    try {
      const response = await channel.sendMessage({
        text: content,
        user_id: userId,
      });

      const newMessage = {
        id: response.message.id,
        chat_id: channel.id || '',
        sender_id: response.message.user?.id ?? '',
        content: response.message.text ?? '',
        created_at: response.message.created_at ?? new Date().toISOString(),
        read: true,
      };

      const currentMessages = useStreamChatStore.getState().messages[channel.id || ''] ?? [];
      useStreamChatStore.getState().setMessages(channel.id || '', [...currentMessages, newMessage]);
    } catch (error) {
      console.error('❌ Nachricht konnte nicht gesendet werden:', error);
    }
  };

  useEffect(() => {
    const fetchChannel = async () => {
      if (!client || !cidParam) return;

      setLoading(true);
      setCid(cidParam);
      setCurrentUserId(userId);

      try {
        const [channelType, channelId] = cidParam.split(':');
        const fetchedChannel = client.channel(channelType, channelId);
        await fetchedChannel.watch();
        setChannel(fetchedChannel);
      } catch (error) {
        console.error('Fehler beim Abrufen des Kanals:', error);
        setChannel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [client, cidParam]);

  return (
   <View style={styles.container}>
      {channel && (
        <Channel channel={channel}>
          {/* Hintergrundverlauf */}
       

          {/* Chat-Header */}
          {channel?.data && (
            <CustomChatHeader
              currentUserImage={channel.data.custom_user_profileImage as string}
              otherUserImage={channel.data.custom_post_profileImage as string}
              currentUserName={`${channel.data.custom_user_vorname ?? ''} ${channel.data.custom_user_nachname ?? ''}`}
              otherUserName={`${channel.data.custom_post_vorname ?? ''} ${channel.data.custom_post_nachname ?? ''}`}
            />
          )}

          {/* Chatinhalt */}
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: 100 })}
          >
            <MessageList
              Message={(props) => (
                <CustomMessageBubble
                  {...props}
                  currentUserId={userId}
                  fontSize={fontSize}
                />
              )}
          
            />
            <MessageInput
              Input={() => <CustomInputField fontSize={fontSize} />}
            />
          </KeyboardAvoidingView>
        </Channel>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
  flex: {
    flex: 1,
    paddingBottom: 0,
  },
});