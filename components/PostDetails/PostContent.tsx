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
        {`${option === 'bieten' ? 'bietet' : 'sucht'} in ${location} im Bereich ${
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
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 16,
    },
      postText: {
        fontSize: 16,
        alignSelf: 'center',
        lineHeight: 24,
        textAlign: 'left',
        color: '#333',
      },
      dateText: {
        fontSize: 14,
        color: '#666',
        alignSelf: 'flex-end',
        marginTop: 12,
        fontStyle: 'italic',
      },
      trenner: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        marginVertical: 16,
        borderRadius: 1,
      },
      headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        lineHeight: 28,
      }
});