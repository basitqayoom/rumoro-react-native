import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Gossip, Reply } from '../types/models';

export default function GossipDetailScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const params = useLocalSearchParams();
    const { gossipId } = params;
    
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    
    // Mock gossip data
    const gossip: Gossip = {
        id: gossipId as string || '1',
        profileId: '1',
        channelId: 'tea-spill',
        authorId: 'anon1',
        content: 'I heard they\'re working on something big with AI. The whole team has been working late nights for weeks. Can\'t wait to see what they launch next! This could be a game changer for the industry.',
        replyCount: 12,
        createdAt: new Date(Date.now() - 3600000)
    };
    
    const [replies, setReplies] = useState<Reply[]>([
        {
            id: '1',
            gossipId: gossip.id,
            authorId: 'anon2',
            content: 'I\'ve heard the same! Someone mentioned it\'s related to their previous project but way more advanced.',
            createdAt: new Date(Date.now() - 3000000)
        },
        {
            id: '2',
            gossipId: gossip.id,
            authorId: 'anon3',
            content: 'My friend works there and they\'re super excited but can\'t say anything due to NDA 🤐',
            createdAt: new Date(Date.now() - 2400000)
        },
        {
            id: '3',
            gossipId: gossip.id,
            authorId: 'anon4',
            content: 'This better be worth the hype! Last time they promised something revolutionary it was just okay.',
            createdAt: new Date(Date.now() - 1800000)
        },
        {
            id: '4',
            gossipId: gossip.id,
            authorId: 'anon5',
            content: 'I think I saw a demo at a conference last month. If it\'s what I think it is, it\'s going to be huge!',
            createdAt: new Date(Date.now() - 1200000)
        }
    ]);
    
    const handleReply = () => {
        if (!replyText.trim()) {
            Alert.alert('Error', 'Please write something before replying');
            return;
        }
        
        if (replyText.trim().length < 3) {
            Alert.alert('Error', 'Your reply is too short');
            return;
        }
        
        setIsReplying(true);
        
        // Simulate API call
        setTimeout(() => {
            const newReply: Reply = {
                id: Date.now().toString(),
                gossipId: gossip.id,
                authorId: 'current_user',
                content: replyText,
                createdAt: new Date()
            };
            
            setReplies([...replies, newReply]);
            setReplyText('');
            setIsReplying(false);
            Alert.alert('Success', 'Your reply has been posted anonymously!');
        }, 1000);
    };
    
    const handleReport = () => {
        router.push({
            pathname: '/report-content',
            params: {
                contentType: 'gossip',
                contentId: gossip.id
            }
        });
    };
    
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };
    
    const renderReply = ({ item }: { item: Reply }) => (
        <View style={[styles.replyCard, { backgroundColor: colors.card }]}>
            <View style={styles.replyHeader}>
                <View style={styles.anonymousAvatar}>
                    <Ionicons name="person" size={16} color="#6B7280" />
                </View>
                <ThemedText style={styles.anonymousText}>Anonymous</ThemedText>
                <ThemedText style={styles.replyTime}>{formatTime(item.createdAt)}</ThemedText>
            </View>
            <ThemedText style={styles.replyContent}>{item.content}</ThemedText>
        </View>
    );
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Gossip</ThemedText>
                    <TouchableOpacity onPress={handleReport} style={styles.reportButton}>
                        <Ionicons name="flag-outline" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={[styles.gossipCard, { backgroundColor: colors.card }]}>
                        <View style={styles.gossipHeader}>
                            <View style={styles.anonymousAvatarLarge}>
                                <Ionicons name="person" size={24} color="#6B7280" />
                            </View>
                            <View style={styles.gossipMeta}>
                                <ThemedText style={styles.anonymousName}>Anonymous</ThemedText>
                                <View style={styles.channelBadge}>
                                    <ThemedText style={styles.channelName}>Tea/Spill</ThemedText>
                                </View>
                            </View>
                            <ThemedText style={styles.gossipTime}>{formatTime(gossip.createdAt)}</ThemedText>
                        </View>
                        
                        <ThemedText style={styles.gossipContent}>{gossip.content}</ThemedText>
                        
                        <View style={styles.gossipStats}>
                            <View style={styles.statItem}>
                                <Ionicons name="chatbubbles-outline" size={18} color="#6B7280" />
                                <ThemedText style={styles.statText}>{replies.length} replies</ThemedText>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.repliesSection}>
                        <ThemedText style={styles.sectionTitle}>Replies ({replies.length})</ThemedText>
                        <FlatList
                            data={replies}
                            renderItem={renderReply}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                        />
                    </View>
                    
                    <View style={{ height: 100 }} />
                </ScrollView>
                
                <View style={[styles.replyInputContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.replyInputWrapper}>
                        <TextInput
                            style={[styles.replyInput, { color: colors.text }]}
                            placeholder="Add your anonymous reply..."
                            placeholderTextColor="#6B7280"
                            value={replyText}
                            onChangeText={setReplyText}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity 
                            style={[
                                styles.sendButton,
                                (!replyText.trim() || isReplying) && styles.sendButtonDisabled
                            ]}
                            onPress={handleReply}
                            disabled={!replyText.trim() || isReplying}
                        >
                            <Ionicons 
                                name="send" 
                                size={20} 
                                color={replyText.trim() && !isReplying ? '#FF4D6D' : '#FFB3C1'} 
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.replyHelper}>
                        <View style={styles.anonymousBadge}>
                            <Ionicons name="eye-off" size={12} color="#10B981" />
                            <ThemedText style={styles.anonymousHelperText}>Replying anonymously</ThemedText>
                        </View>
                        <ThemedText style={styles.charCount}>{500 - replyText.length}</ThemedText>
                    </View>
                </View>
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
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    reportButton: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    gossipCard: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    gossipHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    anonymousAvatarLarge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    gossipMeta: {
        flex: 1,
    },
    anonymousName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111114',
        marginBottom: 4,
    },
    channelBadge: {
        backgroundColor: '#FFF0F3',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    channelName: {
        fontSize: 12,
        color: '#FF4D6D',
        fontWeight: '500',
    },
    gossipTime: {
        fontSize: 14,
        color: '#6B7280',
    },
    gossipContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#111114',
        marginBottom: 16,
    },
    gossipStats: {
        flexDirection: 'row',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        color: '#6B7280',
    },
    repliesSection: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    replyCard: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    replyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    anonymousAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    anonymousText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        flex: 1,
    },
    replyTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    replyContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#111114',
    },
    replyInputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    replyInputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    replyInput: {
        flex: 1,
        fontSize: 15,
        maxHeight: 100,
        marginRight: 8,
    },
    sendButton: {
        padding: 8,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    replyHelper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 8,
    },
    anonymousBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    anonymousHelperText: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: '500',
    },
    charCount: {
        fontSize: 11,
        color: '#6B7280',
    },
});