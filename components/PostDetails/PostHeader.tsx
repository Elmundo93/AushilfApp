import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ProfileImage from '@/components/Profile/ProfileImage/PostProfile';
import { getOptionIcon, getCategoryIcon } from '@/components/Pinnwand/utils/iconHelper';
import { formatName } from '@/components/Pinnwand/utils/Formatter';


interface PostHeaderProps {
  vorname: string;
  nachname: string;
  profileImageUrl: string;
  option: string;
  category: string;
  finalFontSize: number;
  iconSize: number;
}

export function PostHeader({ 
  vorname, 
  nachname, 
  profileImageUrl, 
  option, 
  category,
  finalFontSize,
  iconSize 
}: PostHeaderProps) {

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerProfileContainer}>
        <Text style={[styles.headerText, { fontSize: finalFontSize }]}>
          {formatName(vorname, nachname)}
        </Text>
        <ProfileImage imageUrl={profileImageUrl} />
        <View style={styles.iconContainer}>
          <Image source={getOptionIcon(option)} style={[styles.icon, { width: iconSize, height: iconSize }]} />
          <Image source={getCategoryIcon(category)} style={[styles.icon, { width: iconSize, height: iconSize }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    headerContainer: {
        marginVertical: 16,
      },
      headerProfileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        justifyContent: 'center',
      },
      iconContainer: {
        flexDirection: 'column',
        gap: 5,
      },
      icon: {
    
        borderRadius: 50,
      },
      headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
      }
});