// File: app/(authenticated)/(aushilfapp)/nachrichten/channel/[cid].tsx
import React, { useEffect, useContext, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { useAuthStore } from '@/components/stores/AuthStore';
import { ChatMessage } from '@/components/types/stream';
import CustomChatHeader from '@/components/Nachrichten/Costum/CustomHeader';
import { CustomInputField } from '@/components/Nachrichten/Costum/CustomInputField';
import { CustomMessageBubble } from '@/components/Nachrichten/Costum/CustomMessageBubble';
import { useChatContext } from '@/components/provider/ChatProvider';
import { ScrollToBottomOnMount } from '@/components/Nachrichten/Helpers/ScrollToBottomOnMount';
import { useScrollToBottom } from '@/components/Nachrichten/Helpers/ScrollToBottom';
import { MaterialIcons } from '@expo/vector-icons';

export default function ChannelScreen() {
  const { cid: cidParam } = useLocalSearchParams<{ cid: string }>();
  const { fontSize } = useContext(FontSizeContext);
  const userId = useAuthStore.getState().user?.id ?? '';
  const channels = useStreamChatStore((s) => s.channels);
  const activeMessages = useActiveChatStore((s) => s.messages);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const { syncMessagesForChannel, loadMoreMessages } = useChatContext();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const channel = channels.find((c) => c.cid === cidParam);
  if (!channel) return null;

  const { onScroll, isNearBottom, scrollToBottom } = useScrollToBottom(
    flatListRef,
    activeMessages.length
  );

  // on open, load the last 30 messages from SQLite/Stream
  useEffect(() => {
    if (cidParam) {
      syncMessagesForChannel(cidParam, 30);
    }
  }, [cidParam]);

  const currentUserId = userId;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <CustomChatHeader
        otherUserImage={channel.custom_user_profileImage}
        otherUserName={channel.custom_user_vorname}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 100 })}
      >
        <FlatList
          ref={flatListRef}
          inverted
          onScroll={onScroll}
          data={activeMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {

            return (
              <CustomMessageBubble
                message={item}
                currentUserId={currentUserId}
                fontSize={fontSize}

              />
            );
          }}
          contentContainerStyle={{ padding: 10 }}
        
          initialNumToRender={30}
          maxToRenderPerBatch={20}
          windowSize={5}
          onEndReached={() => {
            loadMoreMessages(cidParam);
          }}
          onEndReachedThreshold={0.1}
          maintainVisibleContentPosition={{
            minIndexForVisible: 1,
          }}
        />
        {!isNearBottom && (
          <Animated.View style={[styles.scrollButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
              style={styles.scrollButton}
              onPress={scrollToBottom}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <MaterialIcons name="arrow-downward" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        )}
        <ScrollToBottomOnMount flatListRef={flatListRef} />

        <CustomInputField
          fontSize={fontSize}
          cid={cidParam}
          currentUserId={currentUserId}
          flatListRef={flatListRef}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  flex: { flex: 1 },
  scrollButtonContainer: {
    position: 'absolute',
    bottom: Platform.select({ ios: 90, android: 80 }),
    left: 16,
    zIndex: 100,
  },
  scrollButton: {
    backgroundColor: 'orange',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});