import React, { useEffect, useCallback, useRef } from 'react';
import { View, Animated, StyleSheet, Platform, UIManager, LayoutAnimation, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

import PinnwandHeader from '@/components/Pinnwand/PinnwandHeader';
import FilterAccordion from '@/components/Pinnwand/Accordion/FilterAccordion';

import CustomCheckbox from '@/components/Pinnwand/Checkboxes/CustomCheckbox';
import PostItem from '@/components/Pinnwand/PostItem';
import EmptyListComponent from '@/components/Pinnwand/EmptyListComponent';

import { usePostStore } from '@/components/stores/postStore';

import RefreshHandler from '@/components/Pinnwand/RefreshHandler';
import AskForLocation from '@/components/Pinnwand/AskForLocation';
import { useLocationStore } from '@/components/stores/locationStore'
import BackgroundImage from '@/components/Onboarding/OnboardingBackground';
import { useSafeLoading } from '@/components/hooks/useLoading';



if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Pinnwand: React.FC = () => {
  const location = useLocationStore((state) => state.location);
  const { locationPermission } = useLocationStore();
  const { filteredPosts, loading: rawLoading } = usePostStore();

  // Use safe loading to prevent conflicts with global loading
  const loading = useSafeLoading(rawLoading);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isAccordionExpanded, setIsAccordionExpanded] = React.useState(false);

  // Fade-in animation on loading complete
  useEffect(() => {
    if (!loading) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, fadeAnim]);

  const toggleAccordion = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAccordionExpanded(prev => !prev);
  }, []);

  const renderCheckbox = useCallback((label: string, isChecked: boolean, onCheck: () => void) => (
    <CustomCheckbox
      key={label}
      label={label}
      isChecked={isChecked}
      onCheck={onCheck}
    />
  ), []);

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (!item) {
      console.error('Item is null or undefined');
      return null;
    }
    return <PostItem item={item} />;
  }, []);

  // Erstelle die Daten für die FlatList mit Header und Posts
  const listData = React.useMemo(() => {
    const data = [];
    
    // Header-Komponente als erstes Element
    data.push({
      id: 'header',
      type: 'header',
      component: <PinnwandHeader />
    });
    
    // FilterAccordion als zweites Element (wird sticky sein)
    data.push({
      id: 'filter',
      type: 'filter',
      component: (
        <FilterAccordion
          isExpanded={isAccordionExpanded}
          onToggle={toggleAccordion}
          renderCheckbox={renderCheckbox}
        />
      )
    });
    
    // Posts hinzufügen
    filteredPosts.forEach(post => {
      data.push({
        id: post.id,
        type: 'post',
        post: post
      });
    });
    
    return data;
  }, [filteredPosts, isAccordionExpanded, toggleAccordion, renderCheckbox]);

  const renderListItem = useCallback(({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return item.component;
      case 'filter':
        return item.component;
      case 'post':
        return <PostItem item={item.post} />;
      default:
        return null;
    }
  }, []);

  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage step="pinnwand" />
    {!locationPermission ? (
      <AskForLocation />
    ) : loading ? (
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
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Animated.FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyListComponent />}
          refreshControl={<RefreshHandler location={location} />}
          ListHeaderComponent={
            <>
              <PinnwandHeader />
              <FilterAccordion
                isExpanded={isAccordionExpanded}
                onToggle={toggleAccordion}
                renderCheckbox={renderCheckbox}
              />
            </>
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
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
    marginTop: -85,
  },
  stickyHeaderStyle: {
    marginTop: -20, // Move sticky header higher
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 165, 0, 0.2)',
   
  },
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

export default Pinnwand;