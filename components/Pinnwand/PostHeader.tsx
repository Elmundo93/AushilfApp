import React from 'react';
import { View, Text } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { Post } from '../types/post';

interface PostHeaderProps {
  item: Post;
}

const PostHeader: React.FC<PostHeaderProps> = ({ item }) => (
  <View style={styles.header}>
    <Text style={styles.name}>
      {item.vorname} {item.nachname?.charAt(0)}.
    </Text>
    <Text style={styles.location}>{item.location}</Text>
    <Text style={styles.date}>
      {new Date(item.created_at).getDate().toString().padStart(2, '0')}.
      {(new Date(item.created_at).getMonth() + 1).toString().padStart(2, '0')}
    </Text>
  </View>
);

const styles = createRStyle({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    width: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
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
});

export default React.memo(PostHeader);