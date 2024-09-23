import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPosts } from '@/components/Crud/Post/FetchPost';
import { FlatList } from 'react-native-gesture-handler';
import { usePostStore } from '@/components/stores/postStores';
import * as Location from 'expo-location';
import { useLocationStore } from '@/components/stores/locationStore';
import {
  Platform,
  UIManager,
  LayoutAnimation
} from 'react-native';
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { Post } from '@/components/types/post';
import PinnwandHeader from '@/components/Pinnwand/PinnwandHeader';
import { applyFilters } from '@/components/utils/FilterLogic';
import FilterAccordion from '@/components/Accordion/FilterAccordion';
import { handleSuchenBietenChange, handleCategoryChange } from '@/components/utils/FilterHelpers';
import CustomCheckbox from '@/components/Checkboxes/CustomCheckbox';
import PostItem from '@/components/Pinnwand/PostItem';
import RefreshHandler from '@/components/Pinnwand/RefreshHandler';


const PinnwandFilters: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [suchenChecked, setSuchenChecked] = useState(false);
  const [bietenChecked, setBietenChecked] = useState(false);
  const [gartenChecked, setGartenChecked] = useState(false);
  const [haushaltChecked, setHaushaltChecked] = useState(false);
  const [sozialesChecked, setSozialesChecked] = useState(false);
  const [gastroChecked, setGastroChecked] = useState(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const postCount = usePostStore((state: any) => state.postCount);
  const setLocation = useLocationStore((state: any) => state.setLocation);

  const toggleAccordion = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAccordionExpanded(!isAccordionExpanded);
  }, [isAccordionExpanded]);



  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status === 'undetermined') {
        return new Promise((resolve) => {
          Alert.alert(
            "Standortberechtigung",
            "Diese App benötigt Zugriff auf Ihren Standort, um Ihnen relevante Inhalte anzuzeigen. Möchten Sie den Zugriff erlauben?",
            [
              {
                text: "Nein",
                onPress: () => resolve(false),
                style: "cancel"
              },
              {
                text: "Ja",
                onPress: () => resolve(true)
              }
            ]
          );
        });
      }
      
      return status === 'granted';
    };

    const requestAndSetLocation = async () => {
      const hasPermission = await getLocationPermission();
      
      if (hasPermission) {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Standortberechtigung wurde verweigert');
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (error) {
          console.error('Fehler beim Abrufen des Standorts:', error);
        }
      } else {
        console.log('Standortberechtigung wurde nicht erteilt');
      }
    };

    requestAndSetLocation();
  }, [setLocation]);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const postsList = await fetchPosts();
        setPosts(postsList);
        setFilteredPosts(postsList);
      } catch (error) {
        console.error('Fehler beim Laden der Posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [postCount]);

  const applyFiltersCallback = useCallback(() => {
    const filtered = applyFilters(
      posts,
      suchenChecked,
      bietenChecked,
      gartenChecked,
      haushaltChecked,
      sozialesChecked,
      gastroChecked
    );
    setFilteredPosts(filtered);
  }, [posts, suchenChecked, bietenChecked, gartenChecked, haushaltChecked, sozialesChecked, gastroChecked]);


  useEffect(() => {
    applyFiltersCallback();
  }, [applyFiltersCallback]);


  const handleSuchenBietenChangeCallback = useCallback((option: string) => {
    handleSuchenBietenChange(option, suchenChecked, bietenChecked, setSuchenChecked, setBietenChecked);
  }, [suchenChecked, bietenChecked]);

  const handleCategoryChangeCallback = useCallback((category: string) => {
    handleCategoryChange(category, setGartenChecked, setHaushaltChecked, setSozialesChecked, setGastroChecked);
  }, []);


  const handleRefreshComplete = useCallback((refreshedPosts: Post[]) => {
    setPosts(refreshedPosts);
    setFilteredPosts(refreshedPosts);
  }, []);


  const renderCheckbox = useCallback((label: string, isChecked: boolean, onCheck: () => void) => (
    <CustomCheckbox
      key={label}
      label={label}
      isChecked={isChecked}
      onCheck={onCheck}
    />
  ), []);


  const renderItem = useCallback(({ item }: { item: Post }) => {
    if (!item) {
      console.error('Item ist null oder undefiniert');
      return null;
    }
    return <PostItem item={item} />;
  }, []);
  

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <Text>Lädt...</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <PinnwandHeader />
              <FilterAccordion 
                isExpanded={isAccordionExpanded}
                onToggle={toggleAccordion}
                renderCheckbox={renderCheckbox}
                suchenChecked={suchenChecked}
                bietenChecked={bietenChecked}
                gartenChecked={gartenChecked}
                haushaltChecked={haushaltChecked}
                sozialesChecked={sozialesChecked}
                gastroChecked={gastroChecked}
                handleSuchenBietenChange={handleSuchenBietenChangeCallback}
                handleCategoryChange={handleCategoryChangeCallback}
              />
            </>
          }
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>Kein Eintrag für diese Kategorie gefunden 🤷</Text>
              <Text style={styles.emptyListText}>Bitte wähle einen anderen Filter!✌️</Text>
            </View>
          }
          refreshControl={
            <RefreshHandler onRefreshComplete={handleRefreshComplete} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = createRStyle({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: '-25rs',
  },
  loaderContainer: {
    justifyContent: 'space-between'
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
    fontSize: 30,
  },
});

export default PinnwandFilters;