// components/Nachrichten/Costum/InitialMessageBanner.tsx

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  postVorname: string;
  postNachname: string;
  postCategory: string;
  postOption: string;
  postText: string;
  profileImageUrl?: string;
}

export const InitialMessageBanner = ({
  postVorname,
  postNachname,
  postCategory,
  postOption,
  postText,
  profileImageUrl,
}: Props) => {
  const prefix =
    postOption === 'bieten'
      ? 'bietet im Bereich'
      : postOption === 'suchen'
      ? 'sucht im Bereich'
      : '';

  const category =
    postCategory.charAt(0).toUpperCase() + postCategory.slice(1);

  return (
    <View style={styles.container}>
      {profileImageUrl && (
        <Image source={{ uri: profileImageUrl }} style={styles.avatar} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.name}>
          {postVorname} {postNachname} {prefix} <Text style={styles.category}>{category}</Text>
        </Text>
        <Text style={styles.message}>{postText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBEA',
    borderRadius: 12,
    padding: 12,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFD580',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#444',
  },
  category: {
    color: '#FF9A00',
  },
  message: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
});