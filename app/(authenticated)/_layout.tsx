import {
	createMaterialTopTabNavigator,
	MaterialTopTabNavigationOptions,
	MaterialTopTabNavigationEventMap
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
	MaterialTopTabNavigationOptions & { href?: any },
	typeof Navigator,
	TabNavigationState<ParamListBase>,
	MaterialTopTabNavigationEventMap
>(Navigator);
const TabLayout = () => {
	return (
		<MaterialTopTabs
			screenOptions={{
				tabBarActiveTintColor: '#131620',
				tabBarLabelStyle: { fontSize: 14, textTransform: 'capitalize', fontWeight: 'bold' },
				tabBarIndicatorStyle: { backgroundColor: '#1C87ED', height: 3 }
			}}
		>
			<MaterialTopTabs.Screen name="nachrichten" options={{ title: 'Nachrichten', tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' } }} />
			<MaterialTopTabs.Screen name="pinnwand" options={{ title: 'Pinnwand', tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' } }} />
			
			<MaterialTopTabs.Screen name="anmeldung" options={{ title: 'Anmeldung', tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' } }} />
		</MaterialTopTabs>
	);
};

export default TabLayout;
