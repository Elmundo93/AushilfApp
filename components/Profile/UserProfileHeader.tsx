//UserProfileHeader.tsx

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import ProfileImagePicker from '@/components/Profile/ProfileImage/ProfileImagePicker';
import { User } from '@/components/types/auth';
import { styles } from './styles';
import { useBioUpdate } from '@/components/Crud/Profile/createÜberMich';
import { FontSizeContext } from '@/components/provider/FontSizeContext';

interface UserProfileHeaderProps {
  user: User | null;
  formatName: (vorname: string, nachname: string) => string;
  danksagungsLength: number;
}

const UserProfileHeaderComponent: React.FC<UserProfileHeaderProps> = ({ user, formatName, danksagungsLength }) => {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 48;
  const defaultFontSize = 22;
  const componentBaseFontSize = 25;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const { isEditingBio, editedBio, setEditedBio, handleEditBio } = useBioUpdate();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileTopRow}>
        <ProfileImagePicker />
        <View style={styles.countCard}>
          <Text style={styles.countNumber}>{danksagungsLength || 0}</Text>
          <Text style={styles.countLabel}>Danksagungen</Text>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={[styles.userName, { fontSize: finalFontSize }]}>
          {formatName(user?.vorname || '', user?.nachname || '')}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        <View style={styles.userBioContainer}>
          <Text style={[styles.userBioTitle, { fontSize: finalFontSize -8 }]}>Über mich:</Text>
          {isEditingBio ? (
            <TextInput
              style={styles.userBioInput}
              value={editedBio}
              onChangeText={setEditedBio}
              multiline
            />
          ) : (
            <Text style={[styles.userBio, { fontSize: finalFontSize -8 }]}>{user?.bio || ''}</Text>
          )}
        </View>
        <View style={styles.editBioButtonContainer}>
          <TouchableOpacity onPress={handleEditBio} style={styles.editBioButton}>
            <Text style={[styles.editBioText, { fontSize: finalFontSize -8 }]}>
              {isEditingBio ? 'Speichern' : 'Über mich Bearbeiten'}
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