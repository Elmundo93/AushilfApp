import React, { useEffect, useState } from 'react';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { Post } from '../types/post';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { StyleSheet } from 'react-native';
import { useAuthStore } from '@/components/stores/AuthStore';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { useDeletePost } from '../Crud/Post/DeletePost';
import { supabase } from '@/components/config/supabase';
import { usePostSync } from '@/components/services/Storage/Syncs/PostSync';
import { useLocationStore } from '@/components/stores/locationStore';

interface PostMenuProps {
  item: Post;
  updateLoadingState: (isLoading: boolean) => void;
  allLoaded: boolean;
}

const PostMenu: React.FC<PostMenuProps> = ({ item, allLoaded, updateLoadingState }) => {
  const router = useRouter();
  const { setSelectedUser } = useSelectedUserStore();
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 40;
  const defaultFontSize = 36;
  const componentBaseFontSize = 32;
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const syncPosts = usePostSync();
  const { location } = useLocationStore();
  const { handleDeletePost } = useDeletePost();
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  // Melde sofort, dass das Menü geladen ist
  useEffect(() => {
    updateLoadingState(false);
  }, []);

  const handleWriteMessage = () => {
    alert('Nachricht schreiben');
  };

  const onDeletePost = () => {
    handleDeletePost(item, () => {
      updateLoadingState(true); // Optional: UI-Refresh triggern
    });
  };

  const handleViewProfile = () => {
    const userProfile = {
      userId: item.userId,
      vorname: item.vorname,
      nachname: item.nachname,
      profileImageUrl: item.profileImageUrl,
      bio: item.userBio,
    };
    setSelectedUser(userProfile);
    router.push({ pathname: '/(modal)/forreignProfile' });
  };

  const handleReportPost = () => {
    router.push({ pathname: '/(modal)/postMelden' });
  };

  

  const dynamicStyles = {
    optionText: {
      ...styles.optionText,
      fontSize: finalFontSize,
    },
    menuOptionText: {
      ...styles.menuOptionText,
      fontSize: finalFontSize,
    },
    deleteOptionText: {
      ...styles.deleteOptionText,
      fontSize: finalFontSize,
    },
  };

  return (
    <Menu style={styles.stringsButton}>
      <MenuTrigger>
        <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={24} color="black" />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsWrapper: styles.optionsWrapper,
          optionsContainer: styles.optionsContainer,
          optionWrapper: styles.optionWrapper,
          optionText: {
            ...styles.optionText,
            fontSize: finalFontSize,
          },
        }}
      >
         {user?.id !== item.userId && (
          <ShimmerPlaceholder LinearGradient={LinearGradient} visible={allLoaded} shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}>
            <MenuOption
              onSelect={handleWriteMessage}
              customStyles={{
                optionWrapper: styles.menuOptionWrapper,
                optionText: {
                  ...styles.menuOptionText,
                  fontSize: finalFontSize,
                },
              }}
              text="Nachricht schreiben"
            />
          </ShimmerPlaceholder>
         )}


        <ShimmerPlaceholder LinearGradient={LinearGradient} visible={allLoaded} shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}>
          <MenuOption
            onSelect={handleViewProfile}
            customStyles={{
              optionWrapper: styles.menuOptionWrapper,
              optionText: {
                ...styles.menuOptionText,
                fontSize: finalFontSize,
              },
            }}
            text="Profil anzeigen"
          />
        </ShimmerPlaceholder>
        {user?.id === item.userId ? (
          <ShimmerPlaceholder LinearGradient={LinearGradient} visible={allLoaded} shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}>
            <MenuOption
              onSelect={onDeletePost}
              text="Post löschen"
              customStyles={{
                optionWrapper: styles.deleteOptionWrapper,
                optionText: {
                  ...styles.deleteOptionText,
                  fontSize: finalFontSize,
                },
              }}
            >
            
            </MenuOption>
          </ShimmerPlaceholder>
        ) : (
          <ShimmerPlaceholder LinearGradient={LinearGradient} visible={allLoaded} shimmerColors={['#FFE5B4', '#FFA500', '#FFE5B4']} shimmerStyle={{ locations: [0, 0.5, 1] }}>
            <MenuOption
              onSelect={handleReportPost}
              customStyles={{
                optionWrapper: styles.deleteOptionWrapper,
                optionText: {
                  ...styles.deleteOptionText,
                  fontSize: finalFontSize,
                },
              }}
              text="Post melden"
            />
          </ShimmerPlaceholder>
        )}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  stringsButton: {
    position: 'absolute',
    bottom: 18,
  },
  optionsWrapper: {
    elevation: 5,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  optionsContainer: {
    width: 200,
    borderRadius: 10,
  },
  optionWrapper: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontWeight: '500',
  },
  menuOptionWrapper: {
    borderRadius: 10,
    marginVertical: 2,
  },
  menuOptionText: {
    color: 'black',
  },
  deleteOptionWrapper: {
    backgroundColor: 'red',
    borderRadius: 10,
    marginVertical: 2,
  },
  deleteOptionText: {
    color: 'white',

  
    fontWeight: '600',
  },
});

export default React.memo(PostMenu);