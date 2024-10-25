import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createRStyle } from 'react-native-full-responsive';
import { AccordionItemProps } from '../types/components';
import { useContext } from 'react';
import { FontSizeContext } from '@/components/provider/FontSizeContext';


function AccordionItem({ children, title, isExpanded, onToggle }: AccordionItemProps): JSX.Element {
  
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 50; // Passen Sie diesen Wert nach Bedarf an

  // Begrenzen Sie die Schriftgröße auf den maximalen Wert
  const adjustedFontSize = Math.min(fontSize, maxFontSize);

  const body = <View style={styles.accordBody}>{children}</View>;

  return (
    <View style={styles.accordContainer}>
      <TouchableOpacity style={styles.accordHeader} onPress={onToggle}>
        <Text style={[styles.accordTitle, { fontSize: adjustedFontSize }]}>{title}</Text>
        <MaterialCommunityIcons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20} 
          color="#bbb" 
        />
      </TouchableOpacity>
      {isExpanded && body}
    </View>
  );
}

  const styles = StyleSheet.create({
    accordContainer: {
      borderWidth: 1,
      borderColor: 'lightgrey',
      borderRadius: 25,
    },
    accordHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    accordTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    accordBody: {
      padding: 25,
      borderTopWidth: 1,
      borderColor: 'lightgrey',
    },
  });

  export default AccordionItem;