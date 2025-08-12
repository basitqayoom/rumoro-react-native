import React, { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'mention' | 'share';
    user: {
        name: string;
        avatar: string;
    };
    message: string;
    timestamp: string;
    isRead: boolean;
    relatedContent?: string;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'like',
        user: {
            name: 'Emma Davis',
            avatar: 'https://i.pravatar.cc/150?img=3'
        },
        message: 'liked your gossip',
        timestamp: '5m ago',
        isRead: false,
        relatedContent: 'Did you guys see what happened at the mall today?'
    },
    {
        id: '2',
        type: 'follow',
        user: {
            name: 'Ryan Cooper',
            avatar: 'https://i.pravatar.cc/150?img=8'
        },
        message: 'started following you',
        timestamp: '1h ago',
        isRead: false
    },
    {
        id: '3',
        type: 'comment',
        user: {
            name: 'Sarah Johnson',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },
        message: 'commented on your gossip',
        timestamp: '2h ago',
        isRead: true,
        relatedContent: 'This is absolutely hilarious! I was there too!'
    },
    {
        id: '4',
        type: 'mention',
        user: {
            name: 'Mike Chen',
            avatar: 'https://i.pravatar.cc/150?img=2'
        },
        message: 'mentioned you in a gossip',
        timestamp: '3h ago',
        isRead: true,
        relatedContent: 'As @you mentioned earlier, this place is amazing!'
    },
    {
        id: '5',
        type: 'share',
        user: {
            name: 'Jessica Lee',
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
        message: 'shared your gossip',
        timestamp: '5h ago',
        isRead: true
    },
    {
        id: '6',
        type: 'like',
        user: {
            name: 'David Wilson',
            avatar: 'https://i.pravatar.cc/150?img=6'
        },
        message: 'liked your gossip',
        timestamp: 'Yesterday',
        isRead: true,
        relatedContent: 'Office drama alert: Someone keeps stealing lunches'
    }
];

export default function NotificationsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [notifications, setNotifications] = useState(mockNotifications);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'like':
                return '❤️';
            case 'comment':
                return '💬';
            case 'follow':
                return '👤';
            case 'mention':
                return '@';
            case 'share':
                return '🔄';
            default:
                return '📢';
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity 
            style={[
                styles.notificationCard, 
                { backgroundColor: item.isRead ? colors.background : colors.card },
                !item.isRead && styles.unreadCard
            ]}
            onPress={() => markAsRead(item.id)}
        >
            <View style={styles.notificationContent}>
                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                <View style={styles.textContent}>
                    <View style={styles.messageRow}>
                        <ThemedText style={styles.userName}>{item.user.name}</ThemedText>
                        <ThemedText style={styles.message}> {item.message}</ThemedText>
                    </View>
                    {item.relatedContent && (
                        <ThemedText style={styles.relatedContent} numberOfLines={1}>
                            {item.relatedContent}
                        </ThemedText>
                    )}
                    <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
                </View>
                <View style={styles.iconContainer}>
                    <ThemedText style={styles.notificationIcon}>
                        {getNotificationIcon(item.type)}
                    </ThemedText>
                </View>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <ThemedText type="h1" style={styles.title}>Notifications</ThemedText>
                {unreadCount > 0 && (
                    <View style={styles.badge}>
                        <ThemedText style={styles.badgeText}>{unreadCount}</ThemedText>
                    </View>
                )}
            </View>

            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    renderItem={renderNotification}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons name="notifications-off" size={64} color="#6B7280" />
                    <ThemedText style={styles.emptyTitle}>No notifications yet</ThemedText>
                    <ThemedText style={styles.emptyText}>
                        When someone interacts with your gossips, you'll see it here
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
    badge: {
        marginLeft: 12,
        backgroundColor: '#FF4D6D',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    listContainer: {
        paddingVertical: 8,
    },
    notificationCard: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        position: 'relative',
    },
    unreadCard: {
        backgroundColor: '#FFF9FA',
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    textContent: {
        flex: 1,
    },
    messageRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    userName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111114',
    },
    message: {
        fontSize: 15,
        color: '#6B7280',
    },
    relatedContent: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
        fontStyle: 'italic',
    },
    timestamp: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 4,
    },
    iconContainer: {
        marginLeft: 8,
    },
    notificationIcon: {
        fontSize: 20,
    },
    unreadDot: {
        position: 'absolute',
        left: 8,
        top: '50%',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF4D6D',
        marginTop: -4,
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