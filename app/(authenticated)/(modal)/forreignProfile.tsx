import React, { useRef, useContext, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';
import { useDanksagungStore } from '@/components/stores/danksagungStores';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import ForeignProfileHeader from '@/components/Header/ForreignProfileHeader';
import { CategoryType } from '@/components/types/stream';
import { useDanksagungenService } from '@/components/Crud/SQLite/Services/danksagungenService';
import { useSQLiteContext } from 'expo-sqlite';

const normalizeCategories = (categories: string[] | undefined): string[] => {
  if (!categories) return [];
  return categories.map(cat => cat.toLowerCase());
};

const ForreignProfile = () => {
  const { selectedUser } = useSelectedUserStore();
  const { danksagungen, loading, error, setDanksagungen, setLoading, setError } = useDanksagungStore();
  const { fontSize } = useContext(FontSizeContext);
  const db = useSQLiteContext();
  const { getDanksagungenForUser } = useDanksagungenService();
  const isFetchingRef = useRef(false);

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

  // Filter danksagungen for the selected user
  const userDanksagungen = danksagungen.filter(
    (d) => d.userId === selectedUser?.userId
  );

  // Memoize the fetch function to prevent infinite loops
  const fetchUserDanksagungen = useCallback(async () => {
    if (!selectedUser?.userId || isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      // console.log(`🔍 Fetching danksagungen for user: ${selectedUser.userId}`);
      const userDanksagungen = await getDanksagungenForUser(selectedUser.userId);
      setDanksagungen(userDanksagungen);
      // console.log(`✅ Loaded ${userDanksagungen.length} danksagungen for user ${selectedUser.userId}`);
    } catch (err) {
      console.error('❌ Error fetching user danksagungen:', err);
      setError('Fehler beim Laden der Danksagungen');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [selectedUser?.userId, getDanksagungenForUser, setDanksagungen, setLoading, setError]);

  // Fetch danksagungen for the selected user when component mounts or user changes
  useEffect(() => {
    fetchUserDanksagungen();
  }, [selectedUser?.userId]); // Only depend on userId, not the entire function

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

  const normalizedCategories = normalizeCategories(selectedUser.kategorien);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.gradientHeader, { transform: [{ translateY: gradientTranslateY }] }]}>
        <LinearGradient colors={['#ff9a00', '#ffc300', '#ffffff']} style={styles.gradient} />
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
            danksagungCount={userDanksagungen.length}
            kategorien={normalizedCategories}
          />
        }
        data={userDanksagungen}
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
        extraData={userDanksagungen.length}
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
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? '#eee' : 'transparent',
    elevation: Platform.OS === 'android' ? 4 : 0,
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