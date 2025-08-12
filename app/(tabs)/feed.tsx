import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    ScrollView, 
    TouchableOpacity, 
    FlatList,
    Image,
    Dimensions,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

type TabType = 'hot' | 'latest';

interface GossipItem {
    id: string;
    author: {
        name: string;
        handle: string;
        avatar: string;
        verified?: boolean;
    };
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
    isLiked?: boolean;
    isTrending?: boolean;
}

interface ProfileSuggestion {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    bio: string;
    followers: string;
    isFollowing: boolean;
    verified?: boolean;
}

const mockTrendingGossips: GossipItem[] = [
    {
        id: '1',
        author: {
            name: 'Sarah Johnson',
            handle: '@sarahj',
            avatar: 'https://i.pravatar.cc/150?img=1',
            verified: true
        },
        content: '🔥 Just heard that the new coffee shop downtown is owned by a celebrity chef! Can anyone confirm? The pastries are apparently to die for!',
        timestamp: '2h ago',
        likes: 342,
        comments: 89,
        shares: 23,
        isLiked: false,
        isTrending: true
    },
    {
        id: '2',
        author: {
            name: 'Mike Chen',
            handle: '@mikechen',
            avatar: 'https://i.pravatar.cc/150?img=2'
        },
        content: 'Did you guys see what happened at the mall today? Absolute chaos! Someone brought their pet peacock and it escaped 😂',
        timestamp: '4h ago',
        likes: 567,
        comments: 124,
        shares: 45,
        isLiked: true,
        isTrending: true
    },
    {
        id: '3',
        author: {
            name: 'Emma Davis',
            handle: '@emmad',
            avatar: 'https://i.pravatar.cc/150?img=3',
            verified: true
        },
        content: 'Breaking: Local startup just got acquired for $50M! The founders are only 23 years old. Incredible story of perseverance!',
        timestamp: '5h ago',
        likes: 892,
        comments: 234,
        shares: 67,
        isLiked: false,
        isTrending: true
    }
];

