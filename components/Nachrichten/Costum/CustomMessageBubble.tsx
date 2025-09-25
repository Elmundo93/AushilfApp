// File: components/Nachrichten/Costum/CustomMessageBubble.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Image } from 'react-native';
import dayjs from 'dayjs';
import type { MessageRow } from '@/components/types/chat';
import { styles as bubbleStyles } from './customMStyles';
import { MessageStatusTicks } from '../Helpers/MessageStatusTicks';

interface Props {
  message: MessageRow;
  currentUserId: string;
  fontSize: number;
  animateOnMount?: boolean;
  // UI-specific fields that need to be passed from parent
  senderVorname?: string;
  senderNachname?: string;
  senderImage?: string;
}

export const CustomMessageBubble: React.FC<Props> = React.memo(
  ({ message, currentUserId, fontSize, animateOnMount = false, senderVorname, senderNachname, senderImage }) => {
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

    // Determine message status based on sync_state
    const getMessageStatus = (): 'sent' | 'read' => {
      if (message.sync_state === 'synced') {
        return 'read';
      }
      return 'sent';
    };

    return (
      <View
        style={[
          bubbleStyles.messageRow,
          isOwn ? bubbleStyles.ownRow : bubbleStyles.otherRow,
        ]}
      >
        {!isOwn && senderImage && (
          <Image source={{ uri: senderImage }} style={bubbleStyles.avatar} />
        )}

        <Animated.View
          style={[
            bubbleStyles.bubble,
            isOwn ? bubbleStyles.ownBubble : bubbleStyles.otherBubble,
            { opacity: anim, transform: [{ translateY }] },
          ]}
        >
          {!isOwn && senderVorname && (
            <Text style={[bubbleStyles.username, { fontSize: fontSize - 2 }]}> 
              {senderVorname} {senderNachname?.[0]}.
            </Text>
          )}

          <Text style={[bubbleStyles.text, { fontSize }]}>
            {message.body}
          </Text>
       
          {isOwn && (
            <View style={bubbleStyles.statusRow}>
              <Text style={bubbleStyles.time}>
                {dayjs(message.created_at).format('HH:mm')}
              </Text>
              <MessageStatusTicks status={getMessageStatus()} />
            </View>
          )}
        </Animated.View>
      </View>
    );
  }
);
