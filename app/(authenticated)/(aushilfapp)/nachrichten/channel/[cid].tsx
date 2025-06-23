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
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Animated as RNAnimated } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useMuteStore } from '@/components/stores/useMuteStore';

import { ChatMessage } from '@/components/types/stream';
import CustomChatHeader from '@/components/Nachrichten/Costum/CustomHeader';
import { CustomInputField } from '@/components/Nachrichten/Costum/CustomInputField';
import { CustomMessageBubble } from '@/components/Nachrichten/Costum/CustomMessageBubble';
import { ScrollToBottomOnMount } from '@/components/Nachrichten/Helpers/ScrollToBottomOnMount';
import { MutedNotice } from '@/components/Nachrichten/MutedNotice';
import { useScrollToBottom } from '@/components/Nachrichten/Helpers/ScrollToBottom';
import { extractPartnerData } from '@/components/services/StreamChat/lib/extractPartnerData';

import { useInitChannel } from '@/components/services/Storage/Hooks/useInitChannel';
import { useChatContext } from '@/components/provider/ChatProvider';
import { useSendMessage } from '@/components/services/Storage/Hooks/useSendMessage';
import { useSyncIncomingMessages } from '@/components/services/Storage/Hooks/useSyncInomingMessages';




export default function ChannelScreen() {
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const { fontSize } = useContext(FontSizeContext);
  const user = useAuthStore.getState().user;
  const channels = useStreamChatStore((s) => s.channels);
  const activeMessages = useActiveChatStore((s) => s.messages);
  const setMessages = useActiveChatStore((s) => s.setMessages);
  const loading = useActiveChatStore((s) => s.loading);

  const channel = channels.find((c) => c.cid === cid);
  const currentUserId = user?.id ?? '';
  const partnerData = extractPartnerData(channel, currentUserId);
  const isMuted = useMuteStore((s) => partnerData?.userId ? s.isMuted(partnerData.userId) : false);

  const { onScroll, isNearBottom, scrollToBottom } = useScrollToBottom(flatListRef, activeMessages.length);

  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;

  // Lokale SQLite-Nachrichten + Listener
  useInitChannel(cid);
  // Temporär deaktiviert bis SQLite-Problem gelöst ist
  // useSyncIncomingMessages(cid, currentUserId);
  

  const {loadMoreMessages, sendMessage} = useChatContext();

  const [showLoader, setShowLoader] = React.useState(loading);
  const loaderOpacity = useSharedValue(loading ? 1 : 0);

  React.useEffect(() => {
    if (loading) {
      setShowLoader(true);
      loaderOpacity.value = withTiming(1, { duration: 300 });
    } else {
      loaderOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) runOnJS(setShowLoader)(false);
      });
    }
  }, [loading]);

  const animatedLoaderStyle = useAnimatedStyle(() => ({
    opacity: loaderOpacity.value,
  }));

  useEffect(() => {
    let isMounted = true;
    if (!channel) return;
    setMessages([]); // Leere Nachrichten beim Channel-Wechsel
    useActiveChatStore.getState().setLoading(true);
    (async () => {
      try {
        const loaded = await loadMoreMessages(cid);
        if (isMounted) {
          useActiveChatStore.getState().setLoading(false);
        }
      } catch (e) {
        if (isMounted) {
          useActiveChatStore.getState().setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, [cid]);

  useEffect(() => {
    if (!channel) {
      console.warn(`Kein Channel für cid: ${cid}`);
      return;
    }
    
    try {
      RNAnimated.timing(fadeAnim, {
        toValue: isNearBottom ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Animation Error:', error);
    }
  }, [isNearBottom, channel]);

  const handlePressIn = () => {
    RNAnimated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    RNAnimated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (!channel) {
    console.warn(`Kein Channel für cid: ${cid}`);
    return null;
  }

  if (showLoader) {
    return (
      <Animated.View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }, animatedLoaderStyle]}>
        <LottieView
          source={require('@/assets/animations/LoadingWarp.json')}
          autoPlay
          loop
          style={{ width: 180, height: 180 }}
        />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#ff9a00', fontWeight: '600' }}>Nachrichten werden geladen ...</Text>
      </Animated.View>
    );
  }

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
        {isMuted && <MutedNotice />}

        <FlatList
          ref={flatListRef}
          inverted
          onScroll={onScroll}
          data={activeMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomMessageBubble
              message={item}
              currentUserId={currentUserId}
              fontSize={fontSize}
            />
          )}
          contentContainerStyle={{ padding: 10 }}
          initialNumToRender={30}
          maxToRenderPerBatch={20}
          windowSize={5}
          onEndReached={() => cid && loadMoreMessages(cid)}
          onEndReachedThreshold={0.1}
          maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
        />

        <RNAnimated.View
          style={[styles.scrollButtonContainer, { opacity: fadeAnim, display: isNearBottom ? 'none' : 'flex' }]}
        >
          <AnimatedTouchable
            style={[styles.scrollButton, { transform: [{ scale: scaleAnim }] }]}
            onPress={() => scrollToBottom()}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <MaterialIcons name="arrow-downward" size={24} color="white" />
          </AnimatedTouchable>
        </RNAnimated.View>

        <ScrollToBottomOnMount flatListRef={flatListRef} />

        <CustomInputField
          fontSize={fontSize}
          cid={cid}
          currentUserId={currentUserId}
          flatListRef={flatListRef}
          onSendMessage={(text) =>
            sendMessage(cid, text)
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const AnimatedTouchable = RNAnimated.createAnimatedComponent(TouchableOpacity);

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
    elevation: 5,
  },
});