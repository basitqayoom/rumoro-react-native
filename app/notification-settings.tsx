import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

export default function NotificationSettingsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
    
    const [notifications, setNotifications] = useState<Record<string, NotificationSetting[]>>({
        rumors: [
            {
                id: 'new_rumors',
                title: 'New Rumors',
                description: 'Get notified when new rumors are posted',
                enabled: true
            },
            {
                id: 'trending',
                title: 'Trending Rumors',
                description: 'Updates on trending rumors in your area',
                enabled: true
            },
            {
                id: 'mentions',
                title: 'Mentions',
                description: 'When someone mentions you in a rumor',
                enabled: true
            }
        ],
        social: [
            {
                id: 'new_followers',
                title: 'New Followers',
                description: 'When someone starts following you',
                enabled: true
            },
            {
                id: 'likes',
                title: 'Likes',
                description: 'When someone likes your rumor',
                enabled: false
            },
            {
                id: 'comments',
                title: 'Comments',
                description: 'When someone comments on your rumor',
                enabled: true
            },
            {
                id: 'shares',
                title: 'Shares',
                description: 'When someone shares your rumor',
                enabled: false
            }
        ],
        messages: [
            {
                id: 'direct_messages',
                title: 'Direct Messages',
                description: 'New anonymous messages',
                enabled: true
            },
            {
                id: 'message_requests',
                title: 'Message Requests',
                description: 'New message requests from users',
                enabled: true
            }
        ],
        updates: [
            {
                id: 'app_updates',
                title: 'App Updates',
                description: 'New features and improvements',
                enabled: true
            },
            {
                id: 'security',
                title: 'Security Alerts',
                description: 'Important security notifications',
                enabled: true
            },
            {
                id: 'tips',
                title: 'Tips & Tricks',
                description: 'Helpful tips to use Rumoro better',
                enabled: false
            }
        ]
    });

    const toggleNotification = (category: string, id: string) => {
        setNotifications(prev => ({
            ...prev,
            [category]: prev[category].map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            )
        }));
    };

    const renderNotificationItem = (item: NotificationSetting, category: string) => (
        <View key={item.id} style={[styles.notificationItem, { backgroundColor: colors.card }]}>
            <View style={styles.notificationInfo}>
                <ThemedText style={styles.notificationTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.notificationDescription}>{item.description}</ThemedText>
            </View>
            <Switch
                value={item.enabled}
                onValueChange={() => toggleNotification(category, item.id)}
                trackColor={{ false: '#E5E7EB', true: '#FF4D6D' }}
                thumbColor={item.enabled ? '#fff' : '#f4f3f4'}
            />
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Notification Settings</ThemedText>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={[styles.masterControls, { backgroundColor: colors.card }]}>
                        <View style={styles.masterControl}>
                            <View style={styles.masterControlInfo}>
                                <ThemedText style={styles.masterTitle}>Push Notifications</ThemedText>
                                <ThemedText style={styles.masterDescription}>
                                    Receive notifications on your device
                                </ThemedText>
                            </View>
                            <Switch
                                value={pushEnabled}
                                onValueChange={setPushEnabled}
                                trackColor={{ false: '#E5E7EB', true: '#FF4D6D' }}
                                thumbColor={pushEnabled ? '#fff' : '#f4f3f4'}
                            />
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.masterControl}>
                            <View style={styles.masterControlInfo}>
                                <ThemedText style={styles.masterTitle}>Email Notifications</ThemedText>
                                <ThemedText style={styles.masterDescription}>
                                    Receive notifications via email
                                </ThemedText>
                            </View>
                            <Switch
                                value={emailEnabled}
                                onValueChange={setEmailEnabled}
                                trackColor={{ false: '#E5E7EB', true: '#FF4D6D' }}
                                thumbColor={emailEnabled ? '#fff' : '#f4f3f4'}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Rumors & Posts</ThemedText>
                        <View style={styles.sectionContent}>
                            {notifications.rumors.map(item => renderNotificationItem(item, 'rumors'))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Social Activity</ThemedText>
                        <View style={styles.sectionContent}>
                            {notifications.social.map(item => renderNotificationItem(item, 'social'))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Messages</ThemedText>
                        <View style={styles.sectionContent}>
                            {notifications.messages.map(item => renderNotificationItem(item, 'messages'))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>App Updates</ThemedText>
                        <View style={styles.sectionContent}>
                            {notifications.updates.map(item => renderNotificationItem(item, 'updates'))}
                        </View>
                    </View>

                    <View style={styles.quietHours}>
                        <ThemedText style={styles.quietHoursTitle}>Quiet Hours</ThemedText>
                        <ThemedText style={styles.quietHoursDescription}>
                            Mute notifications during specific hours
                        </ThemedText>
                        <TouchableOpacity style={[styles.setQuietHoursButton, { backgroundColor: colors.card }]}>
                            <ThemedText style={styles.setQuietHoursText}>Set Quiet Hours</ThemedText>
                            <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
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
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    masterControls: {
        margin: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    masterControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    masterControlInfo: {
        flex: 1,
        marginRight: 12,
    },
    masterTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    masterDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 8,
        marginHorizontal: 20,
        textTransform: 'uppercase',
    },
    sectionContent: {
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: 1,
    },
    notificationInfo: {
        flex: 1,
        marginRight: 12,
    },
    notificationTitle: {
        fontSize: 16,
        marginBottom: 4,
    },
    notificationDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    quietHours: {
        margin: 16,
        marginTop: 32,
    },
    quietHoursTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    quietHoursDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    setQuietHoursButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
    },
    setQuietHoursText: {
        fontSize: 16,
    },
});