// app/(authenticated)/(aushilfapp)/nachrichten/channel/[cid].tsx
import React, { useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated as RNAnimated } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ChanelLoading } from "@/components/Nachrichten/Channel/ChanelLoading"
import { InitialMessageBanner } from '@/components/Nachrichten/initialMessageButton';

import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useAuthStore } from '@/components/stores/AuthStore';

import CustomChatHeader from '@/components/Nachrichten/Costum/CustomHeader';
import { CustomInputField } from '@/components/Nachrichten/Costum/CustomInputField';
import { CustomMessageBubble } from '@/components/Nachrichten/Costum/CustomMessageBubble';
import { MutedNotice } from '@/components/Nachrichten/MutedNotice';
import { useScrollToBottom } from '@/components/Nachrichten/Helpers/ScrollToBottom';
import { useSQLiteContext } from 'expo-sqlite';
import { useLiveQuery } from '@/components/hooks/useLiveQuery';
import { TOPIC, liveBus } from '@/components/lib/liveBus';

import { loadOlderMessages } from '@/components/services/Chat/chatSync';
import { useRealtimeChat } from '@/components/services/Chat/hooks/useRealtimeChat';
import { enqueueMessage } from '@/components/services/Chat/chatOutbox';
import { markRead } from '@/components/services/Chat/chatApi';
import { extractPartnerDataFromChannel } from '@/components/Nachrichten/utils/extractPartnerData';
import { Msg } from '@/components/types/chat';


const AnimatedTouchable = RNAnimated.createAnimatedComponent(TouchableOpacity);

