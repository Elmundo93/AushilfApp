

export type CustomCheckboxProps = {
    label: string;
    isChecked: boolean;
    onCheck: () => void;
    
  };

  export interface PostFiltersProps {
    onOptionChange: (option: string) => void;
    onCategoryChange: (category: string) => void;
  }