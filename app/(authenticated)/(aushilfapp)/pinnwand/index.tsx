import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Animated } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { FlatList } from 'react-native-gesture-handler';
import { usePostStore } from '@/components/stores/postStores';
import LottieView from 'lottie-react-native';
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
import { applyFilters } from '@/components/Pinnwand/utils/FilterLogic';
import FilterAccordion from '@/components/Pinnwand/Accordion/FilterAccordion';
import { handleSuchenBietenChange, handleCategoryChange } from '@/components/Pinnwand/utils/FilterHelpers';
import CustomCheckbox from '@/components/Pinnwand/Checkboxes/CustomCheckbox';
import PostItem from '@/components/Pinnwand/PostItem';
import RefreshHandler from '@/components/Pinnwand/RefreshHandler';
import { useLocationRequest } from '@/components/Location/locationRequest';
import { StyleSheet } from 'react-native';
import EmptyListComponent from '@/components/Pinnwand/EmptyListComponent';
import { useLoading } from '@/components/provider/LoadingContext';
import { initPostsDatabase } from '@/components/Crud/SQLite/Create/create&save&getPostDB';
import { initDanksagungenDatabase, saveDanksagungenToSQLite } from '@/components/Crud/SQLite/Create/create&save&getDanksagungenDB';
import { getPostsFromSQLite, savePostsToSQLite } from '@/components/Crud/SQLite/Create/create&save&getPostDB';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PinnwandFilters: React.FC = () => {
  const { isLoading, setIsLoading } = useLoading();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [suchenChecked, setSuchenChecked] = useState(false);
  const [bietenChecked, setBietenChecked] = useState(false);
  const [gartenChecked, setGartenChecked] = useState(false);
  const [haushaltChecked, setHaushaltChecked] = useState(false);
  const [sozialesChecked, setSozialesChecked] = useState(false);
  const [gastroChecked, setGastroChecked] = useState(false);
  const [handwerkChecked, setHandwerkChecked] = useState(false);
  const [bildungChecked, setBildungChecked] = useState(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const postCount = usePostStore((state: any) => state.postCount);
  const setLocation = useLocationStore((state: any) => state.setLocation);

  const fadeAnim = useRef(new Animated.Value(0)).current; // 

  const toggleAccordion = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAccordionExpanded(!isAccordionExpanded);
  }, [isAccordionExpanded]);

  useLocationRequest();



  useEffect(() => {
    const loadPostsAndDanksagungen = async () => {
      setLoading(true);
      try {
        // Datenbanken initialisieren
        await initPostsDatabase();
        await initDanksagungenDatabase();

        // Daten von Supabase abrufen und in SQLite speichern
        await savePostsToSQLite();
        await saveDanksagungenToSQLite();

        // Daten aus SQLite abrufen
        const postsList = await getPostsFromSQLite();
        setPosts(postsList as Post[]);
        setFilteredPosts(postsList as Post[]);
      } catch (error) {
        console.error('Fehler beim Laden der Posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPostsAndDanksagungen();
  }, [postCount]);


useEffect(() => {
  console.log('Loading state:', loading); // For debugging

  if (!loading) {
    fadeAnim.setValue(0); // Reset to invisible
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in to full opacity
      duration: 1000, // 1 second duration
      useNativeDriver: true,
    }).start();
  }
}, [loading, fadeAnim]);

  const applyFiltersCallback = useCallback(() => {
    const filtered = applyFilters(
      posts,
      suchenChecked,
      bietenChecked,
      gartenChecked,
      haushaltChecked,
      sozialesChecked,
      gastroChecked,
      handwerkChecked,
      bildungChecked
    );
    setFilteredPosts(filtered);
  }, [posts, suchenChecked, bietenChecked, gartenChecked, haushaltChecked, sozialesChecked, gastroChecked, handwerkChecked, bildungChecked]);


  useEffect(() => {
    applyFiltersCallback();
  }, [applyFiltersCallback]);


  const handleSuchenBietenChangeCallback = useCallback((option: string) => {
    handleSuchenBietenChange(option, suchenChecked, bietenChecked, setSuchenChecked, setBietenChecked);
  }, [suchenChecked, bietenChecked]);

  const handleCategoryChangeCallback = useCallback((category: string) => {
    handleCategoryChange(category, setGartenChecked, setHaushaltChecked, setSozialesChecked, setGastroChecked, setHandwerkChecked, setBildungChecked);
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
          <View style={styles.spacer} />
          <LottieView
            source={require('@/assets/animations/LoadingWarp.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      ) : (
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
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
                handwerkChecked={handwerkChecked}
                bildungChecked={bildungChecked}
                handleSuchenBietenChange={handleSuchenBietenChangeCallback}
                handleCategoryChange={handleCategoryChangeCallback}
              />
            </>
          }
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyListComponent />
          }
          refreshControl={
            <RefreshHandler onRefreshComplete={handleRefreshComplete} />
          }
        />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  marginTop:-50}
  ,
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 300,
    height: 300,
  },
  spacer: {
    height: 150,
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

  },
});

export default PinnwandFilters;