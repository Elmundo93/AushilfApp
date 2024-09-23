import React from 'react';
import { View, Text, Image, TouchableHighlight, StyleSheet } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { getCheckboxImage, getUnderlayColor } from '../utils/FilterHelpers';

interface CustomCheckboxProps {
  label: string;
  isChecked: boolean;
  onCheck: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, isChecked, onCheck }) => {
  return (
    <View style={styles.checkboxContainer}>
      <Text style={styles.checkboxLabel}>{label}</Text>
      <TouchableHighlight
        key={label}
        onPress={onCheck}
        style={[styles.checkboxBox, { backgroundColor: isChecked ? getUnderlayColor(label) : 'transparent' }]}
        underlayColor={getUnderlayColor(label)}
        activeOpacity={0.6}
      >
        <Image source={getCheckboxImage(label)} style={styles.checkboxBoxImage} resizeMode="contain" />
      </TouchableHighlight>
    </View>
  );
};

const styles = createRStyle({
  checkboxContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: '10rs',
  },
  checkboxLabel: {
    fontSize: '9rs',
    color: '#333',
    fontWeight: '500',
    position: 'absolute',
    backgroundColor: 'white',
    top: '-1rs'   
  },
  checkboxBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    margin: 10
  },
  checkboxBoxImage: {
    width: '45rs',
    height: '45rs'
  },
});

export default React.memo(CustomCheckbox);