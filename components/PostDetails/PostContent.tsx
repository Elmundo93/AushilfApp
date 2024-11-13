import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDate } from '@/components/Pinnwand/utils/Formatter';

interface PostContentProps {
  option: string;
  location: string;
  category: string;
  postText: string;
  created_at: string;
  finalFontSize: number;
}

export function PostContent({
  option,
  location,
  category,
  postText,
  created_at,
  finalFontSize
}: PostContentProps) {
  return (
    <View style={styles.contentContainer}>
      <Text style={[styles.headerText, { fontSize: finalFontSize }]}>
        {`Aushilfe ${option === 'bieten' ? 'geboten' : 'gesucht'} in ${location} im Bereich ${
          category.charAt(0).toUpperCase() + category.slice(1)
        }`}
      </Text>
      <View style={styles.trenner} />
      <Text style={[styles.postText, { fontSize: finalFontSize }]}>{postText}</Text>
      <Text style={[styles.dateText, { fontSize: finalFontSize }]}>{formatDate(created_at)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    contentContainer: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 16,
    
        
      },
      postText: {
        fontSize: 16,
        alignSelf: 'center',
      },
      dateText: {
        fontSize: 14,
        color: 'gray',
        alignSelf: 'flex-end',
      },
      trenner: {
        height: 1,
        width: '100%',
        backgroundColor: 'gray',
        marginVertical: 16,
      },
      headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
      }
});