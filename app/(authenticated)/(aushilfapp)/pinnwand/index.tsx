import React, { useEffect, useCallback, useRef } from 'react';
import { View, Animated, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
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




if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Pinnwand: React.FC = () => {
  const location = useLocationStore((state) => state.location);
  const { locationPermission } = useLocationStore();
  const { filteredPosts, loading } = usePostStore();
  const reversedPosts = [...filteredPosts].reverse();



  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isAccordionExpanded, setIsAccordionExpanded] = React.useState(false);



  






  const toggleAccordion = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAccordionExpanded(prev => !prev);
  }, []);



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

  return (
    <SafeAreaView style={styles.container}>
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
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <FlatList
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
          data={reversedPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyListComponent />}
          refreshControl={<RefreshHandler location={location} />}
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
    marginTop: -50,
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