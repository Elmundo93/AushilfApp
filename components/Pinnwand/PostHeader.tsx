import React from 'react';
import { View, Text } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { Post } from '@/components/types/post'; 
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
      profileImageUrl: item.profileImageUrl,
      userBio: item.userBio,
    };
  
    setSelectedUser(userProfile);
    router.push({
      pathname: '/(modal)/forreignProfile',
    });
  };


  return (
    <View style={styles.header}>


        
          <View style={styles.locationContainer}>
            <Text style={[styles.location, { fontSize: finalFontSize -2}]}>{item.location}</Text>
            <Text style={[styles.date, { fontSize: finalFontSize -2 }]}>
              {new Date(item.created_at).getDate().toString().padStart(2, '0')}.
              {(new Date(item.created_at).getMonth() + 1).toString().padStart(2, '0')}
            </Text>

        </View>
        <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleViewProfile}>
            <Image 
              source={{ uri: item.profileImageUrl }} 
              style={[styles.icon, { width: iconSize, height: iconSize }]} 
            />
          </TouchableOpacity>
        <Text style={[styles.name, { fontSize: finalFontSize }]}>
          {item.vorname} {item.nachname?.charAt(0)}.
        </Text>
        </View>
    </View>
  );
}
  const styles = createRStyle({
    header: {
      width: '100%',
      marginBottom: 5,
    },
    profileContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',

    },
    
    locationContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap:5,
      marginVertical: -8,
    },
    name: {
      fontWeight: 'bold',
      marginLeft: 15,// Adjust this value based on your icon size
      marginTop: 5,
    },
    location: {
      color: '#555',
    },
    date: {
      color: '#555',
    },
    icon: {
      borderRadius: 50,
    },
  });

export default React.memo(PostHeader);