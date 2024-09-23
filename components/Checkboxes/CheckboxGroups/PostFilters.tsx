import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import CustomCheckbox from '../CustomCheckboxPost';
import { useState } from 'react';
import { createRStyle } from 'react-native-full-responsive';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PostFiltersProps } from '../../types/checkbox';



  

const PostFilters: React.FC<PostFiltersProps>  = ({ onOptionChange, onCategoryChange }) => {


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
           <View style={styles.ichContainer}>
          <Text style={styles.ichHeader}>Ich</Text>
           <View style={styles.ichButtonContainer}>
            
            
            <TouchableOpacity 
             
              style={[styles.sucheButton, {
                backgroundColor: suchenChecked ? 'orange' : 'white'
              }]} 
              onPress={() => {
               handleSuchenBietenChange('suchen');
              }}
            >
              <Text>Suchen</Text>
              </TouchableOpacity>
            
<TouchableOpacity
 
  style={[styles.bieteAnButton, { backgroundColor: bietenChecked ? 'green' : 'white'}]}
  onPress={() => {
    handleSuchenBietenChange('bieten');
  }}
>
  <Text style={{color: bietenChecked ? 'white' : 'black'}}>Biete an</Text>
</TouchableOpacity>





</View>
</View>
            
            
            
              <View style={styles.imBereichHeaderContainer}>
            <Text style={styles.imBereichHeader}>Im Bereich</Text>
</View >
<View style={styles.imBereichContainer}>
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
        </KeyboardAvoidingView>
);
};

const styles = createRStyle({
    container: {
        
        flexWrap: 'wrap',

        flexDirection: 'row',
       
       
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10    },

        ichContainer: {
            flexDirection: 'column', 
            position: 'relative',
            backgroundColor: 'white',
            marginTop: '-25rs'
          },
          ichButtonContainer: {
            flexDirection: 'row', 
            justifyContent: 'space-between',
            position: 'relative',
            backgroundColor: 'white'
          },
        
          ichHeader: {
            fontSize: '20rs', fontWeight: 'bold', 
            textAlign: 'center',
            zIndex: 1000
          },
            
          sucheButton: {
              
              borderStyle:'solid', 
              borderWidth: '1rs', 
              borderColor: 'gray', 
              borderRadius:25,
              paddingVertical:'10rs', 
              paddingHorizontal:'35rs',
              marginRight: '10rs',
            },
        
            bieteAnButton: {
              borderStyle:'solid', 
              borderWidth: '1rs', 
              borderColor: 'gray', 
              borderRadius:'25rs', 
              paddingVertical:'10rs', 
              paddingHorizontal:'35rs',
              marginLeft: '10rs',
            },
        
        imBereichContainer: {
              justifyContent: 'center',
              flexWrap: 'wrap',
              flexDirection: 'row', 
              position: 'relative',
              backgroundColor: 'white',
              
            },
            
            imBereichHeaderContainer: {
              marginTop: '28rs',
              backgroundColor: 'white'
            },
          
        imBereichHeader: {
              fontSize: '20rs',
               fontWeight: 'bold',
                marginBottom: '10rs',
                textAlign:'center',
                zIndex: 1000},
});

export default PostFilters;