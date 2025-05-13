import React, { useRef, useContext } from 'react';
import {
  View,
  Text,
  Animated,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { useDanksagungStore } from '@/components/stores/danksagungStores';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import ForeignProfileHeader from '@/components/Header/ForreignProfileHeader';

const ForreignProfile = () => {
  const { selectedUser } = useSelectedUserStore();
  const allDanksagungen = useDanksagungStore((state) => state.danksagungen);
  const danksagungCount = useDanksagungStore((state) => state.danksagungCount);
  const loading = useDanksagungStore((state) => state.loading);
  const error = useDanksagungStore((state) => state.error);
  const { fontSize } = useContext(FontSizeContext);

  const defaultFontSize = 22;
  const baseFontSize = 24;
  const maxFontSize = 38;
  const adjustedFontSize = (fontSize / defaultFontSize) * baseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 200;

  const gradientTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const danksagungen = allDanksagungen.filter(
    (d) => d.userId === selectedUser?.userId
  );

  const formatName = (v: string, n: string) => `${v} ${n.charAt(0)}.`;

  const renderDanksagung = ({ item }: { item: any }) => (
    <View style={styles.danksagungCard}>
      <Text style={[styles.danksagungText, { fontSize: finalFontSize }]}>{item.writtenText}</Text>
      <Text style={[styles.danksagungAuthor, { fontSize: finalFontSize }]}>
        – {formatName(item.vorname, item.nachname)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  if (error || !selectedUser) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>
          {error ? `Fehler: ${error}` : 'Kein Benutzerprofil gefunden.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.gradientHeader, { transform: [{ translateY: gradientTranslateY }] }]}>
        <LinearGradient colors={['#FFA500', '#FFFFFF']} style={styles.gradient} />
      </Animated.View>

      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <ForeignProfileHeader
            vorname={selectedUser.vorname}
            nachname={selectedUser.nachname}
            bio={selectedUser.bio}
            userId={selectedUser.userId}
            fontSize={finalFontSize}
            danksagungCount={danksagungen.length}
          />
        }
        data={danksagungen}
        renderItem={renderDanksagung}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>
              Noch keine Danksagungen für diesen Benutzer.
            </Text>
            <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>
              Du kannst der/die Erste sein!
            </Text>
          </View>
        }
        extraData={danksagungCount}
      />
    </View>
  );
};

export default ForreignProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradientHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 260,
    zIndex: -1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  gradient: {
    flex: 1,
    opacity: 0.8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  danksagungCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  danksagungText: {
    fontSize: 16,
    marginBottom: 8,
  },
  danksagungAuthor: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  emptyListContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  emptyListText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 4,
  },
});