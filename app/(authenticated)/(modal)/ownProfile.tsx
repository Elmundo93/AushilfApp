import React, { useCallback } from 'react';
import { View, Text, Animated } from 'react-native';
import { Danksagung } from '@/components/types/Danksagungen';

import { useDanksagungStore } from '@/components/stores/danksagungStores';
import { useAuthStore } from '@/components/stores/AuthStore';
import UserProfileHeader from '@/components/Profile/UserProfileHeader';
import { styles } from '@/components/Profile/styles';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';

const UserProfile: React.FC = () => {
  const { user, isLoading: userLoading, error: userError } = useAuthStore();

  const danksagungCount = useDanksagungStore(state => state.danksagungCount);
  const allDanksagungen = useDanksagungStore(state => state.danksagungen);
  const loading = useDanksagungStore(state => state.loading);
  const error = useDanksagungStore(state => state.error);
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 38; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 24; // Ausgangsschriftgröße für das Label
  const minIconSize = 35;
  const maxIconSize = 60;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  // Filtere Danksagungen für den aktuellen Benutzer
  const danksagungen = allDanksagungen.filter(danksagung => danksagung.userId === user?.id);

  const formatName = useCallback(
    (vorname: string, nachname: string) => `${vorname} ${nachname.charAt(0)}.`,
    []
  );
   const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = 200; 

  const gradientTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp'
  });

  const renderDanksagung = ({ item }: { item: Danksagung }) => (
    <View style={styles.danksagungCard}>
      <Text style={[styles.danksagungText, { fontSize: finalFontSize }]}>{item.writtenText}</Text>
      <Text style={[styles.danksagungAuthor, { fontSize: finalFontSize }]}>- {formatName(item.vorname, item.nachname)}</Text>
    </View>
  );

  if (userLoading || loading) {
    return <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>Lade Daten...</Text>;
  }

    if (userError || error ) {
    return <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>Fehler beim Laden der Daten: {userError || error}</Text>;
  }

  if (!user) {
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
        ListHeaderComponent={

     
          
          <UserProfileHeader
            user={user}
              formatName={formatName}

            />

        }
        data={danksagungen}
        renderItem={renderDanksagung}
        keyExtractor={(item) => item.id}
        style={styles.danksagungList}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>Du hast leider noch keine Danksagungen von anderen Benutzern erhalten.</Text>
            <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>Bleib hilfsbereit und das wird sich bald ändern!</Text>
          </View>
        }
        extraData={danksagungCount}
      />
    </View>
  );
};

export default UserProfile;