import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createRStyle } from 'react-native-full-responsive';
import { FilterAccordionProps } from '../types/components';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';



const FilterAccordion: React.FC<FilterAccordionProps> = React.memo(({
  isExpanded,
  onToggle,
  renderCheckbox,
  suchenChecked,
  bietenChecked,
  gartenChecked,
  haushaltChecked,
  sozialesChecked,
  gastroChecked,
  handleSuchenBietenChange,
  handleCategoryChange
}) => {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 45; // Passen Sie diesen Wert nach Bedarf an

  const defaultFontSize = 24; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 24; // Ausgangsschriftgröße für das Label
  const minIconSize = 40;
  const maxIconSize = 120;

  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
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
          {renderCheckbox('Suchen', suchenChecked, () => handleSuchenBietenChange('suchen'))}
          {renderCheckbox('Bieten', bietenChecked, () => handleSuchenBietenChange('bieten'))}
          <View style={styles.trenner} />
          {renderCheckbox('Garten', gartenChecked, () => handleCategoryChange('garten'))}
          {renderCheckbox('Haushalt', haushaltChecked, () => handleCategoryChange('haushalt'))}
          {renderCheckbox('Soziales', sozialesChecked, () => handleCategoryChange('soziales'))}
          {renderCheckbox('Gastro', gastroChecked, () => handleCategoryChange('gastro'))}
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
  // ... andere Stile ...
});

export default FilterAccordion;