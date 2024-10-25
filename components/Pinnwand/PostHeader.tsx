import React from 'react';
import { View, Text } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { Post } from '../types/post'; 
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { useRouter } from 'expo-router';
import { UserProfile } from '@/components/types/auth';
interface PostHeaderProps {
  item: Post;
}

const PostHeader: React.FC<PostHeaderProps> = ({ item }) => {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 22;
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 20; // Ausgangsschriftgröße für das Label
  const minIconSize = 45;
  const maxIconSize = 60;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  // Berechnung der angepassten Schriftgröße
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const { setSelectedUser } = useSelectedUserStore();
  const router = useRouter();

  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const handleViewProfile = () => {
    const userProfile: UserProfile = {

      userId: item.userId,
      vorname: item.vorname,
      nachname: item.nachname,
      profileImage: item.profileImage,
      userBio: item.userBio,
    };
  
    setSelectedUser(userProfile);
    router.push({
      pathname: '/(modal)/forreignProfile',
    });
  };



  return (
  <View style={styles.header}>
     <TouchableOpacity onPress={handleViewProfile}>
    <Image 
      source={{ uri: item.profileImage }} 
      style={[styles.icon, { width: iconSize, height: iconSize }]} 
    />
  </TouchableOpacity>
    <Text style={[styles.name, { fontSize: finalFontSize }]}>
      {item.vorname} {item.nachname?.charAt(0)}.
    </Text>
    <Text style={[styles.location, { fontSize: finalFontSize -2}]}>{item.location}</Text>
    <Text style={[styles.date, { fontSize: finalFontSize -2 }]}>
      {new Date(item.created_at).getDate().toString().padStart(2, '0')}.
      {(new Date(item.created_at).getMonth() + 1).toString().padStart(2, '0')}
    </Text>
    </View>
  );
};

const styles = createRStyle({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    width: '100%',
  },
  name: {

    fontWeight: 'bold',
    flex: 1,
    alignSelf: 'center',
    marginLeft: 10,
  },
  location: {
    fontSize: 12,
    color: '#555',
    marginLeft: 'auto',
  },
  date: {
    fontSize: 12,
    color: '#555',
    marginLeft: 10,
  },

  icon: {
   
    marginBottom: 5,
    borderRadius: 50,
  },
});

export default React.memo(PostHeader);