import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createRStyle } from 'react-native-full-responsive';
import { FilterAccordionProps } from '@/components/types/components';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { usePostStore } from '@/components/stores/postStore';
import { BlurView } from 'expo-blur';
import CustomCheckbox from '../Checkboxes/CustomCheckbox';
import CombinedSuchenBietenButton from '../Checkboxes/CombinedSuchenBietenButton';

const FilterAccordion: React.FC<FilterAccordionProps> = React.memo(({ isExpanded, onToggle }) => {
  const { fontSize } = useContext(FontSizeContext);
  const { filters, setFilters } = usePostStore();

  const maxFontSize = 38;
  const defaultFontSize = 24;
  const baseFontSize = 24;

  const adjustedFontSize = (fontSize / defaultFontSize) * baseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  // Calculate dynamic width based on longest category name
  const categories = ['Garten', 'Haushalt', 'Soziales', 'Gastro', 'Handwerk', 'Bildung'];
  const longestCategory = categories.reduce((longest, current) => 
    current.length > longest.length ? current : longest
  );
  
  // Estimate width based on character count and font size
  const estimatedCharWidth = finalFontSize * 0.6; // Approximate width per character
  const padding = 32; // Horizontal padding
  const iconWidth = 26; // Space for icon
  const dynamicWidth = Math.max(100, longestCategory.length * estimatedCharWidth + padding + iconWidth);

  const handleSuchenBietenChange = (option: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilters({
      suchenChecked: option === 'suchen' ? !filters.suchenChecked : false,
      bietenChecked: option === 'bieten' ? !filters.bietenChecked : false,
    });
  };

  const handleCategoryChange = (category: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilters({
      categories: {
        ...filters.categories,
        [category]: !filters.categories[category],
      },
    });
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.blurContainer}>
        <BlurView intensity={30} tint="light" style={styles.blurView}>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                onToggle();
              }}
              style={styles.accordHeader}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <View style={styles.headerContent}>
                <Text style={[styles.accordTitle, { fontSize: finalFontSize }]}>Filter</Text>
                <MaterialCommunityIcons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={32}
                  color="#333"
                />
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.filterGroup}>
                <View style={styles.chipRow}>
                  <CombinedSuchenBietenButton
                    suchenChecked={filters.suchenChecked}
                    bietenChecked={filters.bietenChecked}
                    onSuchenPress={() => handleSuchenBietenChange('suchen')}
                    onBietenPress={() => handleSuchenBietenChange('bieten')}
                  />
                </View>

                <View style={styles.categoriesContainer}>
                  <View style={styles.categoryRow}>
                    {['Garten', 'Haushalt'].map((category, index) => (
                      <CustomCheckbox
                        key={category}
                        label={category}
                        isChecked={filters.categories[category.toLowerCase()]}
                        onCheck={() => handleCategoryChange(category.toLowerCase())}
                        width={dynamicWidth}
                        position={index === 0 ? 'left' : 'right'}
                      />
                    ))}
                  </View>
                  <View style={styles.categoryRow}>
                    {['Soziales', 'Gastro'].map((category, index) => (
                      <CustomCheckbox
                        key={category}
                        label={category}
                        isChecked={filters.categories[category.toLowerCase()]}
                        onCheck={() => handleCategoryChange(category.toLowerCase())}
                        width={dynamicWidth}
                        position={index === 0 ? 'left' : 'right'}
                      />
                    ))}
                  </View>
                  <View style={styles.categoryRow}>
                    {['Handwerk', 'Bildung'].map((category, index) => (
                      <CustomCheckbox
                        key={category}
                        label={category}
                        isChecked={filters.categories[category.toLowerCase()]}
                        onCheck={() => handleCategoryChange(category.toLowerCase())}
                        width={dynamicWidth}
                        position={index === 0 ? 'left' : 'right'}
                      />
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        </BlurView>
      </View>
    </View>
  );
});

const styles = createRStyle({
  outerContainer: {
    width: 'auto',
    minWidth: '200rs',
    maxWidth: '90%',
    alignSelf: 'center',
    marginTop: '8rs',
    paddingHorizontal: '8rs',
    zIndex: 999, // Lower than header
    elevation: 3, // For Android
  },
  blurContainer: {
    borderRadius: '20rs',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'orange',
    zIndex: 999,
    elevation: 3,
  },
  blurView: {
    width: '100%',
    minHeight: '60rs',
    zIndex: 999,
  },
  contentContainer: {
    padding: '5rs',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  accordHeader: {
    paddingVertical: '12rs',
    paddingHorizontal: '12rs',
    width: '100%',
    minHeight: '44rs',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordTitle: {
    fontWeight: '600',
    color: '#333',

  },
  filterGroup: {
    marginTop: '8rs',
    paddingTop: '8rs',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 165, 0, 0.2)',
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: '4rs',
    gap: '8rs',
  },
  categoriesContainer: {
    marginTop: '8rs',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: '8rs',
    gap: '8rs',
    minHeight: '44rs',
    alignItems: 'center',
  },
});

export default FilterAccordion;