import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PRESET_CHANNELS, type Channel, type Gossip } from '../types/models';

export default function PersonProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const params = useLocalSearchParams();
    const { handle, platform } = params;
    
    const [activeChannelId, setActiveChannelId] = useState('work');
    const [isClaimed, setIsClaimed] = useState(false);
    
    const mockProfile = {
        id: '1',
        handle: handle as string || '@johndoe',
        platform: platform as 'instagram' | 'twitter' | 'snapchat' || 'instagram',
        displayName: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=11',
        bio: 'Tech entrepreneur | Coffee enthusiast | Living in SF',
        isClaimed: isClaimed,
        isVerified: true,
        followerCount: 15420
    };

    const channels: Channel[] = [
        ...PRESET_CHANNELS.map((name, index) => ({
            id: name.toLowerCase().replace(/[\/\s]/g, '-'),
            profileId: mockProfile.id,
            name,
            type: 'preset' as const,
            createdAt: new Date(),
            gossipCount: Math.floor(Math.random() * 50),
            isActive: true
        })),
        {
            id: 'startup-stories',
            profileId: mockProfile.id,
            name: 'Startup Stories',
            type: 'user-created',
            createdBy: 'user123',
            createdAt: new Date(),
            gossipCount: 23,
            isActive: true
        }
    ];

    const mockGossips: Gossip[] = [
        {
            id: '1',
            profileId: mockProfile.id,
            channelId: activeChannelId,
            authorId: 'anon1',
            content: "I heard they're working on something big with AI. Can't wait to see what they launch next!",
            replyCount: 12,
            createdAt: new Date(Date.now() - 3600000)
        },
        {
            id: '2',
            profileId: mockProfile.id,
            channelId: activeChannelId,
            authorId: 'anon2',
            content: 'Met them at a conference last week. Super down to earth and genuinely interested in helping others.',
            replyCount: 5,
            createdAt: new Date(Date.now() - 7200000)
        },
        {
            id: '3',
            profileId: mockProfile.id,
            channelId: activeChannelId,
            authorId: 'anon3',
            content: 'Their coffee recommendations are always on point! That new place they posted about is amazing.',
            replyCount: 8,
            createdAt: new Date(Date.now() - 10800000)
        }
    ];

    const handleClaimProfile = () => {
        Alert.alert(
            'Claim Profile',
            'Are you the real owner of this profile? You\'ll need to verify your identity.',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Verify',
                    onPress: () => {
                        setIsClaimed(true);
                        Alert.alert('Success', 'Profile claimed! You earned +10 Buzz!');
                    }
                }
            ]
        );
    };

    const renderGossipCard = ({ item }: { item: Gossip }) => (
        <TouchableOpacity 
            style={[styles.gossipCard, { backgroundColor: colors.card }]}
            onPress={() => router.push({
                pathname: '/gossip-detail',
                params: { gossipId: item.id }
            })}
        >
            <View style={styles.gossipHeader}>
                <View style={styles.anonymousAvatar}>
                    <Ionicons name="person" size={20} color="#6B7280" />
                </View>
                <ThemedText style={styles.anonymousText}>Anonymous</ThemedText>
                <ThemedText style={styles.timestamp}>
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </ThemedText>
            </View>
            <ThemedText style={styles.gossipContent}>{item.content}</ThemedText>
            <View style={styles.gossipActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
                    <ThemedText style={styles.actionCount}>{item.replyCount}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="flag-outline" size={18} color="#6B7280" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderChannelTab = ({ item }: { item: Channel }) => (
        <TouchableOpacity
            style={[
                styles.channelTab,
                activeChannelId === item.id && styles.activeChannelTab
            ]}
            onPress={() => setActiveChannelId(item.id)}
        >
            <ThemedText style={[
                styles.channelTabText,
                activeChannelId === item.id && styles.activeChannelTabText
            ]}>
                {item.name}
            </ThemedText>
            {item.type === 'user-created' && (
                <View style={styles.communityBadge}>
                    <ThemedText style={styles.communityBadgeText}>Community</ThemedText>
                </View>
            )}
            <ThemedText style={[
                styles.channelCount,
                activeChannelId === item.id && styles.activeChannelCount
            ]}>
                {item.gossipCount}
            </ThemedText>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Profile</ThemedText>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileHeader}>
                    <Image source={{ uri: mockProfile.avatar }} style={styles.avatar} />
                    <View style={styles.profileInfo}>
                        <View style={styles.nameRow}>
                            <ThemedText style={styles.displayName}>{mockProfile.displayName}</ThemedText>
                            {mockProfile.isVerified && (
                                <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                            )}
                        </View>
                        <View style={styles.handleRow}>
                            <Ionicons 
                                name={
                                    mockProfile.platform === 'instagram' ? 'logo-instagram' :
                                    mockProfile.platform === 'twitter' ? 'logo-twitter' :
                                    'logo-snapchat'
                                } 
                                size={16} 
                                color="#6B7280" 
                            />
                            <ThemedText style={styles.handle}>{mockProfile.handle}</ThemedText>
                        </View>
                        {mockProfile.bio && (
                            <ThemedText style={styles.bio}>{mockProfile.bio}</ThemedText>
                        )}
                        {mockProfile.followerCount && (
                            <ThemedText style={styles.followers}>
                                {mockProfile.followerCount.toLocaleString()} followers
                            </ThemedText>
                        )}
                    </View>
                </View>

                {!isClaimed && (
                    <TouchableOpacity 
                        style={styles.claimButton}
                        onPress={handleClaimProfile}
                    >
                        <Ionicons name="shield-checkmark" size={20} color="#FF4D6D" />
                        <ThemedText style={styles.claimButtonText}>
                            Is this you? Claim your profile (+10 Buzz)
                        </ThemedText>
                    </TouchableOpacity>
                )}

                {isClaimed && (
                    <View style={styles.ownerBadge}>
                        <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                        <ThemedText style={styles.ownerBadgeText}>Profile Owner</ThemedText>
                    </View>
                )}

                <View style={styles.channelsSection}>
                    <ThemedText style={styles.sectionTitle}>Channels</ThemedText>
                    <FlatList
                        data={channels}
                        renderItem={renderChannelTab}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.channelsList}
                    />
                </View>

                <View style={styles.gossipsSection}>
                    <FlatList
                        data={mockGossips}
                        renderItem={renderGossipCard}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>

            <TouchableOpacity 
                style={styles.fab}
                onPress={() => router.push({
                    pathname: '/compose',
                    params: {
                        profileId: mockProfile.id,
                        profileHandle: mockProfile.handle,
                        channelId: activeChannelId
                    }
                })}
            >
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
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
    moreButton: {
        padding: 8,
    },
    profileHeader: {
        flexDirection: 'row',
        padding: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    displayName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    handleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    handle: {
        fontSize: 14,
        color: '#6B7280',
    },
    bio: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
        color: '#111114',
    },
    followers: {
        fontSize: 14,
        color: '#6B7280',
    },
    claimButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF0F3',
        marginHorizontal: 20,
        padding: 12,
        borderRadius: 8,
        gap: 8,
        marginBottom: 16,
    },
    claimButtonText: {
        color: '#FF4D6D',
        fontWeight: '600',
    },
    ownerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
        marginBottom: 16,
    },
    ownerBadgeText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '600',
    },
    channelsSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 20,
        marginBottom: 12,
    },
    channelsList: {
        paddingHorizontal: 20,
    },
    channelTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 12,
        gap: 6,
    },
    activeChannelTab: {
        backgroundColor: '#FF4D6D',
    },
    channelTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeChannelTabText: {
        color: '#FFFFFF',
    },
    channelCount: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    activeChannelCount: {
        color: '#FFFFFF',
    },
    communityBadge: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    communityBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#6B7280',
    },
    gossipsSection: {
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    gossipCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    gossipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    anonymousAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
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
    timestamp: {
        fontSize: 12,
        color: '#6B7280',
    },
    gossipContent: {
        fontSize: 15,
        lineHeight: 22,
        color: '#111114',
        marginBottom: 12,
    },
    gossipActions: {
        flexDirection: 'row',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FF4D6D',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});