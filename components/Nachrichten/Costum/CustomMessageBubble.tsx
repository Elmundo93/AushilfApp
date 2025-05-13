// File: components/Nachrichten/Costum/CustomMessageBubble.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Image } from 'react-native';
import dayjs from 'dayjs';
import { ChatMessage } from '@/components/types/stream';
import { styles as bubbleStyles } from './customMStyles';
import { MessageStatusTicks } from '../Helpers/MessageStatusTicks';

interface Props {
  message: ChatMessage;
  currentUserId: string;
  fontSize: number;
  animateOnMount?: boolean;
}

export const CustomMessageBubble: React.FC<Props> = React.memo(
  ({ message, currentUserId, fontSize, animateOnMount = false }) => {
    const isOwn = message.sender_id === currentUserId;
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (animateOnMount) {
        Animated.timing(anim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }).start();
      } else {
        anim.setValue(1);
      }
    }, [animateOnMount]);

    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });

    return (
      <View
        style={[
          bubbleStyles.messageRow,
          isOwn ? bubbleStyles.ownRow : bubbleStyles.otherRow,
        ]}
      >
        {!isOwn && message.sender_image && (
          <Image source={{ uri: message.sender_image }} style={bubbleStyles.avatar} />
        )}

        <Animated.View
          style={[
            bubbleStyles.bubble,
            isOwn ? bubbleStyles.ownBubble : bubbleStyles.otherBubble,
            { opacity: anim, transform: [{ translateY }] },
          ]}
        >
          {!isOwn && (
            <Text style={[bubbleStyles.username, { fontSize: fontSize - 2 }]}> 
              {message.sender_vorname} {message.sender_nachname?.[0]}.
            </Text>
          )}

          <Text style={[bubbleStyles.text, { fontSize }]}>
            {message.content}
          </Text>
       
          {isOwn && (
  <View style={bubbleStyles.statusRow}>
    <Text style={bubbleStyles.time}>
      {dayjs(message.created_at).format('HH:mm')}
    </Text>
    <MessageStatusTicks status={message.read ? 'read' : 'sent'} />
  </View>
)}
        </Animated.View>
      </View>
    );
  }
);
