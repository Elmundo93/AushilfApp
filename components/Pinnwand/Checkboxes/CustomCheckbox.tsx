import React, { useContext } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUnderlayColor } from '@/components/Pinnwand/utils/FilterHelpers';

interface CustomCheckboxProps {
  label: string;
  isChecked: boolean;
  onCheck: () => void;
  width?: number;
  position?: 'left' | 'right';
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, isChecked, onCheck, width, position }) => {
  const { fontSize } = useContext(FontSizeContext);

  const baseFontSize = 18;
  const defaultFontSize = 22;
  const adjustedFontSize = (fontSize / defaultFontSize) * baseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, 18);

  // Calculate border radius based on position
  const getBorderRadius = () => {
    if (position === 'left') {
      return { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 20, borderBottomRightRadius: 20 };
    } else if (position === 'right') {
      return { borderTopLeftRadius: 20, borderBottomLeftRadius: 20, borderTopRightRadius: 0, borderBottomRightRadius: 0 };
    }
    return { borderRadius: 20 };
  };

  return (
    <TouchableOpacity
      onPress={onCheck}
      activeOpacity={0.7}
              style={[
          styles.chip,
          getBorderRadius(),
          {
            backgroundColor: isChecked ? getUnderlayColor(label) : '#ffffff',
            borderColor: isChecked ? getUnderlayColor(label) : 'rgba(0, 0, 0, 0.2)',
            shadowColor: isChecked ? getUnderlayColor(label) : '#000',
            shadowOffset: {
              width: 0,
              height: isChecked ? 2 : 1,
            },
            shadowOpacity: isChecked ? 0.3 : 0.1,
            shadowRadius: isChecked ? 4 : 2,
            elevation: isChecked ? 4 : 2,
            width: width || 100,
            paddingHorizontal: isChecked ? 40 : 20, // More space when checked for the tick
          },
        ]}
    >
      <Text 
        style={[
          styles.label, 
          { 
            fontSize: finalFontSize,
            color: isChecked ? (label === 'Gastro' ? '#000' : '#fff') : '#333',
            fontWeight: isChecked ? '600' : '500',
          }
        ]}
      >
        {label}
      </Text>
      <View style={[styles.iconContainer, { opacity: isChecked ? 1 : 0 }]}>
        <MaterialCommunityIcons 
          name="check-circle" 
          size={22} 
          color={label === 'Gastro' ? '#000' : '#fff'} 
          style={styles.icon} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1.5,
    height: 40,
  },
  label: {
    fontWeight: '500',
    textAlign: 'center',
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 8,
  },
});

export default React.memo(CustomCheckbox);