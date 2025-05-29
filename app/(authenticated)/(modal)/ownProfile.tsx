//ownProfile.tsx
import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  ActivityIndicator,

  StyleSheet,
  
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useDanksagungStore } from '@/components/stores/danksagungStores';
import { FontSizeContext } from '@/components/provider/FontSizeContext';

import UserProfileHeader from '@/components/Profile/UserProfileHeader';

const UserProfile = () => {
  const { user, isLoading: userLoading, error: userError } = useAuthStore();
  const danksagungen = useDanksagungStore((state) =>
    state.danksagungen.filter((d) => d.userId === user?.id)
  );
  const danksagungCount = useDanksagungStore((state) => state.danksagungCount);
  const loading = useDanksagungStore((state) => state.loading);
  const error = useDanksagungStore((state) => state.error);
  const { fontSize: contextFontSize } = useContext(FontSizeContext);



  const defaultFontSize = 22;
  const baseFontSize = 24;
  const maxFontSize = 38;
  const adjustedFontSize = (contextFontSize / defaultFontSize) * baseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 200;

  const gradientTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const formatName = useCallback(
    (vorname: string, nachname: string) => `${vorname} ${nachname.charAt(0)}.`,
    []
  );

  const renderDanksagung = ({ item }: { item: { writtenText: string; vorname: string; nachname: string } }) => (
    <View style={styles.danksagungCard}>
      <Text style={[styles.danksagungText, { fontSize: finalFontSize }]}>{item.writtenText}</Text>
      <Text style={[styles.danksagungAuthor, { fontSize: finalFontSize }]}>
        – {formatName(item.vorname, item.nachname)}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <UserProfileHeader user={user} formatName={formatName} danksagungsLength={danksagungen.length} />
  );

  if (userLoading || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  if (!user || userError || error) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>
          Fehler beim Laden des Profils.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.gradientHeader, { transform: [{ translateY: gradientTranslateY }] }]}
      >
        <LinearGradient   colors={['#ff9a00', '#ffc300', '#ffffff']}style={styles.gradient} />
      </Animated.View>
     
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        ListHeaderComponent={renderHeader}
        data={danksagungen}
        renderItem={renderDanksagung}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>

            <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>
              Du hast noch keine Danksagungen erhalten.
            </Text>
            <Text style={[styles.emptyListText, { fontSize: finalFontSize }]}>
              Bleib hilfsbereit – dann wird sich das schnell ändern!
            </Text>
          </View>
        }
        extraData={danksagungCount}
      />
    </View>
  );
};

export default UserProfile;

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
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  profileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ccc',
  },
  countCard: {
    marginLeft: 20,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  countNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  countLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  profileInfo: {
    marginTop: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
  editBioButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editBioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editBioText: {
    fontSize: 14,
    color: 'gray',
    fontWeight: 'bold',
  },

  bioWrapper: {
    marginTop: 10,
  },
  bioText: {
    fontSize: 14,
    color: '#444',
  },
  bioInput: {
    fontSize: 14,
    color: '#333',
    padding: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 40,
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