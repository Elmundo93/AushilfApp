import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createRStyle } from 'react-native-full-responsive';
import { FilterAccordionProps } from '../types/components';



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
  return (
    <View style={styles.accordContainer}>
      <TouchableOpacity style={styles.accordHeader} onPress={onToggle}>
        <Text style={styles.accordTitle}>Filter deine Suche:</Text>
        <MaterialCommunityIcons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20} 
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
    paddingHorizontal: '10rs',
  },
  trenner: {
    width: '100%',
    height: 1,
    backgroundColor: 'lightgrey',
    
  },
  // ... andere Stile ...
});

export default FilterAccordion;