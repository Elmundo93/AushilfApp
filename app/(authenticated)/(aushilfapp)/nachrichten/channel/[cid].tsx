// app/(authenticated)/(aushilfapp)/nachrichten/channel/[cid].tsx
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Animated as RNAnimated } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useMuteStore } from '@/components/stores/useMuteStore';

import CustomChatHeader from '@/components/Nachrichten/Costum/CustomHeader';
import { CustomInputField } from '@/components/Nachrichten/Costum/CustomInputField';
import { CustomMessageBubble } from '@/components/Nachrichten/Costum/CustomMessageBubble';
import { ScrollToBottomOnMount } from '@/components/Nachrichten/Helpers/ScrollToBottomOnMount';
import { MutedNotice } from '@/components/Nachrichten/MutedNotice';
import { useScrollToBottom } from '@/components/Nachrichten/Helpers/ScrollToBottom';
import { InitialMessageBanner } from '@/components/Nachrichten/initialMessageButton';

import { useMessageLocalStore } from '@/components/stores/useMessageLocalStore';

const AnimatedTouchable = RNAnimated.createAnimatedComponent(TouchableOpacity);

export default function ChannelScreen() {
  const { cid: channelId } = useLocalSearchParams<{ cid: string }>();
  const flatListRef = useRef<FlatList<any> | null>(null);

  const { fontSize } = useContext(FontSizeContext);
  const user = useAuthStore.getState().user;
  const currentUserId = user?.id ?? '';

  const { messages, loading, initChannel, markAsRead, sendTick, stopRealtime } = useMessageLocalStore();

  // Init & cleanup
  useEffect(() => {
    let mounted = true;
    (async () => {
      await initChannel(channelId!);
      if (mounted) await markAsRead();
    })();
    const int = setInterval(() => currentUserId && sendTick(currentUserId), 5000);
    return () => { mounted = false; clearInterval(int); stopRealtime(); };
  }, [channelId, initChannel, markAsRead, sendTick, stopRealtime, currentUserId]);

  // UI Effekte
  const { onScroll, isNearBottom, scrollToBottom } = useScrollToBottom(flatListRef as React.RefObject<FlatList<any>>, messages.length);
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const contentFadeAnim = useSharedValue(0);

  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setInitialLoading(false), 150);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    if (!initialLoading && messages.length > 0) {
      contentFadeAnim.value = withTiming(1, { duration: 400 });
    }
  }, [initialLoading, messages.length, contentFadeAnim]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({ opacity: contentFadeAnim.value }));
  useEffect(() => {
    RNAnimated.timing(fadeAnim, { toValue: isNearBottom ? 0 : 1, duration: 300, useNativeDriver: true }).start();
  }, [isNearBottom, fadeAnim]);

  // Loader
  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#FFA500', 'white', 'white']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        <Animated.View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <View style={styles.loadingCard}>
            <LottieView source={require('@/assets/animations/LoadingWarp.json')} autoPlay loop style={{ width: 120, height: 120 }} />
            <Text style={styles.loadingTitle}>Chat wird geladen</Text>
            <Text style={styles.loadingSubtitle}>Nachrichten werden vorbereitet...</Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  // Hinweis: Deine bestehenden Bubbles erwarten Felder wie `content`, `custom_type`, `post_*`.
  // Da wir "nicht mappen" wollen, brauchst du in den Komponenten einen direkten Zugriff auf `MessageRow`.
  // Vorschlag: Passe `CustomMessageBubble` so an, dass es `message: MessageRow` akzeptiert und intern
  // `JSON.parse(message.meta)` nutzt, wenn `custom_type`/`post_*` benötigt werden.

  const isMuted = false; // TODO: aus channel_members_local ableiten, wenn gewünscht

  return (
    <View style={styles.container}>
      <CustomChatHeader otherUserImage={''} categoryIcon={null as any} otherUserName={'Chat'} channel={{ id: channelId } as any} />

      <Animated.View style={[styles.flex, contentAnimatedStyle]}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.select({ ios: 120, android: 100 })}>
          {isMuted && <MutedNotice />}

          <FlatList
            ref={flatListRef}
            inverted
            onScroll={onScroll}
            data={messages}                 // <- direkt MessageRow[]
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              // Optional: Initial-Banner direkt im Bubble-Component behandeln (meta.custom_type === 'initial')
              return (
                <CustomMessageBubble
                  message={item}           // <- gib MessageRow rein, Bubble liest body/meta selbst
                  currentUserId={currentUserId}
                  fontSize={fontSize}
                />
              );
            }}
            contentContainerStyle={{ padding: 10 }}
            initialNumToRender={30}
            maxToRenderPerBatch={20}
            windowSize={5}
            onEndReachedThreshold={0.1}
            maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
          />

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

          <ScrollToBottomOnMount flatListRef={flatListRef as React.RefObject<FlatList<any>>} />

          <CustomInputField
            fontSize={fontSize}
            cid={channelId!}                 // <- UUID direkt weitergeben
            currentUserId={currentUserId}
            flatListRef={flatListRef as React.RefObject<FlatList<any>>}
            onSendMessage={async (text) => {
              if (!text?.trim()) return;
              // Achtung: Dein CustomInputField ruft aktuell `sendMessage(cid, text)` aus dem alten Context.
              // Bitte dort auf `enqueueMessage(channelId, text)` bzw. `useChat().sendMessage` umstellen.
              // Da du bereits den neuen ChatProvider hast, reicht:
              // await useChat().sendMessage(channelId, text.trim())
              // hier rufen wir nur an:
              // (Falls du useChat nicht importieren willst, kannst du auch direkt enqueueMessage nutzen.)
              // Für jetzt:
              // await sendMessage(channelId!, text.trim());
              // Da du im Store die Outbox tickst, kannst du es auch direkt importieren:
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  loadingCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, alignItems: 'center', width: '80%', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  loadingTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 10 },
  loadingSubtitle: { fontSize: 14, color: '#666', marginTop: 5, textAlign: 'center' },
});