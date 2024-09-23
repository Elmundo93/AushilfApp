import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createRStyle } from 'react-native-full-responsive';
import { AccordionItemProps } from '../types/components';


function AccordionItem({ children, title, isExpanded, onToggle }: AccordionItemProps): JSX.Element {
  const body = <View style={styles.accordBody}>{children}</View>;

  return (
    <View style={styles.accordContainer}>
      <TouchableOpacity style={styles.accordHeader} onPress={onToggle}>
        <Text style={styles.accordTitle}>{title}</Text>
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

  const styles = createRStyle({
    accordContainer: {
      borderWidth: 1,
      borderColor: 'lightgrey',
      borderRadius: '25rs',
    },
    accordHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    accordTitle: {
      fontSize: '16rs',
      fontWeight: 'bold',
      color: '#333',
    },
    accordBody: {
      padding: '10rs',
      borderTopWidth: 1,
      borderColor: 'lightgrey',
    },
  });

  export default AccordionItem;