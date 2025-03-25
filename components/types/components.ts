

import { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
export interface AppError extends Error {
  code?: string;

}
export interface AnmeldeAccordionProps {
  isExpanded: boolean;
  onToggle: () => void;
  accordionTitle: string;
  style?: StyleProp<ViewStyle>;
}

export type FilterOption = {
  id: string;
  label: string;
  checked: boolean;
};

export type AccordionItemProps = PropsWithChildren<{
  title: string;
  isExpanded: boolean;
  onToggle: () => void;

}>;

export interface FilterAccordionProps {
  isExpanded: boolean;
  onToggle: () => void;
  renderCheckbox: (label: string, isChecked: boolean, onCheck: () => void) => React.ReactNode;
  // Remove individual checkbox props as they're now handled through filters
  option?: string;
  category?: string;
  location?: string;
  onOptionChange?: (option: string) => void;
  onCategoryChange?: (category: string) => void;
  onLocationChange?: (location: string) => void;
}

export interface FilterSectionProps {
  option: string;
  category: string;
  location: string;
  onOptionChange: (option: string) => void;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
}