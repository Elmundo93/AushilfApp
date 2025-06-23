//UserProfileHeader.tsx

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import ProfileImagePicker from '@/components/Profile/ProfileImage/ProfileImagePicker';
import { User } from '@/components/types/auth';
import { styles } from './styles';
import { useBioUpdate } from '@/components/Crud/Profile/createÜberMich';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { getIconForCategory } from '../Pinnwand/utils/CategoryAndOptionUtils';
import onboardingStyles from '@/app/(public)/(onboarding)/styles';
import { getBackgroundForCategory } from '../Pinnwand/utils/CategoryAndOptionUtils';

interface UserProfileHeaderProps {
  user: User | null;
  formatName: (vorname: string, nachname: string) => string;
  danksagungsLength: number;
}

const CATEGORIES = [
  { label: 'Garten', color: 'lightgreen', key: 'garten' },
  { label: 'Haushalt', color: 'lightblue', key: 'haushalt' },
  { label: 'Soziales', color: 'rgb(255, 102, 102)', key: 'soziales' },
  { label: 'Gastro', color: 'rgb(255, 255, 102)', key: 'gastro' },
  { label: 'Handwerk', color: 'orange', key: 'handwerk' },
  { label: 'Bildung', color: 'lightgrey', key: 'bildung' },
];

const UserProfileHeaderComponent: React.FC<UserProfileHeaderProps> = ({ user, formatName, danksagungsLength }) => {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 48;
  const defaultFontSize = 22;
  const componentBaseFontSize = 25;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const { isEditingBio, editedBio, setEditedBio, handleEditBio } = useBioUpdate();

  const selectedCategories = ['garten', 'haushalt', 'soziales', 'gastro', 'handwerk', 'bildung'];

  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileTopRow}>


        <ProfileImagePicker />
        <View style={styles.thanksAndCategories}>
          <View style={styles.countCard}>
            <Text style={styles.countNumber}>{danksagungsLength || 0}</Text>
            <Text style={styles.countLabel}>Danksagungen</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(({ label, color, key }) => (
                <View
                  key={label}
                  style={[onboardingStyles.categoryButton, {
                    backgroundColor: getBackgroundForCategory(key).backgroundColor,
                    borderColor: getBackgroundForCategory(key).backgroundColor,
                    borderWidth: 1,
                    borderRadius: 50,
                    paddingVertical: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30%',
                    aspectRatio: 1,
                    marginBottom: 10,
                  }]}
                >
                  <Image 
                    source={getIconForCategory(key)}
                    style={{
                      width: 35,
                      height: 35,
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={[styles.userName, { fontSize: finalFontSize }]}>
          {formatName(user?.vorname || '', user?.nachname || '')}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

   <View style={styles.userBioWrapper}>
  <Text style={[styles.userBioTitle, { fontSize: finalFontSize - 8 }]}>Über mich:</Text>
  {isEditingBio ? (
    <TextInput
      style={styles.userBioInput}
      value={editedBio}
      onChangeText={setEditedBio}
      multiline
    />
  ) : (
    <Text style={[styles.userBio, { fontSize: finalFontSize - 8 }]}>{user?.bio || ''}</Text>
  )}
</View>
        <View style={styles.editBioButtonContainer}>
        <TouchableOpacity onPress={handleEditBio} style={styles.editBioButton}>
  <Text style={[styles.editBioText, { fontSize: finalFontSize - 8 }]}>
    ✏️ {isEditingBio ? 'Speichern' : 'Über mich bearbeiten'}
  </Text>
</TouchableOpacity>
        </View>

      </View>

      <View style={styles.trenner} />
      <View style={styles.danksagungenHeader}>
        <Text style={[styles.danksagungenTitle, { fontSize: finalFontSize + 8 }]}>
          Danksagungen
        </Text>
      </View>
    </View>
  );
};

const UserProfileHeader = React.memo(UserProfileHeaderComponent);
export default UserProfileHeader;