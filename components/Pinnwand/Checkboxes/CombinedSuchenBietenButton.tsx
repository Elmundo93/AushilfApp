import React, { useContext } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUnderlayColor } from '@/components/Pinnwand/utils/FilterHelpers';

interface CombinedSuchenBietenButtonProps {
  suchenChecked: boolean;
  bietenChecked: boolean;
  onSuchenPress: () => void;
  onBietenPress: () => void;
  width?: number;
}

const CombinedSuchenBietenButton: React.FC<CombinedSuchenBietenButtonProps> = ({
  suchenChecked,
  bietenChecked,
  onSuchenPress,
  onBietenPress,
  width,
}) => {
  const { fontSize } = useContext(FontSizeContext);

  const baseFontSize = 18;
  const defaultFontSize = 22;
  const adjustedFontSize = (fontSize / defaultFontSize) * baseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, 18);

  const suchenColor = getUnderlayColor('Suchen');
  const bietenColor = getUnderlayColor('Bieten');

  // Calculate dynamic width based on text length and font size
  const suchenText = "Suchen";
  const bietenText = "Bieten";
  const estimatedCharWidth = finalFontSize * 0.6; // Approximate width per character
  const padding = 24; // Horizontal padding for each half
  const iconWidth = 20; // Space for icon when active
  const dividerWidth = 1; // Width of the divider
  
  const suchenWidth = suchenText.length * estimatedCharWidth + padding + (suchenChecked ? iconWidth : 0);
  const bietenWidth = bietenText.length * estimatedCharWidth + padding + (bietenChecked ? iconWidth : 0);
  
  const totalWidth = suchenWidth + bietenWidth + dividerWidth;
  const dynamicWidth = width || Math.max(200, totalWidth); // Minimum width of 200

  return (
    <View style={[styles.container, { width: dynamicWidth }]}>
      {/* Suchen Half */}
      <TouchableOpacity
        onPress={onSuchenPress}
        activeOpacity={0.7}
        style={[
          styles.halfButton,
          styles.leftHalf,
          {
            backgroundColor: suchenChecked ? suchenColor : '#ffffff',
            borderColor: suchenChecked ? suchenColor : 'rgba(0, 0, 0, 0.2)',
            shadowColor: suchenChecked ? suchenColor : '#000',
            shadowOffset: {
              width: 0,
              height: suchenChecked ? 2 : 1,
            },
            shadowOpacity: suchenChecked ? 0.3 : 0.1,
            shadowRadius: suchenChecked ? 4 : 2,
            elevation: suchenChecked ? 4 : 2,
          },
        ]}
      >
        <Text 
          style={[
            styles.label, 
            { 
              fontSize: finalFontSize,
              color: suchenChecked ? '#fff' : '#333',
              fontWeight: suchenChecked ? '600' : '500',
            }
          ]}
          numberOfLines={1}

        >
          Suchen
        </Text>
        {suchenChecked && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="check-circle" 
              size={16} 
              color="#fff" 
              style={styles.icon} 
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bieten Half */}
      <TouchableOpacity
        onPress={onBietenPress}
        activeOpacity={0.7}
        style={[
          styles.halfButton,
          styles.rightHalf,
          {
            backgroundColor: bietenChecked ? bietenColor : '#ffffff',
            borderColor: bietenChecked ? bietenColor : 'rgba(0, 0, 0, 0.2)',
            shadowColor: bietenChecked ? bietenColor : '#000',
            shadowOffset: {
              width: 0,
              height: bietenChecked ? 2 : 1,
            },
            shadowOpacity: bietenChecked ? 0.3 : 0.1,
            shadowRadius: bietenChecked ? 4 : 2,
            elevation: bietenChecked ? 4 : 2,
          },
        ]}
      >
        <Text 
          style={[
            styles.label, 
            { 
              fontSize: finalFontSize,
              color: bietenChecked ? '#fff' : '#333',
              fontWeight: bietenChecked ? '600' : '500',
            }
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Bieten
        </Text>
        {bietenChecked && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="check-circle" 
              size={16} 
              color="#fff" 
              style={styles.icon} 
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  halfButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  leftHalf: {
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  rightHalf: {
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  label: {
    fontWeight: '500',
    textAlign: 'center',
  },
  iconContainer: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  icon: {
    marginLeft: 0,
  },
});

export default React.memo(CombinedSuchenBietenButton); 