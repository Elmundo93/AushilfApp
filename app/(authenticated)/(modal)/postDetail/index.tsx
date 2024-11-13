import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext } from 'react';

import { useSelectedPostStore } from '@/components/stores/selectedPostStore';
import { useAuthStore } from '@/components/stores/AuthStore';

import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { handleChatPress } from '@/components/services/StreamChat/StreamChatService';

import { Post } from '@/components/types/post';

import { PostHeader } from '@/components/PostDetails/PostHeader';
import { PostContent } from '@/components/PostDetails/PostContent';

export default function PostDetail() {
  const { selectedPost } = useSelectedPostStore();
  const router = useRouter();
  const { user } = useAuthStore();
  const { fontSize } = useContext(FontSizeContext);

  const defaultFontSize = 22;
  const componentBaseFontSize = 20;
  const maxFontSize = 50;
  const minIconSize = 30;
  const maxIconSize = 50;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  useEffect(() => {
    if (!selectedPost) {
      router.replace('/pinnwand');
    }
  }, [selectedPost]);

  const handleChatPressButton = async () => {
    if (!user) {
      Alert.alert('Fehler', 'Bitte melden Sie sich an, um eine Nachricht zu senden.');
      return;
    }

    try {
      const channelId = await handleChatPress(user, selectedPost as Post);
      if (channelId) {
        router.back();
        router.replace({
          pathname: '/nachrichten/channel/[cid]',
          params: { cid: channelId },
        });
      }
    } catch (error) {
      Alert.alert('Fehler', error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.');
    }
  };

  if (!selectedPost) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContainer}>
        <LinearGradient
          colors={['orange', 'white']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        />

        <PostHeader
          vorname={selectedPost.vorname}
          nachname={selectedPost.nachname}
          profileImageUrl={selectedPost.profileImageUrl}
          option={selectedPost.option}
          category={selectedPost.category}
          finalFontSize={finalFontSize}
          iconSize={iconSize}
        />

        <PostContent
          option={selectedPost.option}
          location={selectedPost.location}
          category={selectedPost.category}
          postText={selectedPost.postText}
          created_at={selectedPost.created_at}
          finalFontSize={finalFontSize}
        />

        {user?.id !== selectedPost.userId && (
          <TouchableHighlight 
            style={styles.button} 
            onPress={handleChatPressButton} 
            underlayColor={'transparent'}
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
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContainer: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    minHeight: 50,
    maxHeight: 150,
    borderRadius: 15,
    padding: 10,
  },
});