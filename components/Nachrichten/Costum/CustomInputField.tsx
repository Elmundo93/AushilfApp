import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import { ChatMessage } from '@/components/types/stream';

interface CustomInputFieldProps {
  fontSize: number;
  cid: string;
  currentUserId: string;
  flatListRef: React.RefObject<FlatList<ChatMessage>>;
  onSendMessage: (text: string) => Promise<void>;
}

export const CustomInputField: React.FC<CustomInputFieldProps> = ({
  fontSize,
  cid,
  currentUserId,
  flatListRef,
  onSendMessage,
}) => {
  const [text, setText] = useState('');

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    await onSendMessage(trimmed);
    setText('');

    // Optional: automatisch ans Ende scrollen
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    Keyboard.dismiss();
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