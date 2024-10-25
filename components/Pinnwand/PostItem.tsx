import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { useRouter } from 'expo-router';
import { Post } from '../types/post';
import PostHeader from './PostHeader';
import PostIcons from './PostIcons';
import PostMenu from './PostMenu';
import { useSelectedPostStore } from '../stores/selectedPostStore'; 
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { LinearGradient } from 'expo-linear-gradient';

interface PostItemProps {
  item: Post;
}

const PostItem: React.FC<PostItemProps> = ({ item }) => {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 24; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 28; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 22; // Ausgangsschriftgröße für das Label
  const minIconSize = 45;
  const maxIconSize = 60;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const router = useRouter();
  const { setSelectedPost } = useSelectedPostStore();

  return (
    <View >
      <View style={styles.stringscontainer}>
        <Image source={require('@/assets/images/PinnwandHeader.png')} style={styles.strings} />
        <PostMenu item={item} />
      </View>
      <View style={styles.post}>
        <View style={styles.postInside}>
        <PostHeader item={item} />
        
        <View style={styles.headerContainerPost}>
          <PostIcons item={item} />
          <View style={[styles.postContainer, { height: iconSize *2 }]}>
            <Text style={[styles.postText, { fontSize: finalFontSize }]} numberOfLines={4}>
              {item.postText}
            </Text>
          </View>
          </View>
          <View style={styles.buttonContainer}>
          <TouchableOpacity
  style={styles.button}
  onPress={() => {
    setSelectedPost(item); // Set the selected post in the store
    router.push('/(modal)/postDetail'); // Navigate without params
  }}
>
 <LinearGradient
            colors={['#FFA500', '#FF8C00', '#fcb63d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalButton}
          >
              <Text style={[styles.buttonText, { fontSize: finalFontSize +3 }]}>Beitrag ansehen!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </View>
      </View>
      
    </View>
  );
};

const styles = createRStyle({
  stringscontainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,

  },
  strings: {
    width: 100,
    height: 50,
    position: 'absolute',
    bottom: 0,
  },
  post: {
    
    width: '95%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    overflow: 'hidden',
    borderRadius: 50,
  },
  postInside: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 15,
    borderRadius: 50,
    marginVertical: 10,



    
    elevation: 3,
  },
  headerContainerPost: {
    flex: 1,
    flexDirection: 'row',

  },
  postContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',

 
    elevation: 3,
    width: '100%',
  },
  postText: {
    fontSize: 14,
    lineHeight: 25,
    color: '#333',
    textAlign: 'left',

  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  button: {

    padding: 10,
    borderRadius: 5,
    shadowColor: 'orange',

    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  modalButton: {

    minHeight: 50,
    maxHeight: 150,
    borderRadius: 5,
    padding: 10,
  },
});

export default React.memo(PostItem);