import React, { useContext } from 'react'
import { Link } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontSizeContext } from '@/components/provider/FontSizeContext';

const SettingsHeader = () => {
    const { fontSize } = useContext(FontSizeContext);
    const defaultFontSize = 22;
    const minIconSize = 54;
    const maxIconSize = 68;
    const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);

    return (
        <Link href="/(modal)/einstellungen" asChild>
            <TouchableOpacity style={{ 
                width: iconSize, 
                height: iconSize, 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}> 
                <Ionicons name="settings-outline" size={iconSize * 0.8} color="black" />
            </TouchableOpacity>
        </Link>
    )
}

export default SettingsHeader