import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';

interface ProfileAvatarProps {
  style?: ImageStyle;
  imageUri?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ style, imageUri }) => {
  return (
    <Image
      source={imageUri ? { uri: imageUri } : require('@/assets/images/bienenlogo.png')}
      style={[styles.avatar, style]}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default ProfileAvatar;