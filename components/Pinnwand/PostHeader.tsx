import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Post } from '@/components/types/post';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { useRouter } from 'expo-router';
import { UserProfile } from '@/components/types/auth';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlaceholderAnimation } from '@/components/Animation/PlaceholderAnimation';

interface PostHeaderProps {
  item: Post;
  updateLoadingState: (isLoading: boolean) => void;
  allLoaded: boolean;
}

const PostHeader: React.FC<PostHeaderProps> = ({ item, updateLoadingState, allLoaded }) => {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 22;
  const defaultFontSize = 22; 
  const componentBaseFontSize = 20; 
  const minIconSize = 45;
  const maxIconSize = 60;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const { setSelectedUser } = useSelectedUserStore();
  const router = useRouter();
  const { fadeAnim } = usePlaceholderAnimation(allLoaded);

  const handleViewProfile = () => {
    const userProfile: UserProfile = {
      userId: item.userId,
      vorname: item.vorname,
      nachname: item.nachname,
      profileImageUrl: item.profileImageUrl,
      bio: item.userBio,
    };
    setSelectedUser(userProfile);
    router.push({ pathname: '/(modal)/forreignProfile' });
  };

  return (
    <View style={styles.header}>




            <ShimmerPlaceholder LinearGradient={LinearGradient} visible={allLoaded} style={styles.ShimmerLocation} shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}>
              <View style={styles.locationTextContainer}>
            <Text style={[styles.location, { fontSize: finalFontSize - 2 }]}>{item.location}</Text>
      
            <Text style={[styles.date, { fontSize: finalFontSize - 2 }]}>
              {new Date(item.created_at).getDate().toString().padStart(2, '0')}.
              {(new Date(item.created_at).getMonth() + 1).toString().padStart(2, '0')}
            </Text>
            </View>
            </ShimmerPlaceholder>

          <View style={styles.profileContainer}>

            <ShimmerPlaceholder LinearGradient={LinearGradient} visible={allLoaded} style={styles.ShimmerIcon} shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}>
            <TouchableOpacity onPress={handleViewProfile}>
              <Image
                source={{ uri: item.profileImageUrl }}
                style={[styles.icon, { width: iconSize, height: iconSize }]}
                onLoadEnd={() => {
                  updateLoadingState(false);
                }}
                onError={() => {
                  updateLoadingState(false);
                }}
              />
            </TouchableOpacity>
            </ShimmerPlaceholder>

            <ShimmerPlaceholder LinearGradient={LinearGradient} visible={allLoaded} style={styles.ShimmerName} shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}>
            <Text style={[styles.name, { fontSize: finalFontSize }]}>
              {item.vorname} {item.nachname?.charAt(0)}.
            </Text>
            </ShimmerPlaceholder>

          </View>

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  profileContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: -8,
    height: 25,
  },
  name: {
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: 5,
  },
  location: {
    color: '#555',
    marginRight: 5,
  },
  date: {
    color: '#555',
  },
  icon: {
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
  },

  locationTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-end',
  },

  ShimmerIcon: {
    borderRadius: 50,
    width: 50,
    height: 50,

  },
  ShimmerName: {
    flex: 1,
    marginLeft: 4,
    minWidth: 80,
    height: 30,
    borderRadius: 25,

  },
  ShimmerLocation: {
    minWidth: 100,
    height: 25,
    borderRadius: 25,
    alignSelf: 'flex-end',
  },
});

export default React.memo(PostHeader);