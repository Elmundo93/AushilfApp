import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';

interface ProfileImageProps {
  style?: ImageStyle;
  imageUrl: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ style, imageUrl }) => {
  return (
    <Image
      source={imageUrl ? { uri: imageUrl } : require('@/assets/images/bienenlogo.png')}
      style={[styles.avatar, style]} // Stile zusammenführen
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
});

export default ProfileImage;