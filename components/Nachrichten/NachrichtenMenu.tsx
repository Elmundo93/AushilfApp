import React from 'react';

import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';


import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { StyleSheet } from 'react-native';


const NachrichtenMenu: React.FC = () => {
  const router = useRouter();

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

 

  const handleBlockUser = () => {
    alert('Benutzer blockieren');
  };

  return (
    <Menu >
      <MenuTrigger>
        <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={24} color="black" />
      </MenuTrigger>
      <MenuOptions customStyles={{
        optionsWrapper: {


         
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
        <MenuOption onSelect={handleBlockUser} text="Benutzer blockieren" />
        <MenuOption customStyles={{
          optionText: {
            color: 'white',
            fontSize: finalFontSize,
            backgroundColor: 'red',
            padding: 10,
            fontWeight: '600',

          },
        }}
        onSelect={handleBlockUser} text="Benutzer blockieren" />
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  
});



export default React.memo(NachrichtenMenu);
