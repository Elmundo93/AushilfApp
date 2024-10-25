import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelectedPostStore } from '@/components/stores/selectedPostStore';
import ProfileImage from '@/components/ProfileImage/PostProfile';
import { User } from '@/components/types/auth';
import { handleChatPress } from '@/components/services/StreamChatService';
import { Post } from '@/components/types/post';
import { useAuthStore } from '@/components/stores/AuthStore';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Animated } from 'react-native';

const formatName = (vorname: string, nachname: string) => {
  return `${vorname} ${nachname.charAt(0)}.`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);
  return `${day}.${month}.${year}`;
};

export default function PostDetail() {
  const { selectedPost } = useSelectedPostStore();
  const router = useRouter();
  const { user } = useAuthStore();
  const { fontSize } = useContext(FontSizeContext);
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 20; // Ausgangsschriftgröße für das Label
  const maxFontSize = 50; // Passen Sie diesen Wert nach Bedarf an
  const minIconSize = 30;
  const maxIconSize = 50;
  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);




  useEffect(() => {
    if (!selectedPost) {
      // If no post is selected, navigate back or show an error
      router.replace('/pinnwand');
    }
  }, [selectedPost]);

  const handleChatPressButton = async () => {
    if (!user) {
      Alert.alert('Fehler', 'Bitte melden Sie sich an, um eine Nachricht zu senden.');
      return;
    }

    try {


      console.log('selectedPost', selectedPost);
      console.log('user', user);
      const channelId = await handleChatPress(user, selectedPost as Post);
      console.log('channelId', channelId);
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
    return null; // Or a loading indicator
  }

  const postDetails = selectedPost;

  return (
    <View style={styles.container}>
     
    <ScrollView style={styles.scrollViewContainer}>
    <LinearGradient
        colors={['orange', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.headerContainer}>
        <View style={styles.headerProfileContainer}>
          <Text style={[styles.headerText, { fontSize: finalFontSize }]}>{formatName(postDetails.vorname, postDetails.nachname)}</Text>
          <ProfileImage imageUrl={postDetails.profileImage}  />

        </View>
      
      </View>

      <View style={styles.contentContainer}>
      <Text style={[styles.headerText, { fontSize: finalFontSize }]}>
          {`Aushilfe ${postDetails.option === 'bieten' ? 'geboten' : 'gesucht'} in ${
            postDetails.location
          } im Bereich ${postDetails.category.charAt(0).toUpperCase() + postDetails.category.slice(1)}`}
        </Text>
        <View style={styles.trenner}></View>
        <Text style={[styles.postText, { fontSize: finalFontSize }]}>{postDetails.postText}</Text>
        <Text style={[styles.dateText, { fontSize: finalFontSize }]}>{formatDate(postDetails.created_at)}</Text>
      </View>
      <TouchableHighlight style={styles.button} onPress={handleChatPressButton} underlayColor={'transparent'}>
        <LinearGradient
            colors={['#FFA500', '#FF8C00', '#fcb63d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalButton}
          >
        <Text style={[styles.buttonText, { fontSize: finalFontSize }]}>Nachricht schreiben!</Text>
        </LinearGradient>
      </TouchableHighlight>
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
  scrollViewContent: {
    flexGrow: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200, // Oder die gewünschte Höhe
  },
  contentWrapper: {
    padding: 16,
    paddingTop: 200, // Sollte der Höhe des Gradients entsprechen
  },
  headerContainer: {
    marginVertical: 16,
  },
  headerProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'center',
  },
  trenner: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    marginVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 18,
    color: 'gray',
  },
  contentContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,

    
  },
  postText: {
    fontSize: 16,
    alignSelf: 'center',
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
    alignSelf: 'flex-end',
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
