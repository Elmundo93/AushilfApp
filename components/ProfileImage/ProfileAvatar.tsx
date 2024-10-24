import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';
import { useAuthStore } from '../stores/AuthStore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Link } from 'expo-router';

interface ProfileAvatarProps {
  style?: ImageStyle;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ style }) => {
  const user = useAuthStore((state) => state.user);

  const imageSource = user?.profileImageUrl
    ? { uri: user.profileImageUrl }
    : require('@/assets/images/bienenlogo.png');

  return (
    <Link href="/(modal)/ownProfile" asChild>   
    <TouchableOpacity onPress={() => {
      console.log('ProfileAvatar pressed');
    }}>
    <Image
      source={imageSource}
      style={[styles.avatar, style]}
    />
    </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
});

export default ProfileAvatar;