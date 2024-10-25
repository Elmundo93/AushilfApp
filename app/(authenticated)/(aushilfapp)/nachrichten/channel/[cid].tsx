import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Channel, MessageInput, MessageList } from 'stream-chat-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';

 
import { useAuthStore } from '@/components/stores/AuthStore';
import { ActivityIndicator } from 'react-native';

import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';

import type { Channel as ChannelType } from 'stream-chat';



export default function ChannelScreen() {
    const { cid } = useLocalSearchParams<{ cid: string }>();
    const [channel, setChannel] = useState<ChannelType | null>(null);
    const [loading, setLoading] = useState(true);
    const client = useAuthStore.getState().streamChatClient;
    const { fontSize } = useContext(FontSizeContext);

  
    useEffect(() => {
        const fetchChannel = async () => {
          if (!client || !cid) return;
    
          try {
            // cid aufteilen, um channelType und channelId zu erhalten
            const [channelType, channelId] = cid.split(':');
            const channel = client.channel(channelType, channelId);
            await channel.watch();
            setChannel(channel);
          } catch (error) {
            console.error('Fehler beim Abrufen des Kanals:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchChannel();
      }, [client, cid]);
    
      if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
      }
    
      if (!channel) {
        return <Text style={[ { fontSize }]}>Kanal nicht gefunden</Text>;
      }
    
      return (
        <SafeAreaView style={styles.container}>
             
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.select({ ios: 135, android: 500 })}
            >
                <Channel
                    channel={channel}
                    
                    
                >
                    <View style={styles.flex}>
                        <MessageList  />
                        <MessageInput />
                    </View>
                </Channel>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )}

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        flex: {
            flex: 1,
        },
        centered: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#f8f8f8',
        },
        backButton: {
            color: '#007bff',
            marginRight: 10,
            alignSelf: 'flex-start',
        },
        headerText: {

            fontWeight: 'bold',
        },
    });