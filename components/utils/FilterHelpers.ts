import { ImageSourcePropType } from 'react-native';

export const handleSuchenBietenChange = (
  option: string,
  suchenChecked: boolean,
  bietenChecked: boolean,
  setSuchenChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setBietenChecked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (option === 'suchen') {
    setSuchenChecked(!suchenChecked);
    setBietenChecked(false);
  } else if (option === 'bieten') {
    setBietenChecked(!bietenChecked);
    setSuchenChecked(false);
  }
};

export const handleCategoryChange = (
  category: string,
  setGartenChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setHaushaltChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setSozialesChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setGastroChecked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (category === 'garten') {
    setGartenChecked(prev => !prev);
    setHaushaltChecked(false);
    setSozialesChecked(false);
    setGastroChecked(false);
  }
  if (category === 'haushalt') {
    setGartenChecked(false);
    setHaushaltChecked(prev => !prev);
    setSozialesChecked(false);
    setGastroChecked(false);
  }
  if (category === 'soziales') {
    setGartenChecked(false);
    setHaushaltChecked(false);
    setSozialesChecked(prev => !prev);
    setGastroChecked(false);
  }
  if (category === 'gastro') {
    setGartenChecked(false);
    setHaushaltChecked(false);
    setSozialesChecked(false);
    setGastroChecked(prev => !prev);
  }
};

export const getCheckboxImage = (label: string): ImageSourcePropType => {
  switch (label) {
    case 'Garten':
      return require('@/assets/images/GartenIcon.png');
    case 'Haushalt':
      return require('@/assets/images/HaushaltIcon.png');
    case 'Soziales':
      return require('@/assets/images/SozialesIcon.png');
    case 'Gastro':
      return require('@/assets/images/GastroIcon.png');
    case 'Suchen':
      return require('@/assets/images/LookingFor.png');
    case 'Bieten':
      return require('@/assets/images/RaisingHand.png');
    default:
      return require('@/assets/images/GastroIcon.png');
  }
};

export const getUnderlayColor = (label: string): string => {
  switch (label) {
    case 'Garten':
      return 'lightgreen';
    case 'Haushalt':
      return 'lightblue';
    case 'Soziales':
      return 'rgb(255, 102, 102)';
    case 'Gastro':
      return 'rgb(255, 255, 102)';
    case 'Bieten':
      return 'green';
    case 'Suchen':
      return 'orange';
    default:
      return 'grey';
  }
};