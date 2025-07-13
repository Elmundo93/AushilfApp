import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ForeignProfileAvatar from '@/components/Profile/ProfileImage/ForreignProfilAvatar';
import CreateDanksagung from '@/components/Crud/Danksagungen/createDanksagung';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { getIconForCategory, getBackgroundForCategory } from '@/components/Pinnwand/utils/CategoryAndOptionUtils';
import { CATEGORIES } from '@/components/Pinnwand/utils/CategoryAndOptionUtils';
import { CategoryType } from '@/components/types/stream';

interface ForreignProfileHeaderProps {
  vorname: string;
  nachname: string;
  bio?: string;
  userId: string;
  fontSize: number;
  danksagungCount: number;
  kategorien: string[];
}

const CATEGORY_LABELS: Record<CategoryType, string> = {
  garten: 'Garten',
  haushalt: 'Haushalt',
  gastro: 'Gastro',
  soziales: 'Soziales',
  handwerk: 'Handwerk',
  bildung: 'Bildung'
};

const normalizeCategory = (category: string): CategoryType => {
  const normalized = category.toLowerCase();
  return normalized as CategoryType;
};

const ForreignProfileHeader: React.FC<ForreignProfileHeaderProps> = ({
  vorname,
  nachname,
  bio,
  userId,
  fontSize,
  danksagungCount,
  kategorien
}) => {
  const { fontSize: contextFontSize } = useContext(FontSizeContext);
  const defaultFontSize = 22;
  const baseFontSize = 25;
  const maxFontSize = 48;
  const adjustedFontSize = (contextFontSize / defaultFontSize) * baseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const formatName = (v: string, n: string) => `${v} ${n.charAt(0)}.`;

  // Normalize all categories once
  const normalizedKategorien = kategorien.map(k => k.toLowerCase());

  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileTopRow}>
        <ForeignProfileAvatar />
        <View style={styles.thanksAndCategories}>
          <View style={styles.countCard}>
            <Text style={styles.countNumber}>{danksagungCount}</Text>
            <Text style={styles.countLabel}>Danksagungen</Text>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.iconsContainer}>
              {CATEGORIES.map((category) => {
                const isSelected = normalizedKategorien.includes(category);
                const categoryColor = getBackgroundForCategory(category).backgroundColor;
                
                return (
                  <View
                    key={category}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: isSelected 
                          ? categoryColor
                          : 'rgba(200, 200, 200, 0.3)',
                      },
                    ]}
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
                        source={getIconForCategory(category)}
                        style={[
                          styles.categoryIcon,
                          {
                            tintColor: '#444444',
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={[styles.userName, { fontSize: finalFontSize }]} numberOfLines={1}>
          {formatName(vorname, nachname)}
        </Text>

        <View style={styles.userBioWrapper}>
          <Text style={[styles.userBioTitle, { fontSize: finalFontSize - 8 }]}>
            Über mich:
          </Text>
          <Text style={[styles.userBio, { fontSize: finalFontSize - 8 }]} numberOfLines={2}>
            {bio || 'Keine Bio vorhanden.'}
          </Text>
        </View>

        <View style={styles.editBioButtonContainer}>
          <CreateDanksagung userId={userId} />
        </View>
      </View>

      <View style={styles.trenner} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  userBioWrapper: {
    marginTop: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  userBioTitle: {
    position: 'absolute',
    top: -19,
    left: 10,
    right: 10,
    bottom: 0,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
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
  editBioButtonContainer: {
    marginTop: 15,
  },
  cardContainer: {
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#ffffff',
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
});

export default ForreignProfileHeader;