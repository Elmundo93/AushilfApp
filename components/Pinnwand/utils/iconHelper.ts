export const getOptionIcon = (option: string) => {
    switch (option) {
      case 'bieten':
        return require('@/assets/images/RaisingHandBackgroundColor.png');
      case 'suchen':
        return require('@/assets/images/LookingForBackgroundColor.png');
      default:
        return require('@/assets/images/bienenlogo.png');
    }
  };
  
  export const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gastro':
        return require('@/assets/images/GastroIconBackgroundColor.png');
      case 'garten':
        return require('@/assets/images/GartenIconBackgroundColor.png');
      case 'haushalt':
        return require('@/assets/images/HaushaltIconBackgroundColor.png');
      case 'soziales':
        return require('@/assets/images/SozialesIconBackgroundColor.png');
      case 'handwerk':
        return require('@/assets/images/HandwerkIconWithBackground.png');
      case 'bildung':
        return require('@/assets/images/BildungsIconWithBackground.png');
      default:
        return require('@/assets/images/bienenlogo.png');
    }
  };