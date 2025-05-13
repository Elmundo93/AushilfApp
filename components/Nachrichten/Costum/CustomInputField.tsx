// File: components/Nachrichten/Costum/CustomInputField.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChatContext } from '@/components/provider/ChatProvider';
import { ChatMessage } from '@/components/types/stream';

interface Props {
  fontSize: number;
  cid: string;
  currentUserId: string;
  onMessageSent?: () => void;
  flatListRef: React.RefObject<FlatList<ChatMessage>>;
}

export const CustomInputField: React.FC<Props> = ({
  fontSize,
  cid,
  onMessageSent,
  flatListRef,
}) => {
  const [text, setText] = useState('');
  const { sendMessage } = useChatContext();

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      await sendMessage(cid, trimmed);
      setText('');
      onMessageSent?.();
    } catch (e) {
      console.error('Fehler beim Senden der Nachricht:', e);
    }

  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Nachricht schreiben..."
        style={[styles.input, { fontSize }]}
        multiline
      />
      <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
        <Ionicons name="send" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'orange',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});