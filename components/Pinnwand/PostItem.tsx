import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { useRouter } from 'expo-router';
import { Post } from '../types/post';
import PostHeader from './PostHeader';
import PostIcons from './PostIcons';
import PostMenu from './PostMenu';

interface PostItemProps {
  item: Post;
}

const PostItem: React.FC<PostItemProps> = ({ item }) => {
  const router = useRouter();

  return (
    <View>
      <View style={styles.stringscontainer}>
        <Image source={require('@/assets/images/PinnwandHeader.png')} style={styles.strings} />
        <PostMenu item={item} />
      </View>
      <View style={styles.post}>
        <PostIcons item={item} />
        <View style={styles.headerContainerPost}>
          <PostHeader item={item} />
          <View style={styles.postContainer}>
            <Text style={styles.postText} numberOfLines={3}>
              {item.postText}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: '/(modal)/einstellungen',
                  params: { postID: item.id, post: JSON.stringify(item) },
                })
              }
            >
              <Text style={styles.buttonText}>Beitrag ansehen!</Text>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    
    elevation: 3,
  },
  headerContainerPost: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
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
    lineHeight: 20,
    color: '#333',
    textAlign: 'left',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
});

export default React.memo(PostItem);