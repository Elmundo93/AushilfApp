import React, { useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import BackgroundImage from '@/components/Onboarding/OnboardingBackground';

import { useSelectedPostStore } from '@/components/stores/selectedPostStore';
import { useAuthStore } from '@/components/stores/AuthStore';

import { FontSizeContext } from '@/components/provider/FontSizeContext';

import { PostHeader } from '@/components/PostDetails/PostHeader';
import { PostContent } from '@/components/PostDetails/PostContent';
import { useChatContext } from '@/components/provider/ChatProvider';

export default function PostDetail() {
  const { selectedPost } = useSelectedPostStore();
  const { user } = useAuthStore();

  const { initializeChatWithPost } = useChatContext();
  const router = useRouter();
  const { fontSize } = useContext(FontSizeContext);

  const finalFontSize = Math.min((fontSize / 22) * 20, 50);
  const iconSize = Math.min(Math.max(fontSize * 1.5, 30), 50);

  useEffect(() => {
    if (!selectedPost) {
      router.replace('/pinnwand');
    }
  }, [selectedPost]);



  // Use the navigation service through ChatProvider
  const handleChatPressButton = async () => {
    if (!user || !selectedPost) {
      Alert.alert('Fehler', 'Bitte melden Sie sich an.');
      return;
    }

    console.log('🔍 PostDetail: Button pressed, starting chat initialization...');

    try {
      console.log('🎬 PostDetail: Starting chat initialization...');
      const channelCid = await initializeChatWithPost(user, selectedPost, {
        showLoading: true,
        onError: (errorMessage) => {
          console.error('❌ PostDetail: Error in chat initialization:', errorMessage);
          Alert.alert('Fehler', errorMessage);
        },
        onSuccess: (cid) => {
          console.log('✅ PostDetail: Chat initialized successfully:', cid);
        }
      });

      if (!channelCid) {
        throw new Error('Chat konnte nicht initialisiert werden');
      }

    } catch (error: any) {
      console.error('❌ Error in handleChatPressButton:', error);
      Alert.alert('Fehler', error.message);
    }
  };

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
            >
              <LinearGradient
                colors={['#FFA500', '#FF8C00', '#fcb63d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalButton}
              >
                <Text style={[styles.buttonText, { fontSize: finalFontSize }]}>
                  Nachricht schreiben!
                </Text>
              </LinearGradient>
            </TouchableHighlight>
          </View>
        )}
        

      </ScrollView>
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