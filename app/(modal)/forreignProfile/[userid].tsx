import React from 'react';
import { View, Text, FlatList } from 'react-native';
import ProfileAvatar from '../../../components/ProfileImage/ProfileAvatar';
import { useLocalSearchParams } from 'expo-router';
import { Danksagung } from '../../../components/types/Danksagungen';
import { createRStyle } from 'react-native-full-responsive';
import LottieView from 'lottie-react-native';
import CreateDanksagung from '../../../components/Crud/Danksagungen/createDanksagung';
import { useFetchDanksagungen } from '../../../components/Crud/Danksagungen/fetchDanksagung';
import { useDanksagungStore } from '../../../components/stores/danksagungStores';
import { useAuthStore } from '../../../components/stores/AuthStore';

const UserProfile: React.FC = () => {
  const { userid } = useLocalSearchParams();
  const userId = userid as string;
  const { user, isLoading: userLoading, error: userError } = useAuthStore();
  const { danksagungen, loading: danksagungenLoading, error: danksagungenError } = useFetchDanksagungen(userId);
  const danksagungCount = useDanksagungStore(state => state.danksagungCount);

 

  const formatName = (vorname: string, nachname: string) => 
    `${vorname} ${nachname.charAt(0)}.`;

  const renderDanksagung = ({ item }: { item: Danksagung }) => (
    <View style={styles.danksagungCard}>
      <Text style={styles.danksagungText}>{item.writtenText}</Text>
      <Text style={styles.danksagungAuthor}>- {formatName(item.vorname, item.nachname)}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfoCard}>
        <View>
          <ProfileAvatar style={styles.profileImage} />
          <Text style={styles.userName}>{formatName(user?.vorname || '', user?.nachname || '')}</Text>
        </View>
        <Text style={styles.userBio}>{user?.bio || ''}</Text>
      </View>
      <View style={styles.trenner}/>
      <View style={styles.trenner2}/>
      
      <View style={styles.danksagungenHeader}>
        <Text style={styles.danksagungenTitle}>Danksagungen</Text>
      </View>

      <CreateDanksagung 
        userId={userId} 

      />

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

  if (userLoading || danksagungenLoading) {
    return <Text>Lade Daten...</Text>;
  }

  if (userError || danksagungenError) {
    return <Text>Fehler beim Laden der Daten: {userError || danksagungenError}</Text>;
  }

  if (!user) {
    return <Text>Kein Benutzerprofil gefunden.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={danksagungen}
        renderItem={renderDanksagung}
        keyExtractor={(item) => item.id}
        style={styles.danksagungList}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>Keine Danksagungen für diesen Benutzer gefunden.</Text>
          </View>
        }
        extraData={danksagungCount} // Fügen Sie dies hinzu, um die Liste bei Änderungen neu zu rendern
      />
    </View>
  );
};
const styles = createRStyle({
  container: {
    flex: 1,
    padding: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
  },
  trenner: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    opacity: 0.5,
    width: '320rs',
  },
  trenner2: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    opacity: 0.5,
    width: '300rs',
    alignSelf: 'center',
  },
  userInfoCard: {
    padding: 16,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 16,
  },
  lottieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  lottie: {
    alignSelf: "center",
    width: 100,
    height: 100,
    zIndex: 100,
    transform: [{ rotate: '180deg' }],
    color: 'green',
  },
  danksagungList: {
    flex: 1,
  },
  danksagungCard: {
    padding: 16,
    marginBottom: 8,
  },
  danksagungText: {
    fontSize: 16,
    marginBottom: 4,
  },
  danksagungAuthor: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'right',
  }, 
  header: {
    marginBottom: 20,
  },
  danksagungenHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  danksagungenTitle: {
    fontSize: '24rs',
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 8,
    letterSpacing: 2,
  },
  emptyListContainer: {
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignContent: 'center',
    margin: 25,
    padding: 20,
  },
  emptyListText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default UserProfile;