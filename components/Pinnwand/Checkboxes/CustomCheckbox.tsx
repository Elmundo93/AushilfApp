import React, { useContext } from 'react';
import { View, Text, Image, TouchableHighlight, StyleSheet } from 'react-native';
import { getCheckboxImage, getUnderlayColor } from '@/components/Pinnwand/utils/FilterHelpers';
import { FontSizeContext } from '@/components/provider/FontSizeContext';

interface CustomCheckboxProps {
  label: string;
  isChecked: boolean;
  onCheck: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, isChecked, onCheck }) => {
  const { fontSize } = useContext(FontSizeContext);

  // Legen Sie eine maximale Schriftgröße fest
  const maxFontSize = 18; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 24; // Ausgangsschriftgröße für das Label
 const minIconSize = 70;
  const maxIconSize = 120;
   
  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

  return (
    <View style={styles.checkboxContainer}>
      <Text style={[styles.checkboxLabel, { fontSize: finalFontSize }]}>
        {label}
      </Text>
      <TouchableHighlight
        key={label}
        onPress={onCheck}
        style={[
          styles.checkboxBox,
          { backgroundColor: isChecked ? getUnderlayColor(label) : 'transparent', width: iconSize, height: iconSize },
        ]}
        underlayColor={getUnderlayColor(label)}
        activeOpacity={0.6}
      >
        <Image
          source={getCheckboxImage(label)}
          style={[styles.checkboxBoxImage, { width: iconSize, height: iconSize }]}
          resizeMode="contain"
        />
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {

    color: '#333',
    fontWeight: '500',
    position: 'absolute',
    backgroundColor: 'white',
    top: -8,
  },
  checkboxBox: {

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    margin: 10,
  },
  checkboxBoxImage: {
    
  },
});

export default React.memo(CustomCheckbox);