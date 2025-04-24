import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { FontSizeContext } from '@/components/provider/FontSizeContext';

type Props = {
  chatId: string;
  currentUserId: string;
  onSendMessage: (content: string) => void;
};

export const ChatRoom = ({ chatId, currentUserId, onSendMessage }: Props) => {
  const flatListRef = useRef<FlatList>(null);
  const [messageText, setMessageText] = useState('');
  const messages = useStreamChatStore((state) => state.messages[chatId] ?? []);
  const { fontSize } = useContext(FontSizeContext);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleSend = () => {
    if (!messageText.trim()) return;
    onSendMessage(messageText.trim());
    setMessageText('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={{
            alignSelf: item.sender_id === currentUserId ? 'flex-end' : 'flex-start',
            backgroundColor: item.sender_id === currentUserId ? '#DCF8C6' : '#EEE',
            borderRadius: 12,
            marginVertical: 4,
            padding: 10,
            maxWidth: '75%',
          }}>
            <Text style={{ fontSize }}>{item.content}</Text>
            <Text style={{ fontSize: fontSize * 0.6, color: 'gray', marginTop: 4 }}>
              {new Date(item.created_at).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />

      <View style={{
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff'
      }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize,
          }}
          value={messageText}
          placeholder="Nachricht schreiben..."
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={handleSend} style={{ marginLeft: 8, justifyContent: 'center' }}>
          <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize }}>
            Senden
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};