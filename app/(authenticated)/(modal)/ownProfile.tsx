//ownProfile.tsx
import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/components/stores/AuthStore';
import { useDanksagungStore } from '@/components/stores/danksagungStores';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { getIconForCategory, getBackgroundForCategory } from '@/components/Pinnwand/utils/CategoryAndOptionUtils';
import ProfileImagePicker from '@/components/Profile/ProfileImage/ProfileImagePicker';

const CATEGORIES = [
  { label: 'Garten', key: 'garten' },
  { label: 'Haushalt', key: 'haushalt' },
  { label: 'Soziales', key: 'soziales' },
  { label: 'Gastro', key: 'gastro' },
  { label: 'Handwerk', key: 'handwerk' },
  { label: 'Bildung', key: 'bildung' },
];

const UserProfile = () => {
  const { user, isLoading: userLoading, error: userError, setUser } = useAuthStore();
  const danksagungen = useDanksagungStore((state) =>
    state.danksagungen.filter((d) => d.userId === user?.id)
  );
  const danksagungCount = useDanksagungStore((state) => state.danksagungCount);
  const loading = useDanksagungStore((state) => state.loading);
  const error = useDanksagungStore((state) => state.error);
  const { fontSize: contextFontSize } = useContext(FontSizeContext);
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(user?.kategorien || []);

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

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSaveCategories = async () => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        kategorien: selectedCategories
      };
      await setUser(updatedUser);
      setIsEditingCategories(false);
    } catch (error) {
      console.error('Fehler beim Speichern der Kategorien:', error);
    }
  };

  const renderCategoryGrid = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.iconsContainer}>
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.label);
            const categoryColor = getBackgroundForCategory(category.key).backgroundColor;
            
            return (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: isSelected 
                      ? categoryColor
                      : 'rgba(200, 200, 200, 0.3)',
                  },
                ]}
                onPress={() => isEditingCategories && handleCategoryToggle(category.label)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.categoryIconContainer,
                  {
                    backgroundColor: isSelected 
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(255, 255, 255, 0.9)',
                  }
                ]}>
                  <Image
                    source={getIconForCategory(category.key)}
                    style={[
                      styles.categoryIcon,
                      {
                        tintColor: '#444444',
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        {isEditingCategories && (
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditingCategories(false)}
            >
              <Text style={styles.editButtonText}>Abbrechen</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={handleSaveCategories}
            >
              <Text style={styles.editButtonText}>Speichern</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderDanksagung = ({ item }: { item: { writtenText: string; vorname: string; nachname: string } }) => (
    <View style={styles.danksagungCard}>
      <Text style={[styles.danksagungText, { fontSize: finalFontSize }]}>{item.writtenText}</Text>
      <Text style={[styles.danksagungAuthor, { fontSize: finalFontSize }]}>
        – {formatName(item.vorname, item.nachname)}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>


      <View style={styles.profileTopRow}>
       <ProfileImagePicker />

        <View style={styles.thanksAndCategories}>
          <View style={styles.countCard}>
            <Text style={styles.countNumber}>{danksagungen.length}</Text>
            <Text style={styles.countLabel}>Danksagungen</Text>
          </View>
          
        

          {renderCategoryGrid()}
          <TouchableOpacity 
            style={styles.editCategoriesButton}
            onPress={() => setIsEditingCategories(true)}
          >
            <Text style={styles.editCategoriesButtonText}>
              {isEditingCategories ? 'Kategorien bearbeiten' : 'Kategorien anpassen'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={[styles.userName, { fontSize: finalFontSize }]} numberOfLines={1}>
          {formatName(user?.vorname || '', user?.nachname || '')}
        </Text>
        {user?.email && <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>}

        {user?.bio && (
          <View style={styles.userBioWrapper}>
            <Text style={[styles.userBioTitle, { fontSize: finalFontSize - 8 }]}>
              Über mich:
            </Text>
            <Text style={[styles.userBio, { fontSize: finalFontSize - 8 }]} numberOfLines={2}>
              {user.bio}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.trenner} />
    </View>
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
        <LinearGradient colors={['#ff9a00', '#ffc300', '#ffffff']} style={styles.gradient} />
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
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  thanksAndCategories: {
    flex: 1,
    marginLeft: 15,
  },
  countCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  countNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff9a00',
  },
  countLabel: {
    fontSize: 14,
    color: '#666',
  },
  profileInfo: {
    marginTop: 10,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  userBioWrapper: {
    marginTop: 10,
  },
  userBioTitle: {
    fontWeight: '600',
    marginBottom: 5,
  },
  userBio: {
    color: '#444',
    lineHeight: 20,
  },
  trenner: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 20,
  },
  editCategoriesButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  editCategoriesButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
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
  cardContainer: {
    backgroundColor: 'rgba(240, 240, 240, 0.3)',
    borderRadius: 16,
    padding: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
    width: '100%',
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    marginTop: 4,
    borderRadius: 12,
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    width: 36,
    height: 36,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#FF9F43',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfile;