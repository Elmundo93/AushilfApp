import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Channel, MessageInput, MessageList } from 'stream-chat-expo';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { AuthProgressLoader } from '../../../../components/Auth/AuthProgressLoader/AuthProgressLoader';
import {Ionicons} from '@expo/vector-icons';
import { useChatContext } from 'stream-chat-expo'; 

import type { Channel as ChannelType } from 'stream-chat';


export default function ChannelScreen() {
    const [channel, setChannel] = useState<ChannelType | null>(null);
    const { cid } = useLocalSearchParams<{ cid: string }>();
    const router = useRouter();
  
    

    const { client } = useChatContext();

    useEffect(() => {
        const fetchChannel = async () => {
            if (!cid) {
                console.error('CID ist nicht definiert.');
                return;
            }

            try {
                console.log('Querying channels with cid:', cid);
                const channels = await client.queryChannels({ cid: { $eq: cid } });
                console.log('Fetched channels:', channels);
                setChannel(channels[0]);
            } catch (error) {
                console.error('Fehler beim Abrufen des Kanals:', error);
                setChannel(null);
            }
        };

        fetchChannel();
    }, [cid]);

    if (channel === null) {
        return (
            <View style={styles.centered}>
                <Text>Fehler beim Laden des Kanals. Bitte versuchen Sie es später erneut.</Text>
            </View>
        );
    }

    if (!channel) {
        return <AuthProgressLoader />;
    }

    return (
        <SafeAreaView style={styles.container}>
             <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/(authenticated)/nachrichten')}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                    <Text style={styles.backButton}>Zurück</Text>
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.select({ ios: 135, android: 500 })}
            >
                <Channel
                    audioRecordingEnabled={true}
                    channel={channel}
                >
                    <View style={styles.flex}>
                        <MessageList />
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
            fontSize: 18,
            fontWeight: 'bold',
        },
    });