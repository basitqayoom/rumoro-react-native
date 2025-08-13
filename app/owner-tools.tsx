import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    Alert,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Channel, Gossip } from '../types/models';

export default function OwnerToolsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const params = useLocalSearchParams();
    const { profileId } = params;
    
    const [keywordFilters, setKeywordFilters] = useState<string[]>(['scam', 'fake', 'lies']);
    const [newKeyword, setNewKeyword] = useState('');
    const [autoHideEnabled, setAutoHideEnabled] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'gossips' | 'channels' | 'filters'>('gossips');
    
    // Mock data
    const hiddenGossips: Gossip[] = [
        {
            id: '1',
            profileId: profileId as string || '1',
            channelId: 'tea-spill',
            authorId: 'anon1',
            content: 'This person is a total scammer, stay away from their business!',
            replyCount: 3,
            createdAt: new Date(Date.now() - 86400000),
            isHidden: true
        },
        {
            id: '2',
            profileId: profileId as string || '1',
            channelId: 'work',
            authorId: 'anon2',
            content: 'They got fired from their last job for stealing.',
            replyCount: 0,
            createdAt: new Date(Date.now() - 172800000),
            isHidden: true
        }
    ];
    
    const userCreatedChannels: Channel[] = [
        {
            id: 'startup-stories',
            profileId: profileId as string || '1',
            name: 'Startup Stories',
            type: 'user-created',
            createdBy: 'user123',
            createdAt: new Date(Date.now() - 604800000),
            gossipCount: 23,
            isActive: true
        },
        {
            id: 'office-drama',
            profileId: profileId as string || '1',
            name: 'Office Drama',
            type: 'user-created',
            createdBy: 'user456',
            createdAt: new Date(Date.now() - 1209600000),
            gossipCount: 5,
            isActive: true
        }
    ];
    
    const handleUnhide = (gossipId: string) => {
        Alert.alert(
            'Unhide Gossip?',
            'This gossip will be visible to everyone again.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unhide',
                    onPress: () => {
                        Alert.alert('Success', 'Gossip has been unhidden');
                    }
                }
            ]
        );
    };
    
    const handleDisableChannel = (channel: Channel) => {
        Alert.alert(
            'Disable Channel?',
            `"${channel.name}" will be hidden from your profile. Existing gossips will be archived.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Disable',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Success', `Channel "${channel.name}" has been disabled`);
                    }
                }
            ]
        );
    };
    
    const handleMergeChannel = (channel: Channel) => {
        Alert.alert(
            'Merge Channel',
            'Select a preset channel to merge this into:',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Work', onPress: () => mergeInto(channel, 'Work') },
                { text: 'Misc', onPress: () => mergeInto(channel, 'Misc') },
                { text: 'Tea/Spill', onPress: () => mergeInto(channel, 'Tea/Spill') }
            ]
        );
    };
    
    const mergeInto = (channel: Channel, targetChannel: string) => {
        Alert.alert('Success', `Channel "${channel.name}" merged into ${targetChannel}`);
    };
    
    const handleAddKeyword = () => {
        if (!newKeyword.trim()) return;
        
        if (keywordFilters.includes(newKeyword.toLowerCase())) {
            Alert.alert('Error', 'This keyword is already in your filter list');
            return;
        }
        
        setKeywordFilters([...keywordFilters, newKeyword.toLowerCase()]);
        setNewKeyword('');
        Alert.alert('Success', `"${newKeyword}" added to filter list`);
    };
    
    const handleRemoveKeyword = (keyword: string) => {
        setKeywordFilters(keywordFilters.filter(k => k !== keyword));
    };
    
    const renderGossipCard = ({ item }: { item: Gossip }) => (
        <View style={[styles.gossipCard, { backgroundColor: colors.card }]}>
            <View style={styles.gossipHeader}>
                <View style={styles.hiddenBadge}>
                    <Ionicons name="eye-off" size={14} color="#EF4444" />
                    <ThemedText style={styles.hiddenText}>Hidden</ThemedText>
                </View>
                <ThemedText style={styles.gossipTime}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </ThemedText>
            </View>
            <ThemedText style={styles.gossipContent} numberOfLines={2}>
                {item.content}
            </ThemedText>
            <View style={styles.gossipActions}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleUnhide(item.id)}
                >
                    <Ionicons name="eye" size={16} color="#10B981" />
                    <ThemedText style={styles.actionText}>Unhide</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    <ThemedText style={[styles.actionText, { color: '#EF4444' }]}>
                        Delete Forever
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
    
    const renderChannelCard = ({ item }: { item: Channel }) => (
        <View style={[styles.channelCard, { backgroundColor: colors.card }]}>
            <View style={styles.channelInfo}>
                <ThemedText style={styles.channelName}>{item.name}</ThemedText>
                <View style={styles.channelMeta}>
                    <ThemedText style={styles.channelStat}>
                        {item.gossipCount} gossips
                    </ThemedText>
                    <ThemedText style={styles.channelStat}>
                        Created {Math.floor((Date.now() - item.createdAt.getTime()) / 86400000)} days ago
                    </ThemedText>
                </View>
            </View>
            <View style={styles.channelActions}>
                <TouchableOpacity 
                    style={styles.channelButton}
                    onPress={() => handleMergeChannel(item)}
                >
                    <Ionicons name="git-merge" size={20} color="#3B82F6" />
                    <ThemedText style={[styles.channelButtonText, { color: '#3B82F6' }]}>
                        Merge
                    </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.channelButton, styles.disableButton]}
                    onPress={() => handleDisableChannel(item)}
                >
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                    <ThemedText style={[styles.channelButtonText, { color: '#EF4444' }]}>
                        Disable
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Owner Tools</ThemedText>
                <View style={styles.headerSpacer} />
            </View>
            
            <View style={styles.tabBar}>
                {['gossips', 'channels', 'filters'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            selectedTab === tab && styles.activeTab
                        ]}
                        onPress={() => setSelectedTab(tab as any)}
                    >
                        <ThemedText style={[
                            styles.tabText,
                            selectedTab === tab && styles.activeTabText
                        ]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {selectedTab === 'gossips' && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>Hidden Gossips</ThemedText>
                            <ThemedText style={styles.sectionCount}>
                                {hiddenGossips.length} hidden
                            </ThemedText>
                        </View>
                        <ThemedText style={styles.sectionDescription}>
                            Gossips you've hidden from public view. Only you can see them here.
                        </ThemedText>
                        <FlatList
                            data={hiddenGossips}
                            renderItem={renderGossipCard}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                        />
                    </View>
                )}
                
                {selectedTab === 'channels' && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>User-Created Channels</ThemedText>
                            <ThemedText style={styles.sectionCount}>
                                {userCreatedChannels.length} channels
                            </ThemedText>
                        </View>
                        <ThemedText style={styles.sectionDescription}>
                            Community-created channels on your profile. You can merge or disable them.
                        </ThemedText>
                        <FlatList
                            data={userCreatedChannels}
                            renderItem={renderChannelCard}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                        />
                    </View>
                )}
                
                {selectedTab === 'filters' && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>Keyword Filters</ThemedText>
                            <Switch
                                value={autoHideEnabled}
                                onValueChange={setAutoHideEnabled}
                                trackColor={{ false: '#D1D5DB', true: '#FF4D6D' }}
                            />
                        </View>
                        <ThemedText style={styles.sectionDescription}>
                            Automatically hide gossips containing these keywords
                        </ThemedText>
                        
                        <View style={styles.keywordInput}>
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Add keyword to filter..."
                                placeholderTextColor="#6B7280"
                                value={newKeyword}
                                onChangeText={setNewKeyword}
                                onSubmitEditing={handleAddKeyword}
                            />
                            <TouchableOpacity 
                                style={styles.addButton}
                                onPress={handleAddKeyword}
                            >
                                <Ionicons name="add" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.keywordList}>
                            {keywordFilters.map((keyword) => (
                                <View key={keyword} style={styles.keywordChip}>
                                    <ThemedText style={styles.keywordText}>{keyword}</ThemedText>
                                    <TouchableOpacity onPress={() => handleRemoveKeyword(keyword)}>
                                        <Ionicons name="close" size={16} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        
                        <View style={styles.filterStats}>
                            <View style={styles.statCard}>
                                <ThemedText style={styles.statNumber}>47</ThemedText>
                                <ThemedText style={styles.statLabel}>Gossips filtered</ThemedText>
                            </View>
                            <View style={styles.statCard}>
                                <ThemedText style={styles.statNumber}>12</ThemedText>
                                <ThemedText style={styles.statLabel}>This week</ThemedText>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
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
    headerSpacer: {
        width: 40,
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#FFF0F3',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#FF4D6D',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    sectionCount: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    sectionDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    gossipCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    gossipHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    hiddenBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    hiddenText: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '500',
    },
    gossipTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    gossipContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#111114',
        marginBottom: 12,
    },
    gossipActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    actionText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#10B981',
    },
    channelCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    channelInfo: {
        marginBottom: 12,
    },
    channelName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    channelMeta: {
        flexDirection: 'row',
        gap: 16,
    },
    channelStat: {
        fontSize: 13,
        color: '#6B7280',
    },
    channelActions: {
        flexDirection: 'row',
        gap: 12,
    },
    channelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    disableButton: {
        borderColor: '#EF4444',
    },
    channelButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    keywordInput: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
    },
    addButton: {
        backgroundColor: '#FF4D6D',
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keywordList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    keywordChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 8,
    },
    keywordText: {
        fontSize: 14,
        color: '#111114',
    },
    filterStats: {
        flexDirection: 'row',
        gap: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF4D6D',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
});