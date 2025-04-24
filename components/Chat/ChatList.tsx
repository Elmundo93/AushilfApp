import React from 'react';
import { FlatList, View } from 'react-native';
import { useChatStore } from '@/stores/useChatStore';
import { ChatPreview } from './ChatPreview';

type Props = {
  currentUserId: string;
  onSelectChat: (chatId: string) => void;
};

export const ChatList = ({ currentUserId, onSelectChat }: Props) => {
  const chats = Object.values(useChatStore((s) => s.chats));

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChatPreview
          chat={item}
          currentUserId={currentUserId}
          onPress={(chat) => onSelectChat(chat.id)}
        />
      )}
      contentContainerStyle={{ backgroundColor: 'white' }}
    />
  );
};