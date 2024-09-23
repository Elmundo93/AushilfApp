import { User as SupabaseUser } from '@supabase/supabase-js';

// Benutzer-Typ




// Post-Typ (falls Sie einen Post-Typ in Ihrer Anwendung verwenden)


// StreamChat-Typ

import { PropsWithChildren } from 'react';
// Fehler-Typ
export interface AppError extends Error {
  code?: string;
  // Fügen Sie hier weitere Fehlerfelder hinzu, die Sie möglicherweise benötigen
}

// Weitere Typen, die Sie in Ihrer Anwendung verwenden könnten
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