import React, { useState, useEffect } from 'react';
import { View, Text} from 'react-native';
import ForeignProfileAvatar from '@/components/Profile/ProfileImage/ForreignProfilAvatar';
import { Danksagung } from '@/components/types/Danksagungen';
import { createRStyle } from 'react-native-full-responsive';
import LottieView from 'lottie-react-native';
import CreateDanksagung from '@/components/Crud/Danksagungen/createDanksagung';
import { getDanksagungenFromSQLite } from '@/components/Crud/SQLite/Create/create&save&getDanksagungenDB';
import { useDanksagungStore } from '@/components/stores/danksagungStores';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
import {Animated} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
const ForreignProfile: React.FC = () => {

  const [danksagungen, setDanksagungen] = useState<Danksagung[]>([]);
  const [danksagungenLoading, setDanksagungenLoading] = useState(false);
  const [danksagungenError, setDanksagungenError] = useState<string | null>(null);
  const { selectedUser } = useSelectedUserStore();
  const danksagungCount = useDanksagungStore(state => state.danksagungCount);
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 38; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 24; // Ausgangsschriftgröße für das Label
  const minIconSize = 35;
  const maxIconSize = 60;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);


  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = 200; // Höhe des Gradienten, anpassen nach Bedarf

  const gradientTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp'
  });

  // Berechnung der angepassten Schriftgröße


  const formatName = (vorname: string, nachname: string) => 
    `${vorname} ${nachname.charAt(0)}.`;

  const renderDanksagung = ({ item }: { item: Danksagung }) => (
    <View style={styles.danksagungCard}>
      <Text style={[styles.danksagungText, { fontSize: finalFontSize }]}>{item.writtenText}</Text>
      <Text style={[styles.danksagungAuthor, { fontSize: finalFontSize   }]}>- {formatName(item.vorname, item.nachname)}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfoCard}>
        <View>
          <ForeignProfileAvatar style={styles.profileImage} />
          <Text style={[styles.userName, { fontSize: finalFontSize }]}>{formatName(selectedUser?.vorname || '', selectedUser?.nachname || '')}</Text>
        </View>
        <View style={styles.userBioContainer}>
          <Text style={[styles.userBioTitle, { fontSize: finalFontSize -8 }]}>Über mich:</Text>

            <Text style={[styles.userBio, { fontSize: finalFontSize }]}>{selectedUser?.userBio || ''}</Text>
          
        </View>
      </View>
      <View style={styles.trenner}/>
      <View style={styles.trenner2}/>
      
      <View style={styles.danksagungenHeader}>
        <Text style={[styles.danksagungenTitle, { fontSize: finalFontSize +8 }]}>Danksagungen</Text>
      </View>

      <CreateDanksagung 
        userId={selectedUser?.userId || ''} 

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

  useEffect(() => {
    const loadDanksagungen = async () => {
      if (selectedUser?.userId) {
        try {
          setDanksagungenLoading(true);
          const data = await getDanksagungenFromSQLite(selectedUser.userId);
          setDanksagungen(data as Danksagung[]);
        } catch (error) {
          setDanksagungenError((error as Error).message);
        } finally {
          setDanksagungenLoading(false);
        }
      }
    };
    loadDanksagungen();
  }, [selectedUser?.userId]);

  if (danksagungenLoading) {
    return <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>Lade Daten...</Text>;
  }

  if (danksagungenError) {
    return <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>Fehler beim Laden der Daten: {danksagungenError}</Text>;
  }

  if (!selectedUser) {
    return <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>Kein Benutzerprofil gefunden.</Text>;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.gradientHeader,
        { transform: [{ translateY: gradientTranslateY }] }
      ]}>
      <LinearGradient
            colors={['orange', 'white']}
            style={styles.gradient}
          />
          </Animated.View>
      <Animated.FlatList
       onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
        ListHeaderComponent={renderHeader}
        data={danksagungen}
        renderItem={renderDanksagung}
        keyExtractor={(item) => item.id}
        style={styles.danksagungList}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>Keine Danksagungen für diesen Benutzer gefunden.</Text>
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
    backgroundColor: 'white',
  },
  gradientHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200, // Anpassen Sie diese Höhe nach Bedarf

  },
  
  gradient: {
    flex: 1,
  },
  profileImage: {
    
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 100,
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
  userBioContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    padding: 16,
    marginVertical: 16,
  },
  userBioTitle: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 8,
    position: 'absolute',
    top: -18,
    left: 15,
    backgroundColor: 'white',
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

    fontWeight: 'bold',
    color: 'orange',
    marginBottom: 8,
    letterSpacing: 2,
  },
  emptyListContainer: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 25,
    backgroundColor: 'orange',
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

export default ForreignProfile;