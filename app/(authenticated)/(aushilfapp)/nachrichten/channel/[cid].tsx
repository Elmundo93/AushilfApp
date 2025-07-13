// File: app/(authenticated)/(aushilfapp)/nachrichten/channel/[cid].tsx

import React, { useEffect, useContext, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
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
import { InitialMessageBanner } from '@/components/Nachrichten/initialMessageButton';
import { useSafeLoading } from '@/components/hooks/useLoading';
import GastroIconWithBackground from '@/assets/images/GastroIconWithBackground.png';
import GartenIconWithBackground from '@/assets/images/GartenIconWithBackground.png';
import HaushaltWithBackground from '@/assets/images/HaushaltWithBackground.png';
import SozialesIconWithBackground from '@/assets/images/SozialesIconWithBackground.png';
import HandwerkIconWithBackground from '@/assets/images/HandwerkIconWithBackground.png';
import BildungsIconWithBackground from '@/assets/images/BildungsIconWithBackground.png';
import { LinearGradient } from 'expo-linear-gradient';


const categoryIcons = {
  gastro: GastroIconWithBackground,
  garten: GartenIconWithBackground,
  haushalt: HaushaltWithBackground,
  soziales: SozialesIconWithBackground,
  handwerk: HandwerkIconWithBackground,
  bildung: BildungsIconWithBackground,
};

export default function ChannelScreen() {
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const flatListRef = useRef<FlatList<ChatMessage> | null>(null);

  const { fontSize } = useContext(FontSizeContext);
  const user = useAuthStore.getState().user;
  const channels = useStreamChatStore((s) => s.channels);
  const activeMessages = useActiveChatStore((s) => s.messages);
  const setMessages = useActiveChatStore((s) => s.setMessages);
  const rawLoading = useActiveChatStore((s) => s.loading);
  const setCid = useActiveChatStore((s) => s.setCid);
  const activeCid = useActiveChatStore((s) => s.cid);

  // Use safe loading to prevent conflicts with global loading
  const loading = useSafeLoading(rawLoading);

  const channel = channels.find((c) => c.cid === cid);
  const currentUserId = user?.id ?? '';

  // Simple channel tracking
  const [channelData, setChannelData] = useState(channel);

  // Update channel data when channel is found
  useEffect(() => {
    if (channel) {
      console.log('✅ ChannelScreen: Channel found:', channel.cid);
      setChannelData(channel);
    }
  }, [channel]);

  // Use stored channel data if available
  const displayChannel = channelData || channel;
  const partnerData = extractPartnerData(displayChannel, currentUserId);
  const isMuted = useMuteStore((s) => partnerData?.userId ? s.isUserMuted(partnerData.userId) : false);

  // Debug: Log channel data to see what's being displayed
  useEffect(() => {
    if (displayChannel) {
      console.log('🔍 ChannelScreen: Display channel data:', {
        cid: displayChannel.cid,
        custom_post_vorname: displayChannel.custom_post_vorname,
        custom_post_nachname: displayChannel.custom_post_nachname,
        custom_user_vorname: displayChannel.custom_user_vorname,
        custom_user_nachname: displayChannel.custom_user_nachname,
        partnerData: partnerData
      });
    }
  }, [displayChannel, partnerData]);

  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const { onScroll, isNearBottom, scrollToBottom } = useScrollToBottom(flatListRef as React.RefObject<FlatList<ChatMessage>>, activeMessages.length);

  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const contentFadeAnim = useSharedValue(0);

  // Get chat context functions directly in component body
  const { syncMessagesForChannel } = useChatContext();

  // Lokale SQLite-Nachrichten + Listener
  useInitChannel(cid);
  
  const {loadMoreMessages, sendMessage, markChannelAsRead, hasMoreMessages} = useChatContext();

  // Simplified loading state - only show loader if we have a channel but no messages
  const shouldShowLoader = loading && activeMessages.length === 0;
  const loaderOpacity = useSharedValue(shouldShowLoader ? 1 : 0);

  // Error state for channel not found
  const [showError, setShowError] = useState(false);

  // Channel validation and error handling
  useEffect(() => {
    console.log('🔍 ChannelScreen: Component mounted with cid:', cid);
    console.log('🔍 ChannelScreen: Available channels:', channels.map(ch => ch.cid));
    console.log('🔍 ChannelScreen: Channel found:', channel ? 'YES' : 'NO');
    
    // Sync messages from Stream Chat when channel is found
    if (cid && channel) {
      console.log('🔄 Triggering message sync for channel:', cid);
      syncMessagesForChannel(cid);
    }
  }, [cid, channel]); // Only depend on cid and channel

  // Fade in content when chat is ready
  useEffect(() => {
    if (!loading && displayChannel && activeMessages.length > 0) {
      contentFadeAnim.value = withTiming(1, { duration: 500 });
    }
  }, [loading, displayChannel, activeMessages.length, contentFadeAnim]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentFadeAnim.value,
  }));

  React.useEffect(() => {
    if (shouldShowLoader) {
      loaderOpacity.value = withTiming(1, { duration: 300 });
    } else {
      loaderOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [shouldShowLoader, loaderOpacity]);

  const animatedLoaderStyle = useAnimatedStyle(() => ({
    opacity: loaderOpacity.value,
  }));

  // Mark channel as read when opened
  useEffect(() => {
    if (cid && displayChannel && !loading) {
      const markAsRead = async () => {
        try {
          await markChannelAsRead(cid);
        } catch (error) {
          // Silent error handling
        }
      };
      markAsRead();
    }
  }, [cid, displayChannel, loading]); // Only depend on stable values

  useEffect(() => {
    if (!displayChannel) {
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
  }, [isNearBottom, displayChannel, fadeAnim]);

  // Error timeout effect - must be before early returns
  useEffect(() => {
    if (!displayChannel) {
      const timer = setTimeout(() => {
        setShowError(true);
      }, 3000); // Wait 3 seconds before showing error
      
      return () => clearTimeout(timer);
    }
  }, [displayChannel]);

  // NOW WE CAN HAVE EARLY RETURNS
  if (!displayChannel) {
    console.log('⚠️ ChannelScreen: No channel found for cid:', cid);
    console.log('⚠️ ChannelScreen: Available channels:', channels.map(ch => ch.cid));
    
    if (!showError) {
      return (
        <View style={styles.loadingContainer}>
          <LottieView 
            source={require('@/assets/animations/LoadingWarp.json')} 
            autoPlay 
            loop 
            style={styles.loadingAnimation}
          />
          <Text style={styles.loadingText}>Chat wird geladen...</Text>
          <Text style={styles.loadingSubText}>
            CID: {cid}
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Channel nicht gefunden</Text>
          <Text style={styles.errorSubText}>
            Der Channel konnte nicht geladen werden.{'\n'}
            Bitte versuchen Sie es erneut.
          </Text>
        </View>
      </View>
    );
  }

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

  const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
  const isValidCategory = (category: string) => validCategories.includes(category);
  
  const category = (displayChannel?.custom_post_category_choosen && isValidCategory(displayChannel.custom_post_category_choosen)) 
    ? displayChannel.custom_post_category_choosen 
    : displayChannel?.custom_post_category;
  const categoryIcon = categoryIcons[category as keyof typeof categoryIcons] ?? null;

  // Show loader only if we have a channel but messages are still loading
  if (shouldShowLoader) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#FFA500', 'white', 'white']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        
        <Animated.View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, animatedLoaderStyle]}>
          <View style={styles.loadingCard}>
            <LottieView
              source={require('@/assets/animations/LoadingWarp.json')}
              autoPlay
              loop
              style={{ width: 120, height: 120 }}
            />
            <Text style={styles.loadingTitle}>Chat wird geladen</Text>
            <Text style={styles.loadingSubtitle}>Nachrichten werden vorbereitet...</Text>
            
            <View style={styles.loadingProgressContainer}>
              <View style={[styles.loadingProgressDot, styles.loadingProgressDotActive]} />
              <View style={[styles.loadingProgressDot, styles.loadingProgressDotActive]} />
              <View style={styles.loadingProgressDot} />
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomChatHeader
        otherUserImage={partnerData.profileImageUrl || displayChannel.custom_user_profileImage}
        categoryIcon={categoryIcon as any}
        otherUserName={`${partnerData.vorname} ${partnerData.nachname}`.trim() || 'Unbekannter Benutzer'}
        channel={displayChannel}
      />

      <Animated.View style={[styles.flex, contentAnimatedStyle]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.select({ ios: 120, android: 100 })}
        >
          {isMuted && <MutedNotice />}

          <FlatList
            ref={flatListRef}
            inverted
            onScroll={onScroll}
            data={activeMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isInitial = item.custom_type === 'initial' || false;
            
              if (isInitial) {
                return (
                  <InitialMessageBanner
                    postVorname={item.post_vorname}
                    postNachname={item.post_nachname}
                    postCategory={item.post_category}
                    postOption={item.post_option}
                    postText={item.content || ''}
                    profileImageUrl={item.post_image}

                  />
                );
              }
            
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
            onEndReached={() => cid && hasMoreMessages && loadMoreMessages(cid)}
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

          <ScrollToBottomOnMount flatListRef={flatListRef as React.RefObject<FlatList<ChatMessage>>} />

          <CustomInputField
            fontSize={fontSize}
            cid={cid}
            currentUserId={currentUserId}
            flatListRef={flatListRef as React.RefObject<FlatList<ChatMessage>>}
            onSendMessage={(text) =>
              sendMessage(cid, text)
            }
          />
        </KeyboardAvoidingView>
      </Animated.View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  loadingProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  loadingProgressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  loadingProgressDotActive: {
    backgroundColor: '#FFA500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingSubText: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  loadingAnimation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});