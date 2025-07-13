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
  // Calculate dynamic line height based on font size
  const dynamicLineHeight = finalFontSize * 1.4; // 1.4x the font size for good readability
  const headerLineHeight = finalFontSize * 1.3;
  const dateLineHeight = finalFontSize * 1.2;

  return (
    <View style={styles.contentContainer}>
      <Text 
        style={[
          styles.headerText, 
          { 
            fontSize: finalFontSize,
            lineHeight: headerLineHeight
          }
        ]} 
        numberOfLines={0}
      >
        {`${option === 'bieten' ? 'bietet' : 'sucht'} in ${location} im Bereich ${
          category.charAt(0).toUpperCase() + category.slice(1)
        }`}
      </Text>
      <View style={styles.trenner} />
      <Text 
        style={[
          styles.postText, 
          { 
            fontSize: finalFontSize,
            lineHeight: dynamicLineHeight
          }
        ]} 
        numberOfLines={0}
      >
        {postText}
      </Text>
      <Text 
        style={[
          styles.dateText, 
          { 
            fontSize: finalFontSize,
            lineHeight: dateLineHeight
          }
        ]} 
        numberOfLines={0}
      >
        {formatDate(created_at)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 20,
        borderRadius: 8,
        marginHorizontal: 8,
        marginTop: 16,
        marginBottom: 16,
        minHeight: 250, // Increased minimum height
    },
      postText: {
        alignSelf: 'stretch',
        textAlign: 'left',
        color: '#333',
        flex: 1, // Allow text to expand
        flexWrap: 'wrap',
        paddingVertical: 8, // Add vertical padding for better spacing
      },
      dateText: {
        color: '#666',
        alignSelf: 'flex-end',
        marginTop: 16,
        fontStyle: 'italic',
        flexWrap: 'wrap',
        paddingVertical: 4, // Add some padding
      },
      trenner: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        marginVertical: 16,
        borderRadius: 1,
      },
      headerText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        flexWrap: 'wrap',
        paddingVertical: 4, // Add some padding
      }
});