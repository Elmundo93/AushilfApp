import React from 'react';
import { View } from 'react-native';
import FilterAccordion from '@/components/Pinnwand/Accordion/FilterAccordion';
import { createRStyle } from 'react-native-full-responsive';
import { FilterSectionProps } from '@/components/types/components';

const FilterSection: React.FC<FilterSectionProps> = ({
  option,
  category,
  location,
  onOptionChange,
  onCategoryChange,
  onLocationChange,
}) => {
  return (
    <View style={styles.filterContainer}>
      <FilterAccordion
        option={option}
        category={category}
        location={location}
        onOptionChange={onOptionChange}
        onCategoryChange={onCategoryChange}
        onLocationChange={onLocationChange}

        isExpanded={false} 
        onToggle={() => {}} 
        renderCheckbox={() => null} 
        suchenChecked={false} 
        bietenChecked={false} 
        gartenChecked={false} 
        haushaltChecked={false} 
        sozialesChecked={false} 
        gastroChecked={false} 
        handwerkChecked={false} 
        bildungChecked={false} 
        handleSuchenBietenChange={() => {}} 
        handleCategoryChange={() => {}} 
      />
    </View>
  );
};

const styles = createRStyle({
  filterContainer: {
    marginBottom: 20,
  },
});

export default FilterSection;