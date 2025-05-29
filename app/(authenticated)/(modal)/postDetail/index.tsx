import React, { useEffect, useContext } from 'react';
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

import { useSelectedPostStore } from '@/components/stores/selectedPostStore';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useStreamChatStore } from '@/components/stores/useStreamChatStore';

import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { handleChatPress } from '@/components/services/StreamChat/StreamChatService';

import { PostHeader } from '@/components/PostDetails/PostHeader';
import { PostContent } from '@/components/PostDetails/PostContent';
import { useChatContext } from '@/components/provider/ChatProvider';
import { useActiveChatStore } from '@/components/stores/useActiveChatStore';
export default function PostDetail() {
  const { selectedPost } = useSelectedPostStore();
  const { user } = useAuthStore();

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

  useEffect(() => {
    if (!selectedPost) {
      router.replace('/pinnwand');
    }
  }, [selectedPost]);

  const handleChatPressButton = async () => {
    if (!user || !selectedPost) {
      Alert.alert('Fehler', 'Bitte melden Sie sich an.');
      return;
    }

    try {
      setLoading(true);

      const channel = await handleChatPress(user, selectedPost);
      if (channel) {
        setCid(channel.cid);

        // 1. Erst zur Nachrichtenübersicht wechseln
        router.replace('/nachrichten');

        // 2. Modal öffnen (kleiner Timeout, um Stack zu stabilisieren)
        setTimeout(() => {
          router.push({
            pathname: '/nachrichten/channel/[cid]',
            params: { cid: channel.cid },
          });
        }, 100);
      }
    } catch (error: any) {
      Alert.alert('Fehler', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPost) return null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContainer}>
        <LinearGradient
         colors={['orange', '#ffc300', '#ffffff']}
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
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollViewContainer: { flex: 1 },
  gradient: {
    position: 'absolute',
    left: 0, right: 0, top: 0,
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
    fontWeight: 'bold',
  },
  modalButton: {
    minHeight: 50,
    maxHeight: 150,
    borderRadius: 15,
    padding: 10,
  },
});