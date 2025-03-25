import React, { useState } from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';
import { useAuthStore } from '@/components/stores/AuthStore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Link } from 'expo-router';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileAvatarProps {
  style?: ImageStyle;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ style }) => {
  const user = useAuthStore((state) => state.user);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageSource = user?.profileImageUrl
    ? { uri: user.profileImageUrl }
    : require('@/assets/images/bienenlogo.png');

  return (
    <ShimmerPlaceholder
    visible={imageLoaded}
      style={[styles.avatar, style]}
      LinearGradient={LinearGradient}
      shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}
    >
    <Link href="/(modal)/ownProfile" asChild>   
    <TouchableOpacity onPress={() => {
      console.log('ProfileAvatar pressed');
    }}>
    <Image
      source={imageSource}
      style={[styles.avatar, style]}

      onLoadEnd={() => setImageLoaded(true)}
    />
    </TouchableOpacity>
    </Link>
    </ShimmerPlaceholder>
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