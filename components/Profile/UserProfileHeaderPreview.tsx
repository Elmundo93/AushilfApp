import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { getIconForCategory, getBackgroundForCategory } from '../Pinnwand/utils/CategoryAndOptionUtils';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

// Typen für echten User oder Onboarding-Daten
type ProfileUserData = {
  fullName: string;
  email?: string;
  bio?: string;
  kategorien?: string[];
  profileImage?: string;
};

interface UserProfileHeaderProps {
  user: ProfileUserData;
  danksagungsLength: number;
  isEditable?: boolean;
  onCategoryToggle?: (category: string) => void;
  onBioChange?: (bio: string) => void;
}

const CATEGORIES = [
  { label: 'Garten', key: 'garten' },
  { label: 'Haushalt', key: 'haushalt' },
  { label: 'Soziales', key: 'soziales' },
  { label: 'Gastro', key: 'gastro' },
  { label: 'Handwerk', key: 'handwerk' },
  { label: 'Bildung', key: 'bildung' },
];

const UserProfileHeaderPreview: React.FC<UserProfileHeaderProps> = ({
  user,
  danksagungsLength,
  isEditable = false,
  onCategoryToggle,
  onBioChange,
}) => {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 48;
  const defaultFontSize = 22;
  const componentBaseFontSize = 25;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [localBio, setLocalBio] = useState(user.bio || '');

  const renderCategoryGrid = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.iconsContainer}>
          {CATEGORIES.map((category) => {
            const isSelected = user.kategorien?.includes(category.label);
            const categoryColor = getBackgroundForCategory(category.key).backgroundColor;
            const isGastro = category.key === 'gastro';
            
            if (isEditable) {
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
                  onPress={() => onCategoryToggle?.(category.label)}
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
            }

            return (
              <View
                key={category.key}
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
                    source={getIconForCategory(category.key)}
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
    );
  };

  const handleBioChange = (text: string) => {
    setLocalBio(text);
    onBioChange?.(text);
  };

  const renderBioSection = () => {
    if (!user.bio && !isEditable) return null;

    return (
      <View style={styles.userBioWrapper}>
        <View style={styles.bioHeader}>
          <Text style={[styles.userBioTitle, { fontSize: finalFontSize - 8 }]}>
            Über mich:
          </Text>
          {isEditable && (
            <TouchableOpacity 
              style={styles.bioToggleButton}
              onPress={() => setIsBioExpanded(!isBioExpanded)}
            >
              <Ionicons 
                name={isBioExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#666" 
              />
              <Text style={styles.bioToggleText}>
                {isBioExpanded ? "Speichern" : "Bearbeiten"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {isBioExpanded && isEditable ? (
          <View style={styles.bioInputContainer}>
            <TextInput
              style={[styles.bioInput, { fontSize: finalFontSize - 7 }]}
              multiline
              maxLength={300}
              value={localBio}
              onChangeText={handleBioChange}
              placeholder="Erzähle etwas über dich..."
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
            <Text style={styles.bioCharCount}>
              {localBio.length}/300 Zeichen
            </Text>
          </View>
        ) : (
          <Text style={[styles.userBio, { fontSize: finalFontSize - 8 }]} numberOfLines={3}>
            {localBio || user.bio || ''}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.profileTopRow}>
        <Image
          style={styles.profileImage}
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : require('@/assets/images/avatar-thinking-6-svgrepo-com.png')
          }
        />

        <View style={styles.thanksAndCategories}>
          <View style={styles.countCard}>
            <Text style={styles.countNumber}>{danksagungsLength}</Text>
            <Text style={styles.countLabel}>Danksagungen</Text>
          </View>
          {renderCategoryGrid()}
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={[styles.userName, { fontSize: finalFontSize }]} numberOfLines={1}>
          {user.fullName}
        </Text>
        {user.email && <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>}

        {renderBioSection()}
      </View>

      <View style={styles.trenner} />
      <View style={styles.lottieContainer}>
            {[1, 2, 3].map((_, index) => (
              <LottieView
                key={index}
                source={require('@/assets/animations/SpinnigGreenArrow.json')}
                autoPlay
                loop
                style={styles.lottie}
              />
            ))}
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  thanksAndCategories: {
    flex: 1,
  },
  countCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 10,
    borderRadius: 20,
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
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userBioTitle: {
    fontWeight: '600',
  },
  bioToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'orange',
    paddingHorizontal: 8,
    marginVertical: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bioToggleText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 2,
  },
  bioInputContainer: {
    marginTop: 5,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    minHeight: 60,
    backgroundColor: '#fff',
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  bioCharCount: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
    marginTop: 2,
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
  cardContainer: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 12,
    marginVertical: 8,
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
    marginBottom: 8,
    marginTop: 8,
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
  lottieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
  },
  lottie: {
    alignSelf: 'center',
    width: 100,
    height: 40,
    zIndex: 1000,
    transform: [{ rotate: '180deg' }],
  },
});

export default React.memo(UserProfileHeaderPreview);