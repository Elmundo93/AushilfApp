import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';
import { ImageSourcePropType } from 'react-native';

interface OnboardingBackgroundProps {
  step: string;
  style?: ImageStyle;
  customPosition?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center' | 'repeat';
}

const BACKGROUND_IMAGES: Record<string, ImageSourcePropType> = {
  intro: require('@/assets/images/CasualFriends.png'),
  modal: require('@/assets/images/CasualFriends.png'),
  userinfo: require('@/assets/images/IdeaCrafting.png'),
  userinfo2: require('@/assets/images/CoolKids.png'), // Same as userinfo
  intent: require('@/assets/images/OptionenKennen.png'),
  about: require('@/assets/images/IdeaCrafting.png'),
  profileImage: require('@/assets/images/OptionenKennen.png'),
  password: require('@/assets/images/processe.png'),
  conclusion: require('@/assets/images/CoolKids.png'),
  savety: require('@/assets/images/SicherheitAnmeldung.png'),
  pinnwand: require('@/assets/images/CoolKids.png'),
};

// Default positioning for different steps
const STEP_POSITIONS: Record<string, { top?: number; left?: number; right?: number; bottom?: number }> = {
  modal: { top: 0, left: 0, right: 0, bottom: 0,   }, // Full screen for modal
  pinnwand: { top: 100 },
  intro: { top: -100 },
  default: { top: -100 },
};

export default function OnboardingBackground({ step, style, customPosition, resizeMode = 'contain' }: OnboardingBackgroundProps) {
  const backgroundImage = BACKGROUND_IMAGES[step] || BACKGROUND_IMAGES.intro;
  const stepPosition = STEP_POSITIONS[step] || STEP_POSITIONS.default;
  const finalPosition = customPosition || stepPosition;

  return (
    <Image
      source={backgroundImage}
      style={[
        styles.backgroundImage,
        finalPosition,
        style
      ]}
      resizeMode={resizeMode}
    />
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    backgroundColor: 'transparent',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
}); 