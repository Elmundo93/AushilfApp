import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import dayjs from 'dayjs';

export const CustomMessageBubble = ({
  message,
  currentUserId,
  fontSize,
}: {
  message: any;
  currentUserId: string;
  fontSize: number;
}) => {
  const isOwnMessage = message.user?.id === currentUserId;

  return (
    <View
      style={[
        styles.messageRow,
        isOwnMessage ? styles.ownRow : styles.otherRow,
      ]}
    >
      
      {!isOwnMessage && message.user?.image && (
        <Image source={{ uri: message.user.image }} style={styles.avatar} />
      )}

      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        
        {!isOwnMessage && (
          <Text style={[styles.username, { fontSize: fontSize - 2 }]}>
            {message.user?.name || 'Unbekannt'}
          </Text>
        )}
        <Text style={[styles.text, { fontSize }]}>{message.text}</Text>
        <Text style={[styles.time, { fontSize: fontSize - 4 }]}>
          {dayjs(message.created_at).format('HH:mm')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
  },
  ownRow: {
    justifyContent: 'flex-end',
  },
  otherRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  ownBubble: {
    backgroundColor: '#FFE2B4',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 0,
  },
  username: {
    fontWeight: '600',
    marginBottom: 2,
    color: '#555',
  },
  text: {
    color: '#000',
  },
  time: {
    textAlign: 'right',
    marginTop: 4,
    color: '#999',
  },
});