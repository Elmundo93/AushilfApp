import {
	createMaterialTopTabNavigator,
	MaterialTopTabNavigationOptions,
	MaterialTopTabNavigationEventMap
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
	MaterialTopTabNavigationOptions & { href?: any },
	typeof Navigator,
	TabNavigationState<ParamListBase>,
	MaterialTopTabNavigationEventMap
>(Navigator);
const TabLayout = () => {
	const { fontSize } = useContext(FontSizeContext);
	const maxFontSize = 15; // Passen Sie diesen Wert nach Bedarf an
	const defaultFontSize = 15; // Standard-Schriftgröße im Kontext
	const componentBaseFontSize = 15; // Ausgangsschriftgröße für das Label
	const minIconSize = 35;
	const maxIconSize = 60;
	const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
	const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
	const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
	
	const screenOptions: MaterialTopTabNavigationOptions = {
		tabBarActiveTintColor: 'orange',

		tabBarInactiveTintColor: '#131620',
		tabBarLabelStyle: { 
		  fontSize: finalFontSize, 
		  textTransform: 'capitalize', 
		  fontWeight: 'bold',
		  lineHeight: 25 
		},
		tabBarIndicatorStyle: { backgroundColor: 'orange' },
		
	  };

	return (
	    <MaterialTopTabs screenOptions={screenOptions}>
			<MaterialTopTabs.Screen name="nachrichten" options={{ title: 'Nachrichten', tabBarLabelStyle: {lineHeight: 25, fontSize: finalFontSize, fontWeight: 'bold' } }} />
			<MaterialTopTabs.Screen name="pinnwand" options={{ title: 'Pinnwand', tabBarLabelStyle: {lineHeight: 25, fontSize: finalFontSize, fontWeight: 'bold' } }} />
			
			<MaterialTopTabs.Screen name="anmeldung" options={{ title: 'Anmeldung', tabBarLabelStyle: {lineHeight: 25, fontSize: finalFontSize, fontWeight: 'bold' } }} />
		</MaterialTopTabs>
	);
};

export default TabLayout;
