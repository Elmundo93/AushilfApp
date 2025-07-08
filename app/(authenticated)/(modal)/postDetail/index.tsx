import React, { useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import BackgroundImage from '@/components/Onboarding/OnboardingBackground';
import LottieView from 'lottie-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence
} from 'react-native-reanimated';

import { useSelectedPostStore } from '@/components/stores/selectedPostStore';
import { useAuthStore } from '@/components/stores/AuthStore';

import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { handleChatPress } from '@/components/services/StreamChat/StreamChatService';

import { PostHeader } from '@/components/PostDetails/PostHeader';
import { PostContent } from '@/components/PostDetails/PostContent';
import { useChatContext } from '@/components/provider/ChatProvider';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';

export default function PostDetail() {
  const { selectedPost } = useSelectedPostStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [loadingMessage, setLoadingMessage] = useState('');

  const {
    setCid,
    setMessages: setActiveMessages,
    messages: activeMessages,
    cid: activeCid,
    setLoading,
  } = useActiveChatStore();
  const router = useRouter();
  const { fontSize } = useContext(FontSizeContext);

  const finalFontSize = Math.min((fontSize / 22) * 20, 50);
  const iconSize = Math.min(Math.max(fontSize * 1.5, 30), 50);

  // Animation values for loading only
  const loadingOpacity = useSharedValue(0);
  const loadingScale = useSharedValue(0.8);

  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
    transform: [{ scale: loadingScale.value }],
  }));

  useEffect(() => {
    if (!selectedPost) {
      router.replace('/pinnwand');
    }
  }, [selectedPost]);

  const startLoadingAnimation = () => {
    loadingOpacity.value = withTiming(1, { duration: 300 });
    loadingScale.value = withSequence(
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  };

  const stopLoadingAnimation = () => {
    loadingOpacity.value = withTiming(0, { duration: 300 });
    loadingScale.value = withTiming(0.8, { duration: 300 });
  };

  const updateLoadingStep = (step: number, message: string) => {
    setLoadingStep(step);
    setLoadingMessage(message);
  };

  const { syncChannels } = useChatContext();
  
  // Simplified navigation - just close modal and let user navigate manually
  const handleChatPressButton = async () => {
    if (!user || !selectedPost) {
      Alert.alert('Fehler', 'Bitte melden Sie sich an.');
      return;
    }

    try {
      setIsLoading(true);
      startLoadingAnimation();
      
      // Step 1: Initializing chat
      updateLoadingStep(1, 'Chat wird vorbereitet...');
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 2: Creating channel
      updateLoadingStep(2, 'Kanal wird erstellt...');
      const channel = await handleChatPress(user, selectedPost);
      
      if (!channel) {
        throw new Error('Channel konnte nicht erstellt werden');
      }

      // Step 3: Setting up chat and store
      updateLoadingStep(3, 'Chat wird eingerichtet...');
      
      // Set the CID in active chat store
      setCid(channel.cid);
      console.log('✅ Active chat CID set:', channel.cid);
      
      // Simple navigation - just navigate directly to the channel
      console.log('🚀 Channel created successfully, navigating to chat');
      
      router.back();
      // Navigate directly to the channel
      router.push({
        pathname: '/nachrichten/channel/[cid]',
        params: { cid: channel.cid },
      });
      
      // Close the modal
      
      // Step 4: Complete
      updateLoadingStep(4, 'Chat wird geöffnet...');
      
      // Brief wait for UI update
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error: any) {
      console.error('❌ Error in handleChatPressButton:', error);
      Alert.alert('Fehler', error.message);
    } finally {
      setIsLoading(false);
      stopLoadingAnimation();
    }
  };

  const LoadingModal = () => (
    <Modal
      visible={isLoading}
      transparent
      animationType="fade"
    >
      <View style={loadingStyles.overlay}>
        <Animated.View style={[loadingStyles.container, loadingAnimatedStyle]}>
          <LinearGradient
            colors={['#FFA500', '#FF8C00', '#fcb63d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={loadingStyles.gradientContainer}
          >
            <LottieView
              source={require('@/assets/animations/LoadingWarp.json')}
              autoPlay
              loop
              style={loadingStyles.animation}
            />
            
            <View style={loadingStyles.contentContainer}>
              <Text style={[loadingStyles.title, { fontSize: finalFontSize + 4 }]}>
                Chat wird vorbereitet
              </Text>
              
              <Text style={[loadingStyles.message, { fontSize: finalFontSize - 2 }]}>
                {loadingMessage}
              </Text>
              
              <View style={loadingStyles.progressContainer}>
                {[1, 2, 3, 4].map((step) => (
                  <View
                    key={step}
                    style={[
                      loadingStyles.progressDot,
                      step <= loadingStep && loadingStyles.progressDotActive
                    ]}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );

  if (!selectedPost) return null;

  return (
    <View style={styles.container}>
      {/* Fixed Background Image - positioned between header and content */}
      <BackgroundImage 
        step={'modal'}
        customPosition={{ top: -110, left: 0, right: 0, bottom: 0 }}
        style={styles.fixedBackground}
      />
      <LinearGradient
        colors={['#FFA500', 'white', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      <ScrollView 
        style={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Glassy Header Card */}
        <View style={styles.headerCardContainer}>
          <BlurView intensity={100} tint="light" style={styles.headerBlurView}>
            <PostHeader
              vorname={selectedPost.vorname}
              nachname={selectedPost.nachname}
              profileImageUrl={selectedPost.profileImageUrl}
              option={selectedPost.option}
              category={selectedPost.category}
              finalFontSize={finalFontSize}
              iconSize={iconSize}
            />
          </BlurView>
        </View>

        {/* Glassy Content Card */}
        <View style={styles.contentCardContainer}>
          <BlurView intensity={30} tint="light" style={styles.contentBlurView}>
            <PostContent
              option={selectedPost.option}
              location={selectedPost.location}
              category={selectedPost.category}
              postText={selectedPost.postText}
              created_at={selectedPost.created_at}
              finalFontSize={finalFontSize}
            />
          </BlurView>
        </View>

        {/* Action Button */}
        {user?.id !== selectedPost.userId && (
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              style={styles.button}
              onPress={handleChatPressButton}
              underlayColor="transparent"
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#FFA500', '#FF8C00', '#fcb63d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.modalButton, isLoading && styles.buttonDisabled]}
              >
                <Text style={[styles.buttonText, { fontSize: finalFontSize }]}>
                  {isLoading ? 'Wird vorbereitet...' : 'Nachricht schreiben!'}
                </Text>
              </LinearGradient>
            </TouchableHighlight>
          </View>
        )}
      </ScrollView>

      <LoadingModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  scrollViewContainer: { 
    flex: 1 
  },
  scrollContent: {
    paddingBottom: 40,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0, 
    right: 0, 
    top: 0,
    height: '100%',
    zIndex: -100,
  },
  headerCardContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'orange',


 
  },
  headerBlurView: {
    padding: 20,

  },
  contentCardContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'orange',
    backgroundColor: 'white',
    marginTop:80
  },
  contentBlurView: {

    borderWidth: 1,
    borderColor: 'orange',
   
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 25,
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButton: {
    minHeight: 50,
    maxHeight: 150,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Ensure it's behind other content
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

const loadingStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    width: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'orange',
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 10,
  },
  message: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  progressDotActive: {
    backgroundColor: '#FFA500',
  },
});