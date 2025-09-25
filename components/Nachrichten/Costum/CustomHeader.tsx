// components/Nachrichten/CustomChatHeader.tsx
import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NachrichtenMenu from '../NachrichtenMenu';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/components/stores/AuthStore';
 import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useSQLiteContext } from 'expo-sqlite';
import { updateChannelCategory } from '@/components/services/Chat/chatApi';
import { useChannels } from '@/components/services/Chat/hooks/useChannels';
import { styles } from './customHStyles';

// Category icons
import GastroIconWithBackground from '@/assets/images/GastroIconWithBackground.png';
import GartenIconWithBackground from '@/assets/images/GartenIconWithBackground.png';
import HaushaltWithBackground from '@/assets/images/HaushaltWithBackground.png';
import SozialesIconWithBackground from '@/assets/images/SozialesIconWithBackground.png';
import HandwerkIconWithBackground from '@/assets/images/HandwerkIconWithBackground.png';
import BildungsIconWithBackground from '@/assets/images/BildungsIconWithBackground.png';
import { adjustChannelLocal } from '@/components/Crud/SQLite/Services/chat/channelService';
import { nowUnix } from '@/components/utils/chatutils';

const categoryIcons = {
  gastro: GastroIconWithBackground,
  garten: GartenIconWithBackground,
  haushalt: HaushaltWithBackground,
  soziales: SozialesIconWithBackground,
  handwerk: HandwerkIconWithBackground,
  bildung: BildungsIconWithBackground,
};

const categoryLabels = {
  gastro: 'Gastro',
  garten: 'Garten',
  haushalt: 'Haushalt',
  soziales: 'Soziales',
  handwerk: 'Handwerk',
  bildung: 'Bildung',
};

type Props = {
  otherUserImage: string;
  categoryIcon: any;
  otherUserName?: string;
  channelId?: string; // Pass channelId instead of channel object
};

const CustomChatHeader: React.FC<Props> = ({
  otherUserImage,
  otherUserName = '',
  categoryIcon,
  channelId,
}) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { fontSize } = useContext(FontSizeContext);
  const db = useSQLiteContext();
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Use SQLite hook to get channels
  const channels = useChannels(db);
  
  // Find channel using the new structure
  const channel = channelId ? channels.find((ch) => ch.id === channelId) : null;
  
  const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
  const isValidCategory = (category: string) => validCategories.includes(category);
  
  const currentCategory = (channel?.custom_post_category_choosen && isValidCategory(channel.custom_post_category_choosen)) 
    ? channel.custom_post_category_choosen 
    : channel?.custom_post_category || '';

  const adjustedFontSize = Math.min((fontSize / 24) * 16, 20);

  
const handleCategorySelect = async (category: string) => {
  if (!channelId) {
    Alert.alert('Fehler', 'Channel ID nicht verfügbar');
    return;
  }
  if (!channel) {
    Alert.alert('Fehler', 'Channel nicht gefunden. Bitte versuchen Sie es erneut.');
    return;
  }
  if (!isValidCategory(category)) {
    Alert.alert('Fehler', 'Ungültige Kategorie');
    return;
  }

  try {
    // 1) Optimistic local update (instant UI feedback)
    const previous = channel.custom_post_category_choosen || channel.custom_post_category || '';
    await adjustChannelLocal(db, channelId, category, { updated_at: nowUnix() });
    setSelectedCategory(category);
    setCategoryModalVisible(false);

    // 2) Server mutation
    const res = await updateChannelCategory(channelId, category);

    // 3) Reconcile using server updated_at (apply-if-newer)
    //    Convert server ISO -> unix (seconds or ms depending on nowUnix)
    const serverUpdatedUnix = Math.floor(new Date(res.updated_at).getTime() / 1000);
    await adjustChannelLocal(db, channelId, res.custom_category, { updated_at: serverUpdatedUnix });

    console.log('✅ Kategorie server-bestätigt:', res.custom_category);
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren der Kategorie:', error);

    // Rollback optimistic change (best-effort)
    const prev = channel?.custom_post_category_choosen || channel?.custom_post_category || '';
    await adjustChannelLocal(db, channelId, prev, { updated_at: nowUnix() });
    setSelectedCategory(prev);

    Alert.alert('Fehler', 'Kategorie konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.');
  }
};

  const handleBackPress = async () => {

    
    // Navigate back
    router.back();
  };

  const CategorySelectionModal = () => (
    <Modal
      visible={categoryModalVisible}
      animationType="fade"
      transparent
      onRequestClose={() => setCategoryModalVisible(false)}
    >
      <Pressable 
        style={categoryModalStyles.overlay} 
        onPress={() => setCategoryModalVisible(false)}
      >
        <View style={categoryModalStyles.modalContent}>
          <Text style={[categoryModalStyles.title, { fontSize: adjustedFontSize + 4 }]}>
            Kategorie auswählen
          </Text>
          
          <View style={categoryModalStyles.categoriesGrid}>
            {Object.entries(categoryIcons).map(([key, icon]) => (
              <TouchableOpacity
                key={key}
                style={[
                  categoryModalStyles.categoryItem,
                  currentCategory === key && categoryModalStyles.selectedCategory
                ]}
                onPress={() => handleCategorySelect(key)}
              >
                <Image source={icon as any} style={categoryModalStyles.categoryIcon} />
                <Text style={[
                  categoryModalStyles.categoryLabel, 
                  { fontSize: adjustedFontSize },
                  currentCategory === key && categoryModalStyles.selectedCategoryText
                ]}>
                  {categoryLabels[key as keyof typeof categoryLabels]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={categoryModalStyles.cancelButton}
            onPress={() => setCategoryModalVisible(false)}
          >
            <Text style={[categoryModalStyles.cancelText, { fontSize: adjustedFontSize }]}>
              Abbrechen
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['orange', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="chevron-back-circle-outline" size={36} color="#333" />
      </TouchableOpacity>

      <View style={styles.profileInfo}>
        <View style={styles.imagesRow}>
          <Image source={{ uri: user?.profileImageUrl }} style={styles.profileImage} />
          <Image source={{ uri: otherUserImage }} style={[styles.profileImage, { marginLeft: -10 }]} />
        </View>
        <Text style={styles.namesText} numberOfLines={1}>
          {otherUserName}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => {
          if (!channel) {
            Alert.alert('Hinweis', 'Channel-Daten werden noch geladen. Bitte warten Sie einen Moment.');
            return;
          }
          setCategoryModalVisible(true);
        }}
      >
        {categoryIcon && (
          <Image source={categoryIcon as any} style={styles.icon} />
        )}
        <View style={styles.editIndicator}>
          <Ionicons name="pencil" size={8} color="#666" />
        </View>
      </TouchableOpacity>
      
      <View style={styles.menuContainer}>
        <NachrichtenMenu iconSize={40} iconColor="#333" channelId={channelId} />
        <Text style={styles.menuHint}>⋯</Text>
      </View>

      <CategorySelectionModal />
    </View>
  );
};

const categoryModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 28,
    margin: 20,
    minWidth: 320,
    maxWidth: 420,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 18,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: 'rgba(255, 154, 0, 0.1)',
    borderColor: '#ff9a00',
    borderWidth: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
    borderRadius: 12,
  },
  categoryLabel: {
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#ff9a00',
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  cancelText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CustomChatHeader;