import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BuzzDisplay } from '../components/BuzzDisplay';
import type { BuzzTransaction } from '../types/models';

export default function BuzzHistoryScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [currentBuzz] = useState(150);
    const [filterType, setFilterType] = useState<'all' | 'earned' | 'spent'>('all');
    
    const mockTransactions: BuzzTransaction[] = [
        {
            id: '1',
            userId: 'user123',
            amount: 10,
            type: 'earn',
            reason: 'claim_profile',
            metadata: { profileHandle: '@johndoe' },
            createdAt: new Date(Date.now() - 3600000)
        },
        {
            id: '2',
            userId: 'user123',
            amount: -30,
            type: 'spend',
            reason: 'create_channel',
            metadata: { channelName: 'Startup Stories' },
            createdAt: new Date(Date.now() - 7200000)
        },
        {
            id: '3',
            userId: 'user123',
            amount: 3,
            type: 'earn',
            reason: 'post_replies',
            metadata: { postId: 'post123' },
            createdAt: new Date(Date.now() - 86400000)
        },
        {
            id: '4',
            userId: 'user123',
            amount: 1,
            type: 'earn',
            reason: 'daily_open',
            metadata: { streak: 5 },
            createdAt: new Date(Date.now() - 86400000 * 2)
        },
        {
            id: '5',
            userId: 'user123',
            amount: 2,
            type: 'earn',
            reason: 'post_survived',
            metadata: { postId: 'post456' },
            createdAt: new Date(Date.now() - 86400000 * 3)
        }
    ];
    
    const filteredTransactions = mockTransactions.filter(t => {
        if (filterType === 'all') return true;
        if (filterType === 'earned') return t.type === 'earn';
        if (filterType === 'spent') return t.type === 'spend';
        return true;
    });
    
    const getReasonText = (reason: string): string => {
        const reasonMap: { [key: string]: string } = {
            'daily_open': 'Daily check-in',
            'post_survived': 'Post survived 24h',
            'post_replies': 'Post got 3+ replies',
            'claim_profile': 'Claimed profile',
            'create_channel': 'Created channel',
            'boost_gossip': 'Boosted gossip',
            'cosmetic': 'Cosmetic purchase'
        };
        return reasonMap[reason] || reason;
    };
    
    const getReasonIcon = (reason: string): string => {
        const iconMap: { [key: string]: string } = {
            'daily_open': 'calendar',
            'post_survived': 'checkmark-circle',
            'post_replies': 'chatbubbles',
            'claim_profile': 'person-circle',
            'create_channel': 'add-circle',
            'boost_gossip': 'rocket',
            'cosmetic': 'color-palette'
        };
        return iconMap[reason] || 'flash';
    };
    
    const getReasonColor = (type: 'earn' | 'spend'): string => {
        return type === 'earn' ? '#10B981' : '#EF4444';
    };
    
    const renderTransaction = ({ item }: { item: BuzzTransaction }) => (
        <View style={[styles.transactionCard, { backgroundColor: colors.card }]}>
            <View style={[
                styles.iconContainer,
                { backgroundColor: item.type === 'earn' ? '#ECFDF5' : '#FEE2E2' }
            ]}>
                <Ionicons 
                    name={getReasonIcon(item.reason) as any} 
                    size={20} 
                    color={getReasonColor(item.type)} 
                />
            </View>
            <View style={styles.transactionInfo}>
                <ThemedText style={styles.transactionTitle}>
                    {getReasonText(item.reason)}
                </ThemedText>
                {item.metadata?.channelName && (
                    <ThemedText style={styles.transactionSubtitle}>
                        {item.metadata.channelName}
                    </ThemedText>
                )}
                {item.metadata?.profileHandle && (
                    <ThemedText style={styles.transactionSubtitle}>
                        {item.metadata.profileHandle}
                    </ThemedText>
                )}
                {item.metadata?.streak && (
                    <ThemedText style={styles.transactionSubtitle}>
                        {item.metadata.streak} day streak! 🔥
                    </ThemedText>
                )}
                <ThemedText style={styles.transactionTime}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </ThemedText>
            </View>
            <ThemedText style={[
                styles.transactionAmount,
                { color: getReasonColor(item.type) }
            ]}>
                {item.type === 'earn' ? '+' : ''}{Math.abs(item.amount)}
            </ThemedText>
        </View>
    );
    
    const stats = {
        totalEarned: mockTransactions.filter(t => t.type === 'earn').reduce((sum, t) => sum + t.amount, 0),
        totalSpent: Math.abs(mockTransactions.filter(t => t.type === 'spend').reduce((sum, t) => sum + t.amount, 0)),
        dailyStreak: 5
    };
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Buzz History</ThemedText>
                <View style={styles.headerSpacer} />
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.balanceSection}>
                    <ThemedText style={styles.balanceLabel}>Current Balance</ThemedText>
                    <BuzzDisplay amount={currentBuzz} size="large" showLabel={false} onPress={() => {}} />
                </View>
                
                <View style={styles.statsSection}>
                    <View style={styles.statCard}>
                        <Ionicons name="arrow-up-circle" size={24} color="#10B981" />
                        <ThemedText style={styles.statLabel}>Earned</ThemedText>
                        <ThemedText style={styles.statValue}>{stats.totalEarned}</ThemedText>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="arrow-down-circle" size={24} color="#EF4444" />
                        <ThemedText style={styles.statLabel}>Spent</ThemedText>
                        <ThemedText style={styles.statValue}>{stats.totalSpent}</ThemedText>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="flame" size={24} color="#F59E0B" />
                        <ThemedText style={styles.statLabel}>Streak</ThemedText>
                        <ThemedText style={styles.statValue}>{stats.dailyStreak} days</ThemedText>
                    </View>
                </View>
                
                <View style={styles.earnSection}>
                    <ThemedText style={styles.sectionTitle}>How to Earn Buzz</ThemedText>
                    <View style={styles.earnGrid}>
                        <View style={styles.earnItem}>
                            <View style={styles.earnIconContainer}>
                                <Ionicons name="calendar" size={20} color="#3B82F6" />
                            </View>
                            <ThemedText style={styles.earnAmount}>+1</ThemedText>
                            <ThemedText style={styles.earnDescription}>Daily open</ThemedText>
                        </View>
                        <View style={styles.earnItem}>
                            <View style={styles.earnIconContainer}>
                                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                            </View>
                            <ThemedText style={styles.earnAmount}>+2</ThemedText>
                            <ThemedText style={styles.earnDescription}>Post survives 24h</ThemedText>
                        </View>
                        <View style={styles.earnItem}>
                            <View style={styles.earnIconContainer}>
                                <Ionicons name="chatbubbles" size={20} color="#8B5CF6" />
                            </View>
                            <ThemedText style={styles.earnAmount}>+3</ThemedText>
                            <ThemedText style={styles.earnDescription}>3+ replies</ThemedText>
                        </View>
                        <View style={styles.earnItem}>
                            <View style={styles.earnIconContainer}>
                                <Ionicons name="person-circle" size={20} color="#EC4899" />
                            </View>
                            <ThemedText style={styles.earnAmount}>+10</ThemedText>
                            <ThemedText style={styles.earnDescription}>Claim profile</ThemedText>
                        </View>
                    </View>
                </View>
                
                <View style={styles.filterSection}>
                    <ThemedText style={styles.sectionTitle}>Transaction History</ThemedText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {['all', 'earned', 'spent'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.filterChip,
                                    filterType === type && styles.filterChipActive
                                ]}
                                onPress={() => setFilterType(type as any)}
                            >
                                <ThemedText style={[
                                    styles.filterText,
                                    filterType === type && styles.filterTextActive
                                ]}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderTransaction}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={styles.transactionsList}
                />
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
    balanceSection: {
        alignItems: 'center',
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    balanceLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    statCard: {
        alignItems: 'center',
        gap: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    earnSection: {
        padding: 20,
        backgroundColor: '#F9FAFB',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    earnGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    earnItem: {
        width: '50%',
        padding: 8,
    },
    earnIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    earnAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#10B981',
        marginBottom: 4,
    },
    earnDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    filterSection: {
        padding: 20,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#FF4D6D',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    transactionsList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 2,
    },
    transactionSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 2,
    },
    transactionTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});