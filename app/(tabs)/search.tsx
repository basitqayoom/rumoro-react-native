import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    TextInput, 
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchResult {
    id: string;
    type: 'user' | 'gossip' | 'tag';
    title: string;
    subtitle?: string;
    avatar?: string;
    icon?: string;
}

const mockSearchResults: SearchResult[] = [
    {
        id: '1',
        type: 'user',
        title: 'Sarah Johnson',
        subtitle: '@sarahj • 12.3K followers',
        avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
        id: '2',
        type: 'tag',
        title: '#TrendingNow',
        subtitle: '45.2K gossips',
        icon: 'trending-up'
    },
    {
        id: '3',
        type: 'gossip',
        title: 'Breaking news about the mall incident',
        subtitle: 'Mike Chen • 2h ago',
        icon: 'newspaper'
    }
];

const trendingTopics = [
    '#CoffeeShopMystery',
    '#MallPeacock',
    '#StartupSuccess',
    '#LocalHeroes',
    '#FoodieFinds'
];

export default function SearchScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const renderSearchResult = ({ item }: { item: SearchResult }) => (
        <TouchableOpacity style={[styles.resultItem, { backgroundColor: colors.card }]}>
            {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.resultAvatar} />
            ) : (
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                    <Ionicons 
                        name={item.icon as any || 'search'} 
                        size={20} 
                        color={colors.tint} 
                    />
                </View>
            )}
            <View style={styles.resultContent}>
                <ThemedText style={styles.resultTitle}>{item.title}</ThemedText>
                {item.subtitle && (
                    <ThemedText style={styles.resultSubtitle}>{item.subtitle}</ThemedText>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <ThemedText type="h1" style={styles.title}>Search</ThemedText>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
                    <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search gossips, people, or topics..."
                        placeholderTextColor="#6B7280"
                        value={searchText}
                        onChangeText={setSearchText}
                        onFocus={() => setIsSearching(true)}
                        onBlur={() => setIsSearching(searchText.length > 0)}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {searchText.length > 0 ? (
                <FlatList
                    data={mockSearchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.resultsList}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.trendingContainer}>
                    <ThemedText style={styles.sectionTitle}>Trending Topics</ThemedText>
                    <View style={styles.topicsGrid}>
                        {trendingTopics.map((topic, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={[styles.topicChip, { backgroundColor: colors.tint + '15' }]}
                            >
                                <ThemedText style={[styles.topicText, { color: colors.tint }]}>
                                    {topic}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <ThemedText style={[styles.sectionTitle, { marginTop: 32 }]}>
                        Recent Searches
                    </ThemedText>
                    <View style={styles.recentSearches}>
                        <TouchableOpacity style={styles.recentItem}>
                            <Ionicons name="time-outline" size={18} color="#6B7280" />
                            <ThemedText style={styles.recentText}>Celebrity chef rumors</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.recentItem}>
                            <Ionicons name="time-outline" size={18} color="#6B7280" />
                            <ThemedText style={styles.recentText}>@mikechen</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.recentItem}>
                            <Ionicons name="time-outline" size={18} color="#6B7280" />
                            <ThemedText style={styles.recentText}>#StartupNews</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    resultsList: {
        paddingHorizontal: 20,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    resultAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    resultContent: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111114',
    },
    resultSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    trendingContainer: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: '#111114',
    },
    topicsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    topicChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        margin: 6,
    },
    topicText: {
        fontSize: 14,
        fontWeight: '500',
    },
    recentSearches: {
        marginTop: 8,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    recentText: {
        fontSize: 15,
        color: '#6B7280',
        marginLeft: 12,
    },
});