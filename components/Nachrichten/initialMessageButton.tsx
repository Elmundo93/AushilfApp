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
  fontSize: number;
}

export const InitialMessageBanner = ({
  postVorname,
  postNachname,
  postCategory,
  postOption,
  postText,
  profileImageUrl,
  fontSize,
}: Props) => {
  const prefix =
    postOption === 'bieten'
      ? 'bietet im Bereich'
      : postOption === 'suchen'
      ? 'sucht im Bereich'
      : '';

  const category =
    postCategory.charAt(0).toUpperCase() + postCategory.slice(1);

  // Dynamische Größen basierend auf fontSize
  const dynamicFontSize = Math.max(fontSize - 8, 12);
  const dynamicPadding = Math.max(fontSize * 0.8, 16);
  const dynamicMinHeight = Math.max(fontSize * 4, 100);
  const dynamicAvatarSize = Math.max(fontSize * 2.5, 42);
  const dynamicLineHeight = Math.max(fontSize * 1.2, 18);

  return (
    <View style={[styles.container, { 
      padding: dynamicPadding,
      minHeight: dynamicMinHeight 
    }]}>
      {profileImageUrl && (
        <Image 
          source={{ uri: profileImageUrl }} 
          style={[styles.avatar, { 
            width: dynamicAvatarSize, 
            height: dynamicAvatarSize,
            borderRadius: dynamicAvatarSize / 2,
            marginRight: dynamicPadding * 0.75
          }]} 
        />
      )}
      <View style={styles.textContainer}>
        <Text 
          style={[styles.name, { 
            fontSize: dynamicFontSize,
            lineHeight: dynamicLineHeight,
            marginBottom: dynamicPadding * 0.5
          }]}
        >
          {postVorname} {postNachname} {prefix} <Text style={styles.category}>{category}</Text>
        </Text>
        <Text 
          style={[styles.message, { 
            fontSize: dynamicFontSize,
            lineHeight: dynamicLineHeight
          }]}
        >
          {postText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBEA',
    borderRadius: 12,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFD580',
  },
  avatar: {
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  name: {
    fontWeight: '600',
    color: '#444',
  },
  category: {
    color: '#FF9A00',
    fontWeight: '600',
  },
  message: {
    color: '#555',
  },
});