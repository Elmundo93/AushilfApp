// components/Nachrichten/Costum/CustomInputField.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import type { MessageRow } from '@/components/types/chat';
import { enqueueMessage } from '@/components/services/Chat/chatOutbox';

interface CustomInputFieldProps {
  fontSize: number;
  channelId: string;
  currentUserId: string;
  flatListRef: React.RefObject<FlatList<MessageRow>>;
  onSendMessage?: (text: string) => Promise<void>;
}

export const CustomInputField: React.FC<CustomInputFieldProps> = ({
  fontSize,
  channelId,
  currentUserId,
  flatListRef,
  onSendMessage,
}) => {
  const [text, setText] = useState('');

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      // Use the callback if provided, otherwise use enqueueMessage directly
      if (onSendMessage) {
        await onSendMessage(trimmed);
      } else {
        await enqueueMessage(channelId, trimmed);
      }
      
      setText('');

      // Optional: automatisch ans Ende scrollen
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, { fontSize }]}
        value={text}
        onChangeText={setText}
        placeholder="Nachricht schreiben..."
        multiline
      />
      <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginBottom: 30,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: 'orange',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
});