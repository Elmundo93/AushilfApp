import {
	createMaterialTopTabNavigator,
	MaterialTopTabNavigationOptions,
	MaterialTopTabNavigationEventMap, // Import the missing type
  } from '@react-navigation/material-top-tabs';
  import { withLayoutContext } from 'expo-router';
  import { ParamListBase, TabNavigationState } from '@react-navigation/native';
  import { FontSizeContext } from '@/components/provider/FontSizeContext';
  import { useContext } from 'react';
  import { Text } from 'react-native';
  
  const { Navigator } = createMaterialTopTabNavigator();
  
  export const MaterialTopTabs = withLayoutContext<
	MaterialTopTabNavigationOptions & { href?: any },
	typeof Navigator,
	TabNavigationState<ParamListBase>,
	MaterialTopTabNavigationEventMap // Include the missing type argument
  >(Navigator);
  
  const TabLayout = () => {
	const { fontSize } = useContext(FontSizeContext);
	const maxFontSize = 22;
	const defaultFontSize = 15;
	const componentBaseFontSize = 28;
	const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
	const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  
	const screenOptions: MaterialTopTabNavigationOptions = {
	  tabBarActiveTintColor: 'orange',
	  tabBarInactiveTintColor: '#131620',
	  tabBarStyle: {
		display: 'flex',
	  },

	  tabBarIndicatorStyle: { backgroundColor: 'orange' },
	  tabBarItemStyle: { width: 'auto' },
	  tabBarScrollEnabled: true,
	};
  
	return (
	  <MaterialTopTabs screenOptions={screenOptions}>
		<MaterialTopTabs.Screen
		  name="nachrichten"
		  options={{
			title: 'Nachrichten',
			tabBarLabel: ({ color }) => (
			  <Text
				numberOfLines={1}
				adjustsFontSizeToFit
				style={{
				  lineHeight: 25,
				  fontSize: finalFontSize,
				  fontWeight: 'bold',
				  color,
				}}
			  >
				Nachrichten
			  </Text>
			),
		  }}
		/>
		<MaterialTopTabs.Screen
		  name="pinnwand"
		  options={{
			title: 'Pinnwand',
			tabBarLabel: ({ color }) => (
			  <Text
				numberOfLines={1}
				adjustsFontSizeToFit
				style={{
				  lineHeight: 25,
				  fontSize: finalFontSize,
				  fontWeight: 'bold',
				  color,
				}}
			  >
				Pinnwand
			  </Text>
			),
		  }}
		/>
		<MaterialTopTabs.Screen
		  name="anmeldung"
		  options={{
			title: 'Anmeldung',
			tabBarLabel: ({ color }) => (
			  <Text
				numberOfLines={1}
				adjustsFontSizeToFit
				style={{
				  lineHeight: 25,
				  fontSize: finalFontSize,
				  fontWeight: 'bold',
				  color,
				}}
			  >
				Anmeldung
			  </Text>
			),
		  }}
		/>
	  </MaterialTopTabs>
	);
  };
  
  export default TabLayout;