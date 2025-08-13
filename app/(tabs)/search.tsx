import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    TextInput, 
    TouchableOpacity, 
    FlatList,
    Image,
    ScrollView,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { PersonProfile } from '../../types/models';

export default function SearchScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'instagram' | 'twitter' | 'snapchat'>('all');
    const [searchResults, setSearchResults] = useState<PersonProfile[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>(['@johndoe', '@sarahj', '@techguru']);
    const [isSearching, setIsSearching] = useState(false);

    const trendingProfiles: PersonProfile[] = [
        {
            id: '1',
            handle: '@techinfluencer',
            platform: 'instagram',
            displayName: 'Tech Influencer',
            avatar: 'https://i.pravatar.cc/150?img=12',
            bio: 'Sharing the latest in tech',
            isClaimed: true,
            isVerified: true,
            followerCount: 45000,
            createdAt: new Date(),
            lastUpdatedAt: new Date()
        },
        {
            id: '2',
            handle: '@foodie_life',
            platform: 'instagram',
            displayName: 'Foodie Life',
            avatar: 'https://i.pravatar.cc/150?img=13',
            bio: 'Food reviews and recipes',
            isClaimed: false,
            isVerified: false,
            followerCount: 12000,
            createdAt: new Date(),
            lastUpdatedAt: new Date()
        },
        {
            id: '3',
            handle: '@startup_founder',
            platform: 'twitter',
            displayName: 'Startup Founder',
            avatar: 'https://i.pravatar.cc/150?img=14',
            bio: 'Building the future',
            isClaimed: true,
            isVerified: true,
            followerCount: 28000,
            createdAt: new Date(),
            lastUpdatedAt: new Date()
        }
    ];

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        
        setTimeout(() => {
            const mockResults = trendingProfiles.filter(profile => 
                profile.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                profile.displayName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (mockResults.length === 0 && searchQuery.startsWith('@')) {
                Alert.alert(
                    'Profile Not Found',
                    `No profile found for ${searchQuery}. Would you like to create a seed profile?`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                            text: 'Create',
                            onPress: () => createSeedProfile(searchQuery)
                        }
                    ]
                );
            }
            
            setSearchResults(mockResults);
            setIsSearching(false);
            
            if (!recentSearches.includes(searchQuery)) {
                setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)]);
            }
        }, 500);
    };

    const createSeedProfile = (handle: string) => {
        const platform = selectedPlatform === 'all' ? 'instagram' : selectedPlatform;
        router.push({
            pathname: '/person-profile',
            params: { handle, platform, isNew: 'true' }
        });
    };

    const navigateToProfile = (profile: PersonProfile) => {
        router.push({
            pathname: '/person-profile',
            params: { 
                handle: profile.handle, 
                platform: profile.platform 
            }
        });
    };

    const renderProfileCard = ({ item }: { item: PersonProfile }) => (
        <TouchableOpacity 
            style={[styles.profileCard, { backgroundColor: colors.card }]}
            onPress={() => navigateToProfile(item)}
        >
            <Image source={{ uri: item.avatar }} style={styles.profileAvatar} />
            <View style={styles.profileInfo}>
                <View style={styles.profileNameRow}>
                    <ThemedText style={styles.profileName}>{item.displayName}</ThemedText>
                    {item.isVerified && (
                        <Ionicons name="checkmark-circle" size={16} color="#3B82F6" />
                    )}
                </View>
                <View style={styles.profileHandleRow}>
                    <Ionicons 
                        name={
                            item.platform === 'instagram' ? 'logo-instagram' :
                            item.platform === 'twitter' ? 'logo-twitter' :
                            'logo-snapchat'
                        } 
                        size={14} 
                        color="#6B7280" 
                    />
                    <ThemedText style={styles.profileHandle}>{item.handle}</ThemedText>
                </View>
                {item.bio && (
                    <ThemedText style={styles.profileBio} numberOfLines={1}>{item.bio}</ThemedText>
                )}
                {item.followerCount && (
                    <ThemedText style={styles.profileFollowers}>
                        {item.followerCount.toLocaleString()} followers
                    </ThemedText>
                )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <ThemedText type="h1" style={styles.title}>Discover</ThemedText>
            </View>

            <View style={styles.searchSection}>
                <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
                    <Ionicons name="search" size={20} color="#6B7280" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by @handle or name"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.platformFilters}
                >
                    {['all', 'instagram', 'twitter', 'snapchat'].map((platform) => (
                        <TouchableOpacity
                            key={platform}
                            style={[
                                styles.platformFilter,
                                selectedPlatform === platform && styles.platformFilterActive
                            ]}
                            onPress={() => setSelectedPlatform(platform as any)}
                        >
                            {platform !== 'all' && (
                                <Ionicons 
                                    name={
                                        platform === 'instagram' ? 'logo-instagram' :
                                        platform === 'twitter' ? 'logo-twitter' :
                                        'logo-snapchat'
                                    } 
                                    size={16} 
                                    color={selectedPlatform === platform ? '#FFFFFF' : '#6B7280'}
                                />
                            )}
                            <ThemedText style={[
                                styles.platformFilterText,
                                selectedPlatform === platform && styles.platformFilterTextActive
                            ]}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {searchResults.length > 0 ? (
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Search Results</ThemedText>
                        <FlatList
                            data={searchResults}
                            renderItem={renderProfileCard}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                        />
                    </View>
                ) : searchQuery && !isSearching ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="search" size={48} color="#D1D5DB" />
                        <ThemedText style={styles.emptyStateText}>No results found</ThemedText>
                        <ThemedText style={styles.emptyStateSubtext}>
                            Try searching with a different handle or name
                        </ThemedText>
                    </View>
                ) : null}

                {!searchQuery && recentSearches.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>Recent Searches</ThemedText>
                            <TouchableOpacity onPress={() => setRecentSearches([])}>
                                <ThemedText style={styles.clearButton}>Clear</ThemedText>
                            </TouchableOpacity>
                        </View>
                        {recentSearches.map((search, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.recentSearchItem}
                                onPress={() => setSearchQuery(search)}
                            >
                                <Ionicons name="time-outline" size={16} color="#6B7280" />
                                <ThemedText style={styles.recentSearchText}>{search}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {!searchQuery && (
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Trending Profiles 🔥</ThemedText>
                        <FlatList
                            data={trendingProfiles}
                            renderItem={renderProfileCard}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                        />
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
    searchSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#111114',
    },
    platformFilters: {
        marginTop: 12,
    },
    platformFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        gap: 6,
    },
    platformFilterActive: {
        backgroundColor: '#FF4D6D',
    },
    platformFilterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    platformFilterTextActive: {
        color: '#FFFFFF',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    clearButton: {
        fontSize: 14,
        color: '#FF4D6D',
        fontWeight: '500',
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    profileAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    profileInfo: {
        flex: 1,
    },
    profileNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111114',
    },
    profileHandleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    profileHandle: {
        fontSize: 14,
        color: '#6B7280',
    },
    profileBio: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 4,
    },
    profileFollowers: {
        fontSize: 12,
        color: '#6B7280',
    },
    recentSearchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    recentSearchText: {
        fontSize: 15,
        color: '#111114',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 4,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});