import React from 'react';
import { TouchableHighlight } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { Post } from '../types/post';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { StyleSheet } from 'react-native';
interface PostMenuProps {
  item: Post;
}

const PostMenu: React.FC<PostMenuProps> = ({ item }) => {
  const router = useRouter();
  const { setSelectedUser } = useSelectedUserStore();
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 28; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 24; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 22; // Ausgangsschriftgröße für das Label

  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const handleWriteMessage = () => {
    alert('Nachricht schreiben');
  };

  const handleViewProfile = () => {
    setSelectedUser(item);
    router.push({
      pathname: '/(modal)/forreignProfile',

    });
  };

  const handleReportPost = () => {
    router.push({
      pathname: '/(modal)/postMelden',
    });
  };

  return (
    <Menu style={styles.stringsButton}>
      <MenuTrigger>
        <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={24} color="black" />
      </MenuTrigger>
      <MenuOptions customStyles={{
        optionsWrapper: {

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
          fontSize: finalFontSize,
          fontWeight: '500',
        },
      }}>
        <MenuOption onSelect={handleWriteMessage} text="Nachricht schreiben" />
        <MenuOption onSelect={handleViewProfile} text="Profil anzeigen" />
        <MenuOption customStyles={{
          optionText: {
            color: 'white',
            fontSize: finalFontSize,
            backgroundColor: 'red',
            padding: 10,
            fontWeight: '600',

          },
        }}
        onSelect={handleReportPost} text="Post melden" />
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  stringsButton: {
    position: 'absolute',
    bottom: 18,
  },
});



export default React.memo(PostMenu);