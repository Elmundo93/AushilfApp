import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileImage from '../../../components/ProfileImage/PostProfile';
import { Post } from '../../../components/types/post';
import { User } from '../../../components/types/auth';
import{ handleChatPress }from '../../../components/services/StreamChatService';


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
  const { post } = useLocalSearchParams();
  const postDetails: Post = JSON.parse(post as string);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);


 
   

    const handleChatPressButton = async () => {
      if (!currentUser) {
        Alert.alert('Fehler', 'Bitte melden Sie sich an, um eine Nachricht zu senden.');
        return;
      }
  
      try {
        const channelId = await handleChatPress(currentUser, postDetails);
        
        if (channelId) {
          router.push({
            pathname: '/nachrichten/channel/[cid]' as never,
            params: { cid: channelId }
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert('Fehler', error.message);
        } else {
          Alert.alert('Fehler', 'Ein unbekannter Fehler ist aufgetreten.');
        }
      }
    };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerProfileContainer}>
      <Text style={styles.headerText}>
          {formatName(postDetails.vorname, postDetails.nachname)}
        </Text>
        <ProfileImage imageUrl={postDetails.userProfileImage} />
        </View>
        <Text style={styles.headerText}>
          
          {`Aushilfe ${postDetails.option === 'bieten' ? 'geboten' : 'gesucht'} in ${postDetails.location} im Bereich ${postDetails.category.charAt(0).toUpperCase() + postDetails.category.slice(1)}`}
        </Text>
        
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.postText}>{postDetails.postText}</Text>
        <Text style={styles.dateText}>{formatDate(postDetails.created_at)}</Text>
      </View>
      <TouchableHighlight style={styles.button} onPress={handleChatPressButton}>
        <Text style={styles.buttonText}>Nachricht schreiben!</Text>
      </TouchableHighlight>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'center',
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
  },
  postText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    padding: 16,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});