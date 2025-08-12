import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    FlatList,
    TouchableOpacity,
    Image,
    TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
    id: string;
    user: {
        name: string;
        handle: string;
        avatar: string;
        isOnline?: boolean;
        verified?: boolean;
    };
    lastMessage: string;
    timestamp: string;
    unreadCount?: number;
    isTyping?: boolean;
}

const mockMessages: Message[] = [
    {
        id: '1',
        user: {
            name: 'Sarah Johnson',
            handle: '@sarahj',
            avatar: 'https://i.pravatar.cc/150?img=1',
            isOnline: true,
            verified: true
        },
        lastMessage: 'Did you hear about the coffee shop? I need to know more!',
        timestamp: 'Just now',
        unreadCount: 2
    },
    {
        id: '2',
        user: {
            name: 'Mike Chen',
            handle: '@mikechen',
            avatar: 'https://i.pravatar.cc/150?img=2',
            isOnline: true
        },
        lastMessage: 'Haha yes! The peacock was mine 😅',
        timestamp: '5m ago',
        unreadCount: 1
    },
    {
        id: '3',
        user: {
            name: 'Emma Davis',
            handle: '@emmad',
            avatar: 'https://i.pravatar.cc/150?img=3',
            verified: true
        },
        lastMessage: 'Thanks for sharing that story!',
        timestamp: '1h ago'
    },
    {
        id: '4',
        user: {
            name: 'Alex Thompson',
            handle: '@alexthompson',
            avatar: 'https://i.pravatar.cc/150?img=4',
            isTyping: true
        },
        lastMessage: 'typing...',
        timestamp: '2h ago'
    },
    {
        id: '5',
        user: {
            name: 'Jessica Lee',
            handle: '@jesslee',
            avatar: 'https://i.pravatar.cc/150?img=5',
            isOnline: true
        },
        lastMessage: 'The restaurant was actually really good!',
        timestamp: 'Yesterday'
    },
    {
        id: '6',
        user: {
            name: 'David Wilson',
            handle: '@dwilson',
            avatar: 'https://i.pravatar.cc/150?img=6'
        },
        lastMessage: 'We caught the lunch thief! You won\'t believe who it was',
        timestamp: '2 days ago'
    }
];

export default function MessagesScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [searchText, setSearchText] = useState('');

    const filteredMessages = mockMessages.filter(message =>
        message.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        message.user.handle.toLowerCase().includes(searchText.toLowerCase())
    );

    const renderMessage = ({ item }: { item: Message }) => (
        <TouchableOpacity style={[styles.messageCard, { backgroundColor: colors.background }]}>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                {item.user.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                    <View style={styles.userInfo}>
                        <ThemedText style={styles.userName}>{item.user.name}</ThemedText>
                        {item.user.verified && (
                            <ThemedText style={styles.verifiedBadge}>✓</ThemedText>
                        )}
                    </View>
                    <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
                </View>
                <View style={styles.messagePreview}>
                    <ThemedText 
                        style={[
                            styles.lastMessage,
                            item.isTyping && styles.typingMessage
                        ]} 
                        numberOfLines={1}
                    >
                        {item.lastMessage}
                    </ThemedText>
                    {item.unreadCount && item.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <ThemedText style={styles.unreadCount}>{item.unreadCount}</ThemedText>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const totalUnread = mockMessages.reduce((sum, msg) => sum + (msg.unreadCount || 0), 0);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <ThemedText type="h1" style={styles.title}>Messages</ThemedText>
                    {totalUnread > 0 && (
                        <View style={styles.totalBadge}>
                            <ThemedText style={styles.totalBadgeText}>{totalUnread}</ThemedText>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={styles.newMessageButton}>
                    <Ionicons name="create-outline" size={24} color="#FF4D6D" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
                    <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search messages..."
                        placeholderTextColor="#6B7280"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>

            {filteredMessages.length > 0 ? (
                <FlatList
                    data={filteredMessages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons name="chatbubbles-outline" size={64} color="#6B7280" />
                    <ThemedText style={styles.emptyTitle}>No messages yet</ThemedText>
                    <ThemedText style={styles.emptyText}>
                        Start a conversation with someone you follow
                    </ThemedText>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF4D6D',
    },
    totalBadge: {
        marginLeft: 12,
        backgroundColor: '#FF4D6D',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 12,
    },
    totalBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    newMessageButton: {
        padding: 8,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
    },
    listContainer: {
        paddingVertical: 4,
    },
    messageCard: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    messageContent: {
        flex: 1,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111114',
    },
    verifiedBadge: {
        marginLeft: 4,
        fontSize: 14,
        color: '#3B82F6',
    },
    timestamp: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    messagePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        flex: 1,
        fontSize: 14,
        color: '#6B7280',
        marginRight: 8,
    },
    typingMessage: {
        fontStyle: 'italic',
        color: '#FF4D6D',
    },
    unreadBadge: {
        backgroundColor: '#FF4D6D',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        alignItems: 'center',
    },
    unreadCount: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111114',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
});