export default function ChannelScreen() {
  const { cid: channelId } = useLocalSearchParams<{ cid: string }>();
  const db = useSQLiteContext();
  const flatListRef = useRef<FlatList<any> | null>(null);

  const { fontSize } = useContext(FontSizeContext);
  const user = useAuthStore.getState().user;
  const currentUserId = user?.id ?? '';

  // 1) Channel-Row aus SQLite laden (für Header/Partnerdaten)
  const channelRows = useLiveQuery<any>(
    db,
    `SELECT * FROM channels_local WHERE id = ? LIMIT 1`,
    [channelId],
    [TOPIC.CHANNELS]
  );
  const channel = channelRows[0] ?? null;
  const partner = useMemo(
    () => (channel ? extractPartnerDataFromChannel(channel, currentUserId) : null),
    [channel, currentUserId]
  );
  const otherUserImage = partner?.profileImageUrl || undefined;

  useRealtimeChat(channelId!);


  const messages = useLiveQuery<Msg>(
       db,
       `SELECT * FROM messages_local 
          WHERE channel_id=? 
          ORDER BY created_at ASC, id ASC 
          LIMIT 200`,   
       [channelId],
       [TOPIC.MESSAGES(channelId!)]
    );

  // markRead nur beim ersten Laden des Channels, nicht bei jedem Fokus
  const hasMarkedReadRef = useRef(false);
  useFocusEffect(useCallback(() => { 
    if (!hasMarkedReadRef.current) {
      hasMarkedReadRef.current = true;
      markRead(channelId!).catch(() => {}); 
    }
  }, [channelId]));
  
  // Reset hasReachedEnd and markRead flag when channel changes
  useEffect(() => {
    setHasReachedEnd(false);
    hasMarkedReadRef.current = false;
  }, [channelId]);

  const { onScroll, isNearBottom, scrollToBottom } = useScrollToBottom(flatListRef as React.RefObject<FlatList<any>>, messages.length);

  // Soft-Intro
  const [initialLoading, setInitialLoading] = useState(true);
  const contentFade = useSharedValue(0);
  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 150);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => { if (!initialLoading) contentFade.value = withTiming(1, { duration: 400 }); }, [initialLoading, contentFade]);
  const contentAnimatedStyle = useAnimatedStyle(() => ({ opacity: contentFade.value }));

  // Down-Button
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    RNAnimated.timing(fadeAnim, { toValue: isNearBottom ? 0 : 1, duration: 300, useNativeDriver: true }).start();
  }, [isNearBottom, fadeAnim]);

  // ältere Nachrichten laden (inverted: top-reach)
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  
  const onEndReached = async () => {
    if (loadingOlder || messages.length === 0 || hasReachedEnd) return;
    
    setLoadingOlder(true);
    try {
      const oldest = messages[0];
      const newMessages = await loadOlderMessages(channelId!, oldest?.created_at, oldest?.id, 50);
      
      if (newMessages.length === 0) {
        setHasReachedEnd(true);
      }
    } catch (e) {
      setHasReachedEnd(true);
    } finally {
      setLoadingOlder(false);
    }
  };

  if (initialLoading) {
    return (
      <ChanelLoading />
    );
  }

  const isMuted = false; // ggf. aus channel_members_local leiten



  return (
    <View style={styles.container}>
      {/* 3) Kein leerer String: undefined wenn kein Bild */}
      <CustomChatHeader
        otherUserImage={otherUserImage || ''}
        categoryIcon={null as any}
        otherUserName={partner?.vorname ?? 'Chat'}
        channelId={channelId}
      />

      <Animated.View style={[styles.flex, contentAnimatedStyle]}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.select({ ios: 120, android: 100 })}>
          {isMuted && <MutedNotice />}

          <FlatList
            ref={flatListRef}
            inverted
            onScroll={onScroll}
            data={messages}
            keyExtractor={(item) => item.client_id || item.id}            
            renderItem={({ item }) => (
              item.custom_type === 'initial' ? (
                <InitialMessageBanner 
                  postVorname={item.post_vorname}
                  postNachname={item.post_nachname}
                  postCategory={item.post_category}
                  postOption={item.post_option}
                  postText={item.content}
                  profileImageUrl={item.post_image}
                  fontSize={fontSize}
                />
              ) : (
                <CustomMessageBubble message={item} currentUserId={currentUserId} fontSize={fontSize} />
              )
            )}
            contentContainerStyle={{ padding: 10 }}
            initialNumToRender={24}
            maxToRenderPerBatch={16}
            windowSize={6}
            onEndReachedThreshold={0.1}
            onEndReached={onEndReached}
            maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: 10 }}
            removeClippedSubviews={Platform.OS === 'android'}
            ListFooterComponent={
              loadingOlder && !hasReachedEnd ? (
                <View style={{ paddingVertical: 10 }}><ActivityIndicator /></View>
              ) : null
            }
          />

          {/* Scroll-to-bottom */}
          <RNAnimated.View style={[styles.scrollButtonContainer, { opacity: fadeAnim, display: isNearBottom ? 'none' : 'flex' }]}>
            <AnimatedTouchable
              style={[styles.scrollButton, { transform: [{ scale: scaleAnim }] }]}
              onPress={() => scrollToBottom()}
              onPressIn={() => RNAnimated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true }).start()}
              onPressOut={() => RNAnimated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
            >
              <MaterialIcons name="arrow-downward" size={24} color="white" />
            </AnimatedTouchable>
          </RNAnimated.View>


          {/* Senden: EIN Weg → enqueueMessage (Outbox) */}
          <CustomInputField
            fontSize={fontSize}
            channelId={channelId!}
            currentUserId={currentUserId}
            flatListRef={flatListRef as React.RefObject<FlatList<any>>}
            onSendMessage={async (text) => {
              const body = text?.trim();
              if (!body) return;
              await enqueueMessage(channelId!, body, {});  // legt local pending + outbox an; Upload via useRealtimeChat
              liveBus.emit(TOPIC.MESSAGES(channelId!));    // snappy refresh (useLiveQuery zieht kurz danach ohnehin nach)
            }}
          />
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  flex: { flex: 1 },
  scrollButtonContainer: { position: 'absolute', bottom: Platform.select({ ios: 90, android: 80 }), left: 16, zIndex: 100 },
  scrollButton: { backgroundColor: 'orange', borderRadius: 25, width: 50, height: 50, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});