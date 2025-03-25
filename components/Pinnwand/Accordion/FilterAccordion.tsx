import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createRStyle } from 'react-native-full-responsive';
import { FilterAccordionProps } from '@/components/types/components';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { usePostStore } from '@/components/stores/postStore';



const FilterAccordion: React.FC<FilterAccordionProps> = React.memo(({
  isExpanded,
  onToggle,
  renderCheckbox,
}) => {
  const { fontSize } = useContext(FontSizeContext);
  const { filters, setFilters } = usePostStore(); 

  const maxFontSize = 45; // Passen Sie diesen Wert nach Bedarf an

  const defaultFontSize = 24; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 24; // Ausgangsschriftgröße für das Label
  const minIconSize = 40;
  const maxIconSize = 120;

  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const handleSuchenBietenChange = (option: string) => {
    setFilters({
      suchenChecked: option === 'suchen' ? !filters.suchenChecked : false,
      bietenChecked: option === 'bieten' ? !filters.bietenChecked : false,
    });
  };

  const handleCategoryChange = (category: string) => {
    setFilters({
      categories: {

        [category]: !filters.categories[category],
      },
    });
  };

  return (
    <View style={styles.accordContainer}>
      <TouchableOpacity style={styles.accordHeader} onPress={onToggle}>
        <Text style={[styles.accordTitle, { fontSize: finalFontSize }]}>Filter deine Suche:</Text>
        <MaterialCommunityIcons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={iconSize} 
          color="#bbb" 
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.filtersContainer}>
          {renderCheckbox('Suchen', filters.suchenChecked, () => handleSuchenBietenChange('suchen'))}
          {renderCheckbox('Bieten', filters.bietenChecked, () => handleSuchenBietenChange('bieten'))}
          <View style={styles.trenner} />
          {renderCheckbox('Garten', filters.categories.garten, () => handleCategoryChange('garten'))}
          {renderCheckbox('Haushalt', filters.categories.haushalt, () => handleCategoryChange('haushalt'))}
          {renderCheckbox('Soziales', filters.categories.soziales, () => handleCategoryChange('soziales'))}
          {renderCheckbox('Gastro', filters.categories.gastro, () => handleCategoryChange('gastro'))}
          {renderCheckbox('Handwerk', filters.categories.handwerk, () => handleCategoryChange('handwerk'))}
          {renderCheckbox('Bildung', filters.categories.bildung, () => handleCategoryChange('bildung'))}
        </View>
      )}
    </View>
  );
});

const styles = createRStyle({
  accordContainer: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: '25rs',
    marginTop: '10rs',
    width: '320rs',
    alignSelf: 'center',
  },
  accordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10rs',
  },
  accordTitle: {
    fontSize: '16rs',
    fontWeight: 'bold',
    color: '#333',
    padding: '5rs',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',

  },
  trenner: {
    width: '100%',
    height: 1,
    backgroundColor: 'lightgrey',
    
  },

});

export default FilterAccordion;