const mockLatestGossips: GossipItem[] = [
    {
        id: '4',
        author: {
            name: 'Alex Thompson',
            handle: '@alexthompson',
            avatar: 'https://i.pravatar.cc/150?img=4'
        },
        content: 'Just saw my neighbor walking their cat on a leash. Is this a thing now? 🐱',
        timestamp: '10m ago',
        likes: 12,
        comments: 3,
        shares: 1,
        isLiked: false
    },
    {
        id: '5',
        author: {
            name: 'Jessica Lee',
            handle: '@jesslee',
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
        content: 'The new restaurant on 5th street has a 2-hour wait already. Worth it or overhyped?',
        timestamp: '30m ago',
        likes: 45,
        comments: 12,
        shares: 3,
        isLiked: true
    },
    {
        id: '6',
        author: {
            name: 'David Wilson',
            handle: '@dwilson',
            avatar: 'https://i.pravatar.cc/150?img=6'
        },
        content: 'Office drama alert: Someone keeps stealing lunches from the fridge. We set up a hidden camera today 👀',
        timestamp: '1h ago',
        likes: 78,
        comments: 23,
        shares: 5,
        isLiked: false
    }
];

const mockProfiles: ProfileSuggestion[] = [
    {
        id: '1',
        name: 'Olivia Martinez',
        handle: '@oliviam',
        avatar: 'https://i.pravatar.cc/150?img=7',
        bio: 'Fashion enthusiast | Coffee addict | Always curious',
        followers: '12.3K',
        isFollowing: false,
        verified: true
    },
    {
        id: '2',
        name: 'Ryan Cooper',
        handle: '@ryanc',
        avatar: 'https://i.pravatar.cc/150?img=8',
        bio: 'Tech insider | Breaking news | Silicon Valley gossip',
        followers: '8.9K',
        isFollowing: false
    },
    {
        id: '3',
        name: 'Sophia Chang',
        handle: '@sophiac',
        avatar: 'https://i.pravatar.cc/150?img=9',
        bio: 'Food critic | Restaurant secrets | Culinary adventures',
        followers: '15.7K',
        isFollowing: false,
        verified: true
    }
];

export default function FeedScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [activeTab, setActiveTab] = useState<TabType>('hot');
    const [refreshing, setRefreshing] = useState(false);
    const [followingStatus, setFollowingStatus] = useState<{[key: string]: boolean}>({});

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const handleFollow = (profileId: string) => {
        setFollowingStatus(prev => ({
            ...prev,
            [profileId]: !prev[profileId]
        }));
    };

    const renderGossipCard = ({ item }: { item: GossipItem }) => (
        <View style={[styles.gossipCard, { backgroundColor: colors.card }]}>
            {item.isTrending && (
                <View style={styles.trendingBadge}>
                    <ThemedText style={styles.trendingText}>🔥 Trending</ThemedText>
                </View>
            )}
            <View style={styles.gossipHeader}>
                <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
                <View style={styles.authorInfo}>
                    <View style={styles.authorNameRow}>
                        <ThemedText style={styles.authorName}>{item.author.name}</ThemedText>
                        {item.author.verified && (
                            <ThemedText style={styles.verifiedBadge}>✓</ThemedText>
                        )}
                    </View>
                    <ThemedText style={styles.authorHandle}>{item.author.handle}</ThemedText>
                </View>
                <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
            </View>
            <ThemedText style={styles.gossipContent}>{item.content}</ThemedText>
            <View style={styles.gossipActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <ThemedText style={[styles.actionIcon, item.isLiked && styles.likedIcon]}>
                        {item.isLiked ? '❤️' : '🤍'}
                    </ThemedText>
                    <ThemedText style={styles.actionCount}>{item.likes}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <ThemedText style={styles.actionIcon}>💬</ThemedText>
                    <ThemedText style={styles.actionCount}>{item.comments}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <ThemedText style={styles.actionIcon}>🔄</ThemedText>
                    <ThemedText style={styles.actionCount}>{item.shares}</ThemedText>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderProfileCard = ({ item }: { item: ProfileSuggestion }) => {
        const isFollowing = followingStatus[item.id] || item.isFollowing;
        
        return (
            <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
                <Image source={{ uri: item.avatar }} style={styles.profileAvatar} />
                <View style={styles.profileNameRow}>
                    <ThemedText style={styles.profileName}>{item.name}</ThemedText>
                    {item.verified && (
                        <ThemedText style={styles.verifiedBadge}>✓</ThemedText>
                    )}
                </View>
                <ThemedText style={styles.profileHandle}>{item.handle}</ThemedText>
                <ThemedText style={styles.profileBio} numberOfLines={2}>{item.bio}</ThemedText>
                <ThemedText style={styles.profileFollowers}>{item.followers} followers</ThemedText>
                <TouchableOpacity 
                    style={[
                        styles.followButton,
                        isFollowing && styles.followingButton
                    ]}
                    onPress={() => handleFollow(item.id)}
                >
                    <ThemedText style={[
                        styles.followButtonText,
                        isFollowing && styles.followingButtonText
                    ]}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </ThemedText>
                </TouchableOpacity>
            </View>
        );
    };

    const HotTab = () => (
        <ScrollView 
            style={styles.tabContent}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Trending Now 🔥</ThemedText>
                <FlatList
                    data={mockTrendingGossips}
                    renderItem={renderGossipCard}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                />
            </View>

            <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>People to Follow</ThemedText>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.profilesContainer}
                >
                    {mockProfiles.map(profile => (
                        <View key={profile.id} style={styles.profileCardWrapper}>
                            {renderProfileCard({ item: profile })}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );

    const LatestTab = () => (
        <FlatList
            data={mockLatestGossips}
            renderItem={renderGossipCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
        />
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <ThemedText type="h1" style={styles.title}>Rumoro</ThemedText>
            </View>

            <View style={[styles.tabBar, { backgroundColor: colors.background }]}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'hot' && styles.activeTab
                    ]}
                    onPress={() => setActiveTab('hot')}
                >
                    <ThemedText style={[
                        styles.tabText,
                        activeTab === 'hot' && styles.activeTabText
                    ]}>
                        Hot 🔥
                    </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'latest' && styles.activeTab
                    ]}
                    onPress={() => setActiveTab('latest')}
                >
                    <ThemedText style={[
                        styles.tabText,
                        activeTab === 'latest' && styles.activeTabText
                    ]}>
                        Latest ⏰
                    </ThemedText>
                </TouchableOpacity>
            </View>

            {activeTab === 'hot' ? <HotTab /> : <LatestTab />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF4D6D',
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
        fontSize: 16,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#FF4D6D',
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
    },
    listContainer: {
        paddingVertical: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginHorizontal: 20,
        marginBottom: 16,
        color: '#111114',
    },
    gossipCard: {
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    trendingBadge: {
        backgroundColor: '#FFF0F3',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    trendingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FF4D6D',
    },
    gossipHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    authorInfo: {
        flex: 1,
    },
    authorNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111114',
    },
    verifiedBadge: {
        marginLeft: 4,
        fontSize: 14,
        color: '#3B82F6',
    },
    authorHandle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    timestamp: {
        fontSize: 14,
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
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionIcon: {
        fontSize: 18,
        marginRight: 6,
    },
    likedIcon: {
        color: '#FF4D6D',
    },
    actionCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    profilesContainer: {
        paddingHorizontal: 20,
    },
    profileCardWrapper: {
        marginRight: 16,
    },
    profileCard: {
        width: 160,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 12,
    },
    profileNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111114',
    },
    profileHandle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    profileBio: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 18,
    },
    profileFollowers: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 12,
    },
    followButton: {
        backgroundColor: '#FF4D6D',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
    },
    followingButton: {
        backgroundColor: '#E5E7EB',
    },
    followButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    followingButtonText: {
        color: '#6B7280',
    },
});