import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SettingItem {
    id: string;
    title: string;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    type: 'toggle' | 'navigation' | 'action';
    value?: boolean;
    action?: () => void;
    route?: string;
}

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    
    const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
    const [anonymousMode, setAnonymousMode] = useState(true);
    const [autoplay, setAutoplay] = useState(true);
    const [dataSync, setDataSync] = useState(true);

    const handleClearCache = () => {
        Alert.alert(
            'Clear Cache',
            'Are you sure you want to clear all cached data?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Clear', 
                    style: 'destructive',
                    onPress: () => Alert.alert('Success', 'Cache cleared successfully!')
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This action cannot be undone. All your data will be permanently deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => Alert.alert('Account Deletion', 'Your request has been submitted.')
                }
            ]
        );
    };

    const settingsSections = [
        {
            title: 'Appearance',
            items: [
                {
                    id: 'darkMode',
                    title: 'Dark Mode',
                    subtitle: 'Toggle dark theme',
                    icon: 'moon-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'toggle' as const,
                    value: darkMode,
                    action: () => setDarkMode(!darkMode)
                },
                {
                    id: 'fontSize',
                    title: 'Font Size',
                    subtitle: 'Adjust text size',
                    icon: 'text-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'navigation' as const,
                }
            ]
        },
        {
            title: 'Privacy & Security',
            items: [
                {
                    id: 'anonymous',
                    title: 'Anonymous Mode',
                    subtitle: 'Hide your identity',
                    icon: 'eye-off-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'toggle' as const,
                    value: anonymousMode,
                    action: () => setAnonymousMode(!anonymousMode)
                },
                {
                    id: 'socialAccounts',
                    title: 'Linked Social Accounts',
                    subtitle: 'Manage connected accounts',
                    icon: 'link-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'navigation' as const,
                    route: '/social-linking'
                },
                {
                    id: 'blockedUsers',
                    title: 'Blocked Users',
                    subtitle: 'Manage blocked accounts',
                    icon: 'ban' as keyof typeof Ionicons.glyphMap,
                    type: 'navigation' as const,
                },
                {
                    id: 'changePassword',
                    title: 'Change Password',
                    icon: 'lock-closed-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'navigation' as const,
                }
            ]
        },
        {
            title: 'Content & Media',
            items: [
                {
                    id: 'autoplay',
                    title: 'Autoplay Videos',
                    subtitle: 'Play videos automatically',
                    icon: 'play-circle-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'toggle' as const,
                    value: autoplay,
                    action: () => setAutoplay(!autoplay)
                },
                {
                    id: 'dataSync',
                    title: 'Background Sync',
                    subtitle: 'Sync data in background',
                    icon: 'sync-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'toggle' as const,
                    value: dataSync,
                    action: () => setDataSync(!dataSync)
                },
                {
                    id: 'downloadQuality',
                    title: 'Download Quality',
                    subtitle: 'High quality',
                    icon: 'download-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'navigation' as const,
                }
            ]
        },
        {
            title: 'Storage',
            items: [
                {
                    id: 'clearCache',
                    title: 'Clear Cache',
                    subtitle: '125 MB',
                    icon: 'trash-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'action' as const,
                    action: handleClearCache
                },
                {
                    id: 'storage',
                    title: 'Storage Usage',
                    subtitle: '1.2 GB used',
                    icon: 'folder-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'navigation' as const,
                }
            ]
        },
        {
            title: 'Account',
            items: [
                {
                    id: 'exportData',
                    title: 'Export Data',
                    subtitle: 'Download your data',
                    icon: 'cloud-download-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'navigation' as const,
                },
                {
                    id: 'deleteAccount',
                    title: 'Delete Account',
                    subtitle: 'Permanently delete your account',
                    icon: 'warning-outline' as keyof typeof Ionicons.glyphMap,
                    type: 'action' as const,
                    action: handleDeleteAccount
                }
            ]
        }
    ];

    const renderSettingItem = (item: SettingItem) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.settingItem, { backgroundColor: colors.card }]}
                onPress={() => {
                    if (item.route) {
                        router.push(item.route as any);
                    } else if (item.action) {
                        item.action();
                    }
                }}
                activeOpacity={item.type === 'toggle' ? 1 : 0.7}
            >
                <View style={styles.settingItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                        <Ionicons name={item.icon} size={20} color={colors.text} />
                    </View>
                    <View style={styles.settingItemText}>
                        <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
                        {item.subtitle && (
                            <ThemedText style={styles.settingSubtitle}>{item.subtitle}</ThemedText>
                        )}
                    </View>
                </View>
                {item.type === 'toggle' && (
                    <Switch
                        value={item.value}
                        onValueChange={item.action}
                        trackColor={{ false: '#E5E7EB', true: '#FF4D6D' }}
                        thumbColor={item.value ? '#fff' : '#f4f3f4'}
                    />
                )}
                {item.type === 'navigation' && (
                    <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
                )}
                {item.type === 'action' && item.id === 'deleteAccount' && (
                    <Ionicons name="chevron-forward" size={20} color="#EF4444" />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Settings</ThemedText>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {settingsSections.map((section, index) => (
                        <View key={index} style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
                            <View style={styles.sectionContent}>
                                {section.items.map(renderSettingItem)}
                            </View>
                        </View>
                    ))}
                    
                    <View style={styles.footer}>
                        <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
                        <ThemedText style={styles.copyright}>© 2024 Rumoro</ThemedText>
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
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingItemText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    version: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    copyright: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});