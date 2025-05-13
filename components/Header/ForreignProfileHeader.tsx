import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import ForeignProfileAvatar from '@/components/Profile/ProfileImage/ForreignProfilAvatar';
import CreateDanksagung from '@/components/Crud/Danksagungen/createDanksagung';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { styles } from '@/components/Profile/styles';

interface Props {
  vorname: string;
  nachname: string;
  bio: string;
  userId: string;
  fontSize: number;
  danksagungCount: number;
}

const ForeignProfileHeader: React.FC<Props> = ({
  vorname,
  nachname,
  bio,
  userId,
  danksagungCount,
}) => {
  const { fontSize: contextFontSize } = useContext(FontSizeContext);
  const defaultFontSize = 22;
  const baseFontSize = 25;
  const maxFontSize = 48;
  const adjustedFontSize = (contextFontSize / defaultFontSize) * baseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const formatName = (v: string, n: string) => `${v} ${n.charAt(0)}.`;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileTopRow}>
        <ForeignProfileAvatar />
        <View style={styles.countCard}>
          <Text style={styles.countNumber}>{danksagungCount}</Text>
          <Text style={styles.countLabel}>Danksagungen</Text>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={[styles.userName, { fontSize: finalFontSize }]}>
          {formatName(vorname, nachname)}
        </Text>

        <View style={styles.userBioContainer}>
          <Text style={[styles.userBioTitle, { fontSize: finalFontSize - 8 }]}>Über mich:</Text>
          <Text style={[styles.userBio, { fontSize: finalFontSize - 8 }]}>
            {bio || 'Keine Bio vorhanden.'}
          </Text>
        </View>

        <View style={styles.editBioButtonContainer}>
          <CreateDanksagung userId={userId} />
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

export default ForeignProfileHeader;