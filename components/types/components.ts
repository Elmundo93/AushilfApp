

import { PropsWithChildren } from 'react';

export interface AppError extends Error {
  code?: string;

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
  suchenChecked: boolean;
  bietenChecked: boolean;
  gartenChecked: boolean;
  haushaltChecked: boolean;
  sozialesChecked: boolean;
  gastroChecked: boolean;
  handwerkChecked: boolean;
  bildungChecked: boolean;
  handleSuchenBietenChange: (option: string) => void;
  handleCategoryChange: (category: string) => void;
  // Neue Eigenschaften (optional, da sie nicht in allen Verwendungen vorkommen)
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