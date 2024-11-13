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
  setGastroChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setHandwerkChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setBildungChecked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (category === 'garten') {
    setGartenChecked(prev => !prev);
    setHaushaltChecked(false);
    setSozialesChecked(false);
    setGastroChecked(false);
    setHandwerkChecked(false);
    setBildungChecked(false);
  }
  if (category === 'haushalt') {
    setGartenChecked(false);
    setHaushaltChecked(prev => !prev);
    setSozialesChecked(false);
    setGastroChecked(false);
    setHandwerkChecked(false);
    setBildungChecked(false);
  }
  if (category === 'soziales') {
    setGartenChecked(false);
    setHaushaltChecked(false);
    setSozialesChecked(prev => !prev);
    setGastroChecked(false);
    setHandwerkChecked(false);
    setBildungChecked(false);
  }
  if (category === 'gastro') {
    setGartenChecked(false);
    setHaushaltChecked(false);
    setSozialesChecked(false);
    setGastroChecked(prev => !prev);
    setHandwerkChecked(false);
    setBildungChecked(false);
  }
  if (category === 'handwerk') {
    setGartenChecked(false);
    setHaushaltChecked(false);
    setSozialesChecked(false);
    setGastroChecked(false);
    setHandwerkChecked(prev => !prev);
    setBildungChecked(false);
  }
  if (category === 'bildung') {
    setGartenChecked(false);
    setHaushaltChecked(false);
    setSozialesChecked(false);
    setGastroChecked(false);
    setHandwerkChecked(false);
    setBildungChecked(prev => !prev);
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
    case 'Handwerk':
      return require('@/assets/images/HandwerkIcon.png');
    case 'Bildung':
      return require('@/assets/images/BildungsIcon.png');
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
      return 'rgb(184,0,211)';
    case 'Suchen':
      return 'orange';
    case 'Handwerk':
      return 'orange';
    case 'Bildung':
      return 'lightgrey';
    default:
      return 'grey';
  }
};