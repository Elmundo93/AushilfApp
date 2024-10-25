import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import CustomCheckbox from '../CustomCheckboxPost';
import { useState } from 'react';
import { createRStyle } from 'react-native-full-responsive';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PostFiltersProps } from '../../types/checkbox';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { StyleSheet } from 'react-native';


  

const PostFilters: React.FC<PostFiltersProps>  = ({ onOptionChange, onCategoryChange }) => {
  const { fontSize } = useContext(FontSizeContext);
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 18; // Ausgangsschriftgröße für das Label
  const maxFontSize = 28; // Passen Sie diesen Wert nach Bedarf an
  const minWidth = 100; // Minimale Breite
  const maxWidth = 150; // Maximale Breite
  const minHeight = 40; // Minimale Höhe
  const maxHeight = 60; // Maximale Höhe
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);  
  const adjustedWidth = Math.min(Math.max(fontSize * 4, minWidth), maxWidth);
  const adjustedHeight = Math.min(Math.max(fontSize * 2, minHeight), maxHeight);
  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  


    const [suchenChecked, setSuchenChecked] = useState(false);
    const [bietenChecked, setBietenChecked] = useState(false);
    const [gartenChecked, setGartenChecked] = useState(false);
    const [haushaltChecked, setHaushaltChecked] = useState(false);
    const [sozialesChecked, setSozialesChecked] = useState(false);
    const [gastroChecked, setGastroChecked] = useState(false);
  
    const handleSuchenBietenChange = (option: string) => {
      if (option === 'suchen') {
        setSuchenChecked(!suchenChecked);
        setBietenChecked(false);
        onOptionChange(option);
      } else if (option === 'bieten') {
        setSuchenChecked(false);
        setBietenChecked(!bietenChecked);
        onOptionChange(option);
      }
    };
  
    const handleCategoryChange = (category: string) => {
      const isAlreadyChecked = { garten: gartenChecked, haushalt: haushaltChecked, soziales: sozialesChecked, gastro: gastroChecked }[category];
      setGartenChecked(category === 'garten' ? !isAlreadyChecked : false);
      setHaushaltChecked(category === 'haushalt' ? !isAlreadyChecked : false);
      setSozialesChecked(category === 'soziales' ? !isAlreadyChecked : false);
      setGastroChecked(category === 'gastro' ? !isAlreadyChecked : false);
      onCategoryChange(category);
    };
      
     

    return (
      <KeyboardAvoidingView style={styles.container}>
        <Text style={[{ fontSize: finalFontSize +12 }, {marginBottom:50, alignSelf: 'center'}]}>Verfasse deinen Beitrag!
        </Text>
        <View style={styles.contentWrapper}>
          
          <View style={styles.ichContainer}>
          
            <Text style={[styles.ichHeader, { fontSize: finalFontSize +12 }]}>Ich</Text>
            <View style={styles.ichButtonContainer}>
              <TouchableOpacity 
                style={[styles.sucheButton, {
                  backgroundColor: suchenChecked ? 'green' : 'white',
                  width: adjustedWidth,
                  height: adjustedHeight
                }]} 
                onPress={() => {
                  handleSuchenBietenChange('suchen');
                }}
              >
                <Text style={[{ fontSize: finalFontSize, color: suchenChecked ? 'white' : 'black', fontWeight: '600' }]}>Suche</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.bieteAnButton, {
                  backgroundColor: bietenChecked ? 'rgb(184,0,211)' : 'white',
                  width: adjustedWidth,
                  height: adjustedHeight
                }]}
                onPress={() => {
                  handleSuchenBietenChange('bieten');
                }}
              >
                <Text style={[{ fontSize: finalFontSize }, {color: bietenChecked ? 'white' : 'black', fontWeight: '600'}]}>Biete an</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.imBereichContainer}>
            <View style={styles.imBereichHeaderContainer}>
              <Text style={[styles.imBereichHeader, { fontSize: finalFontSize +12 }]}>Im Bereich</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CustomCheckbox
                label="Garten"
                isChecked={gartenChecked}
                onCheck={() => handleCategoryChange('garten')}
              />
              <CustomCheckbox
                label="Haushalt"
                isChecked={haushaltChecked}
                onCheck={() => handleCategoryChange('haushalt')}
              />
              <CustomCheckbox
                label="Soziales"
                isChecked={sozialesChecked}
                onCheck={() => handleCategoryChange('soziales')}
              />
              <CustomCheckbox
                label="Gastro"
                isChecked={gastroChecked}
                onCheck={() => handleCategoryChange('gastro')}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  contentWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    paddingVertical: 20,
    marginTop: -25,
    borderRadius: 25,
  },
  ichContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',

    width: '100%',
  },
  ichButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
  ichHeader: {
    fontWeight: 'bold',
    textAlign: 'center',

  },
  sucheButton: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bieteAnButton: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  imBereichContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: 'white',
  },
  imBereichHeaderContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imBereichHeader: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    zIndex: 1000,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default PostFilters;