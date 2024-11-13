import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { CATEGORIES, getBackgroundForCategory, getIconForCategory } from '@/components/Pinnwand/utils/CategoryAndOptionUtils';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
  iconSize: number;
}

export const CategoryFilter = ({ selectedCategory, onSelectCategory, iconSize }: CategoryFilterProps) => (
  <View style={styles.filterContainer}>
    {CATEGORIES.map((category) => (
      <TouchableOpacity
        key={category}
        onPress={() => onSelectCategory(category)}
        style={[
          styles.iconContainer,
          selectedCategory === category && getBackgroundForCategory(category),
        ]}
      >
        <Image 
          source={getIconForCategory(category)} 
          style={[styles.icon, { width: iconSize, height: iconSize }]} 
        />
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
      },
      filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allow icons to wrap to next line if needed
        justifyContent: 'space-evenly', // More even spacing
        padding: 10,
        backgroundColor: 'white',
      },
      iconContainer: {
        flex: 1, // Take up available space
        minWidth: 50, // Minimum width to prevent too small icons
        maxWidth: 100, // Maximum width to prevent too large icons
        aspectRatio: 1, // Keep square shape
        margin: 5, // Add some spacing between icons
        alignItems: 'center', // Center icon horizontally
        justifyContent: 'center', // Center icon vertically
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 25,
      },
      selectedIconContainer: {
        backgroundColor: 'lightblue',
      },
      icon: {
        minWidth: 20,
        maxWidth: 50,
        minHeight: 20,
        maxHeight: 50,
      },

});