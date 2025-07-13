import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ProfileImage from '@/components/Profile/ProfileImage/PostProfile';
import { getOptionIcon, getCategoryIcon } from '@/components/Pinnwand/utils/iconHelper';
import { formatName } from '@/components/Pinnwand/utils/Formatter';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { getIconForCategory, getBackgroundForCategory } from '@/components/Pinnwand/utils/CategoryAndOptionUtils';

const CATEGORIES = [
  { label: 'Garten', key: 'garten' },
  { label: 'Haushalt', key: 'haushalt' },
  { label: 'Soziales', key: 'soziales' },
  { label: 'Gastro', key: 'gastro' },
  { label: 'Handwerk', key: 'handwerk' },
  { label: 'Bildung', key: 'bildung' },
];

interface PostHeaderProps {
  vorname: string;
  nachname: string;
  profileImageUrl: string;
  option: string;
  category: string;
  finalFontSize: number;
  iconSize: number;
  userId: string;
  userBio?: string;
  kategorien?: string[];
}

export function PostHeader({ 
  vorname, 
  nachname, 
  profileImageUrl, 
  option, 
  category,
  finalFontSize,
  iconSize,
  userId,
  userBio,
  kategorien
}: PostHeaderProps) {
  const router = useRouter();
  const { setSelectedUser } = useSelectedUserStore();

  const handleViewProfile = () => {
    const userProfile = {
      userId: userId,
      vorname: vorname,
      nachname: nachname,
      profileImageUrl: profileImageUrl,
      bio: userBio || '',
      kategorien: kategorien || [],
    };
    setSelectedUser(userProfile);
    router.push({ pathname: '/(modal)/forreignProfile' });
  };



  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerProfileContainer}>
        <Text style={[styles.headerText, { fontSize: finalFontSize }]}>
          {formatName(vorname, nachname)}
        </Text>
        <ProfileImage 
          imageUrl={profileImageUrl} 
          userId={userId}
          vorname={vorname}
          nachname={nachname}
          profileImageUrl={profileImageUrl}
          userBio={userBio || ''}
          kategorien={kategorien || []}
        />
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
        marginVertical: 8,
      },
      headerProfileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        justifyContent: 'center',
        paddingHorizontal: 8,
      },
      iconContainer: {
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
      },
      icon: {
        borderRadius: 50,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        flex: 1,
        lineHeight: 28,
      },
      categoryContainer: {
        marginTop: 12,
        paddingHorizontal: 8,
      },
      iconsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
      },
      categoryButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      categoryIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
      },
      categoryIcon: {
        width: 16,
        height: 16,
      }
});