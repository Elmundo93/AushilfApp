import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import ProfileImagePicker from '@/components/Profile/ProfileImage/ProfileImagePicker';
import LottieView from 'lottie-react-native';
import { User } from '@/components/types/auth';
import { styles } from '@/components/Profile/styles';
import { useBioUpdate } from '@/components/Crud/Profile/createÜberMich';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';


interface UserProfileHeaderProps {
  user: User | null;
  formatName: (vorname: string, nachname: string) => string;
}

const UserProfileHeaderComponent: React.FC<UserProfileHeaderProps> = ({
  user,
  formatName,

}) => {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 48; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 25; // Ausgangsschriftgröße für das Label
  const minIconSize = 35;
  const maxIconSize = 60;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const { isEditingBio, editedBio, setEditedBio, handleEditBio } = useBioUpdate();

  return (
    

    <View style={styles.header}>
      
      <View style={styles.userInfoCard}>
        <View>
          <ProfileImagePicker />
          <Text style={[styles.userName, { fontSize: finalFontSize }] }>
            {formatName(user?.vorname || '', user?.nachname || '')}
          </Text>
        </View>
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
      <View style={styles.trenner2} />

      <View style={styles.danksagungenHeader}>
        <Text style={[styles.danksagungenTitle, { fontSize: finalFontSize }]}>Danksagungen</Text>
      </View>



      <View style={styles.lottieContainer}>
        <LottieView
          source={require('@/assets/animations/SpinnigGreenArrow.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <LottieView
          source={require('@/assets/animations/SpinnigGreenArrow.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </View>
  );
};

const UserProfileHeader = React.memo(UserProfileHeaderComponent);

export default UserProfileHeader;