import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChatStore } from '@/stores/useChatStore';
import { loadMessagesFromSQLite } from '@/services/loadMessagesForChat';
import { sendMessage } from '@/services/ChatService';
import { useAuthStore } from '@/components/stores/AuthStore';
import { FontSizeContext } from '@/components/provider/FontSizeContext';

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const [messageText, setMessageText] = useState('');
  const currentUserId = useAuthStore((s) => s.user?.id ?? '');
  const chat = useChatStore((s) => s.chats[chatId ?? '']);
  const messages = useChatStore((s) => s.messages[chatId ?? ''] ?? []);
  const { fontSize } = useContext(FontSizeContext);

  useEffect(() => {
    if (chatId) {
      loadMessagesFromSQLite(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.id !== lastMessageIdRef.current) {
      lastMessageIdRef.current = lastMessage?.id;
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;
    await sendMessage(chatId!, messageText.trim(), currentUserId);
    setMessageText('');
    scrollToBottom();
  };

  if (!chat) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize }}>Chat nicht gefunden</Text>
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', padding: 12 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender_id === currentUserId ? styles.bubbleRight : styles.bubbleLeft,
            ]}
          >
            <Text style={[styles.messageText, { fontSize }]}>{item.content}</Text>
            <Text style={[styles.timestamp, { fontSize: fontSize * 0.6 }]}>
              {new Date(item.created_at).toLocaleTimeString()}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Nachricht..."
          style={[styles.input, { fontSize }]}
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            !messageText.trim() && { backgroundColor: '#ccc' },
          ]}
          disabled={!messageText.trim()}
        >
          <Text style={{ color: 'white', fontSize }}>Senden</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: '75%',
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  messageText: {
    color: '#000',
  },
  timestamp: {
    color: '#888',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
  },
});