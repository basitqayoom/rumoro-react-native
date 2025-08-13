import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRESET_CHANNELS, type Channel } from '../types/models';
import { Analytics } from '../services/analytics';

export default function ComposeScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const params = useLocalSearchParams();
    const { profileId, profileHandle, channelId } = params;
    
    const [selectedChannel, setSelectedChannel] = useState<string>(channelId as string || 'misc');
    const [gossipContent, setGossipContent] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    
    const MAX_CHARACTERS = 800;
    const remainingChars = MAX_CHARACTERS - gossipContent.length;
    
    useEffect(() => {
        Analytics.trackCompose('open', selectedChannel);
    }, []);
    
    const channels: Channel[] = [
        ...PRESET_CHANNELS.map((name) => ({
            id: name.toLowerCase().replace(/[\/\s]/g, '-'),
            profileId: profileId as string || '1',
            name,
            type: 'preset' as const,
            createdAt: new Date(),
            gossipCount: 0,
            isActive: true
        })),
        {
            id: 'startup-stories',
            profileId: profileId as string || '1',
            name: 'Startup Stories',
            type: 'user-created',
            createdBy: 'user123',
            createdAt: new Date(),
            gossipCount: 0,
            isActive: true
        }
    ];
    
    const checkContentWarnings = (text: string) => {
        const warningKeywords = [
            { pattern: /\b(address|phone|email|ssn|social security)\b/gi, message: 'This might contain personal information' },
            { pattern: /\b(hate|kill|die|attack)\b/gi, message: 'This content might violate community guidelines' },
            { pattern: /\b(password|credit card|bank account)\b/gi, message: 'Never share sensitive information' }
        ];
        
        for (const { pattern, message } of warningKeywords) {
            if (pattern.test(text)) {
                setWarningMessage(message);
                setShowWarning(true);
                return;
            }
        }
        
        setShowWarning(false);
        setWarningMessage('');
    };
    
    const handleContentChange = (text: string) => {
        if (text.length <= MAX_CHARACTERS) {
            setGossipContent(text);
            checkContentWarnings(text);
        }
    };
    
    const handlePost = () => {
        if (!gossipContent.trim()) {
            Alert.alert('Error', 'Please write something before posting');
            return;
        }
        
        if (gossipContent.trim().length < 10) {
            Alert.alert('Error', 'Your gossip is too short. Add more details!');
            return;
        }
        
        Alert.alert(
            'Post Gossip?',
            'Your gossip will be posted anonymously. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Post',
                    onPress: () => {
                        Analytics.trackCompose('post', selectedChannel, gossipContent.length);
                        Alert.alert('Success', 'Your gossip has been posted!');
                        router.back();
                    }
                }
            ]
        );
    };
    
    const handleCreateChannel = () => {
        Alert.alert(
            'Create Channel',
            'Creating a custom channel costs 30 Buzz. You currently have 150 Buzz.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Create (30 Buzz)',
                    onPress: () => {
                        router.push('/create-channel');
                    }
                }
            ]
        );
    };
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Create Gossip</ThemedText>
                    <TouchableOpacity 
                        onPress={handlePost}
                        style={[styles.postButton, !gossipContent.trim() && styles.postButtonDisabled]}
                        disabled={!gossipContent.trim()}
                    >
                        <ThemedText style={[
                            styles.postButtonText,
                            !gossipContent.trim() && styles.postButtonTextDisabled
                        ]}>
                            Post
                        </ThemedText>
                    </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.targetInfo}>
                        <Ionicons name="person-circle" size={32} color="#6B7280" />
                        <View style={styles.targetDetails}>
                            <ThemedText style={styles.targetLabel}>Posting about</ThemedText>
                            <ThemedText style={styles.targetName}>
                                {profileHandle || '@johndoe'}
                            </ThemedText>
                        </View>
                    </View>
                    
                    <View style={styles.channelSection}>
                        <View style={styles.channelHeader}>
                            <ThemedText style={styles.sectionTitle}>Select Channel</ThemedText>
                            <TouchableOpacity onPress={handleCreateChannel}>
                                <ThemedText style={styles.createChannelButton}>+ Create New</ThemedText>
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={styles.channelsList}
                        >
                            {channels.map((channel) => (
                                <TouchableOpacity
                                    key={channel.id}
                                    style={[
                                        styles.channelChip,
                                        selectedChannel === channel.id && styles.channelChipActive
                                    ]}
                                    onPress={() => setSelectedChannel(channel.id)}
                                >
                                    <ThemedText style={[
                                        styles.channelChipText,
                                        selectedChannel === channel.id && styles.channelChipTextActive
                                    ]}>
                                        {channel.name}
                                    </ThemedText>
                                    {channel.type === 'user-created' && (
                                        <View style={styles.communityBadge}>
                                            <Ionicons name="people" size={12} color="#6B7280" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    
                    <View style={styles.inputSection}>
                        <TextInput
                            style={[styles.textInput, { color: colors.text }]}
                            placeholder="What's the tea? Spill it here..."
                            placeholderTextColor="#6B7280"
                            multiline
                            value={gossipContent}
                            onChangeText={handleContentChange}
                            autoFocus
                        />
                        
                        {showWarning && (
                            <View style={styles.warningBox}>
                                <Ionicons name="warning" size={16} color="#F59E0B" />
                                <ThemedText style={styles.warningText}>{warningMessage}</ThemedText>
                            </View>
                        )}
                        
                        <View style={styles.inputFooter}>
                            <View style={styles.anonymousBadge}>
                                <Ionicons name="eye-off" size={14} color="#10B981" />
                                <ThemedText style={styles.anonymousText}>Posting anonymously</ThemedText>
                            </View>
                            <ThemedText style={[
                                styles.charCount,
                                remainingChars < 50 && styles.charCountWarning,
                                remainingChars < 0 && styles.charCountError
                            ]}>
                                {remainingChars}
                            </ThemedText>
                        </View>
                    </View>
                    
                    <View style={styles.guidelines}>
                        <ThemedText style={styles.guidelinesTitle}>Community Guidelines</ThemedText>
                        <View style={styles.guidelineItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <ThemedText style={styles.guidelineText}>Keep it respectful and fun</ThemedText>
                        </View>
                        <View style={styles.guidelineItem}>
                            <Ionicons name="close-circle" size={16} color="#EF4444" />
                            <ThemedText style={styles.guidelineText}>No doxxing or personal info</ThemedText>
                        </View>
                        <View style={styles.guidelineItem}>
                            <Ionicons name="close-circle" size={16} color="#EF4444" />
                            <ThemedText style={styles.guidelineText}>No hate speech or threats</ThemedText>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    postButton: {
        backgroundColor: '#FF4D6D',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButtonDisabled: {
        backgroundColor: '#FFB3C1',
    },
    postButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    postButtonTextDisabled: {
        color: '#FFFFFF',
        opacity: 0.7,
    },
    content: {
        flex: 1,
    },
    targetInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    targetDetails: {
        marginLeft: 12,
    },
    targetLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    targetName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111114',
    },
    channelSection: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    channelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111114',
    },
    createChannelButton: {
        fontSize: 14,
        color: '#FF4D6D',
        fontWeight: '500',
    },
    channelsList: {
        paddingHorizontal: 20,
    },
    channelChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    channelChipActive: {
        backgroundColor: '#FF4D6D',
    },
    channelChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    channelChipTextActive: {
        color: '#FFFFFF',
    },
    communityBadge: {
        marginLeft: 4,
    },
    inputSection: {
        padding: 20,
    },
    textInput: {
        fontSize: 16,
        lineHeight: 24,
        minHeight: 150,
        textAlignVertical: 'top',
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        gap: 8,
    },
    warningText: {
        fontSize: 14,
        color: '#92400E',
        flex: 1,
    },
    inputFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    anonymousBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    anonymousText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '500',
    },
    charCount: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    charCountWarning: {
        color: '#F59E0B',
    },
    charCountError: {
        color: '#EF4444',
    },
    guidelines: {
        padding: 20,
        backgroundColor: '#F9FAFB',
    },
    guidelinesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
    },
    guidelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    guidelineText: {
        fontSize: 13,
        color: '#6B7280',
    },
});