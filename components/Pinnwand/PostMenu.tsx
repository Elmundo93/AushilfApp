import React from 'react';
import { TouchableHighlight } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Post } from '../types/post';

interface PostMenuProps {
  item: Post;
}

const PostMenu: React.FC<PostMenuProps> = ({ item }) => {
  const router = useRouter();

  const handleWriteMessage = () => {
    alert('Nachricht schreiben');
  };

  const handleViewProfile = () => {
    router.push({
      pathname: '/',
      params: { userID: item.userId, post: JSON.stringify(item) },
    });
  };

  const handleReportPost = () => {
    const name = item?.vorname || 'Benutzer';
    alert(`${name}s Post melden`);
  };

  return (
    <Menu style={styles.stringsButton}>
      <MenuTrigger>
        <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={24} color="black" />
      </MenuTrigger>
      <MenuOptions customStyles={{
        optionsWrapper: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 15,
         
          elevation: 5,
        },
        optionsContainer: {
          width: 200,
        },
        optionWrapper: {
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        },
        optionText: {
          fontSize: 16,
          color: '#333',
          fontWeight: '500',
        },
      }}>
        <MenuOption onSelect={handleWriteMessage} text="Nachricht schreiben" />
        <MenuOption onSelect={handleViewProfile} text="Profil anzeigen" />
        <MenuOption onSelect={handleReportPost} text="Post melden" />
      </MenuOptions>
    </Menu>
  );
};

const styles = createRStyle({
  stringsButton: {
    position: 'absolute',
    bottom: 18,
  },
});

const menuOptionsStyles = {
  optionsWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15rs',
    padding: '10rs',
   
    elevation: 5,
  },
  optionsContainer: {
    width: '200rs',
  },
  optionWrapper: {
    padding: '12rs',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: '16rs',
    color: '#333',
    fontWeight: '500',
  },
  OptionTouchableComponent: TouchableHighlight,
  optionTouchable: {
    activeOpacity: 0.5,
    underlayColor: 'rgba(0,0,0,0.1)'
  }
};

export default React.memo(PostMenu);