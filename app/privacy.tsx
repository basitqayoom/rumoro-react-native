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

export default function PrivacyScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const [privateProfile, setPrivateProfile] = useState(false);
    const [hideLocation, setHideLocation] = useState(true);
    const [hideActivity, setHideActivity] = useState(false);
    const [allowMessages, setAllowMessages] = useState(true);
    const [showOnline, setShowOnline] = useState(true);
    const [shareData, setShareData] = useState(false);
    const [personalized, setPersonalized] = useState(true);
    const [analytics, setAnalytics] = useState(true);

    const handleBlockedUsers = () => {
        Alert.alert('Blocked Users', 'You have 3 blocked users');
    };

    const handleDataRequest = () => {
        Alert.alert(
            'Request Your Data',
            'We will prepare your data and send it to your email within 24 hours.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Request', onPress: () => Alert.alert('Success', 'Data request submitted!') }
            ]
        );
    };

    const privacySettings = [
        {
            title: 'Profile Privacy',
            items: [
                {
                    id: 'private_profile',
                    title: 'Private Profile',
                    description: 'Only approved followers can see your posts',
                    value: privateProfile,
                    onChange: setPrivateProfile
                },
                {
                    id: 'hide_location',
                    title: 'Hide Location',
                    description: 'Don\'t show your location on posts',
                    value: hideLocation,
                    onChange: setHideLocation
                },
                {
                    id: 'hide_activity',
                    title: 'Hide Activity Status',
                    description: 'Don\'t show when you were last active',
                    value: hideActivity,
                    onChange: setHideActivity
                }
            ]
        },
        {
            title: 'Communications',
            items: [
                {
                    id: 'allow_messages',
                    title: 'Allow Messages',
                    description: 'Receive messages from other users',
                    value: allowMessages,
                    onChange: setAllowMessages
                },
                {
                    id: 'show_online',
                    title: 'Show Online Status',
                    description: 'Let others see when you\'re online',
                    value: showOnline,
                    onChange: setShowOnline
                }
            ]
        },
        {
            title: 'Data & Analytics',
            items: [
                {
                    id: 'share_data',
                    title: 'Share Usage Data',
                    description: 'Help improve Rumoro by sharing anonymous usage data',
                    value: shareData,
                    onChange: setShareData
                },
                {
                    id: 'personalized',
                    title: 'Personalized Content',
                    description: 'Show content based on your activity',
                    value: personalized,
                    onChange: setPersonalized
                },
                {
                    id: 'analytics',
                    title: 'Analytics',
                    description: 'Allow Rumoro to collect analytics data',
                    value: analytics,
                    onChange: setAnalytics
                }
            ]
        }
    ];

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Privacy</ThemedText>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={[styles.infoCard, { backgroundColor: '#FFF5F5' }]}>
                        <Ionicons name="shield-checkmark" size={24} color="#FF4D6D" />
                        <ThemedText style={styles.infoText}>
                            Your privacy is important to us. All data is encrypted and stored securely.
                        </ThemedText>
                    </View>

                    {privacySettings.map((section, index) => (
                        <View key={index} style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
                            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
                                {section.items.map((item, itemIndex) => (
                                    <View key={item.id}>
                                        <View style={styles.settingItem}>
                                            <View style={styles.settingInfo}>
                                                <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
                                                <ThemedText style={styles.settingDescription}>
                                                    {item.description}
                                                </ThemedText>
                                            </View>
                                            <Switch
                                                value={item.value}
                                                onValueChange={item.onChange}
                                                trackColor={{ false: '#E5E7EB', true: '#FF4D6D' }}
                                                thumbColor={item.value ? '#fff' : '#f4f3f4'}
                                            />
                                        </View>
                                        {itemIndex < section.items.length - 1 && (
                                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}

                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Manage Privacy</ThemedText>
                        <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
                            <TouchableOpacity style={styles.actionItem} onPress={handleBlockedUsers}>
                                <View style={styles.actionInfo}>
                                    <Ionicons name="ban" size={20} color={colors.text} style={styles.actionIcon} />
                                    <View>
                                        <ThemedText style={styles.actionTitle}>Blocked Users</ThemedText>
                                        <ThemedText style={styles.actionDescription}>
                                            Manage your blocked users list
                                        </ThemedText>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
                            </TouchableOpacity>
                            
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            
                            <TouchableOpacity style={styles.actionItem}>
                                <View style={styles.actionInfo}>
                                    <Ionicons name="eye-off" size={20} color={colors.text} style={styles.actionIcon} />
                                    <View>
                                        <ThemedText style={styles.actionTitle}>Hidden Words</ThemedText>
                                        <ThemedText style={styles.actionDescription}>
                                            Filter out specific words from your feed
                                        </ThemedText>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
                            </TouchableOpacity>
                            
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            
                            <TouchableOpacity style={styles.actionItem} onPress={handleDataRequest}>
                                <View style={styles.actionInfo}>
                                    <Ionicons name="download" size={20} color={colors.text} style={styles.actionIcon} />
                                    <View>
                                        <ThemedText style={styles.actionTitle}>Download Your Data</ThemedText>
                                        <ThemedText style={styles.actionDescription}>
                                            Get a copy of your Rumoro data
                                        </ThemedText>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.legalSection}>
                        <TouchableOpacity style={styles.legalLink}>
                            <ThemedText style={styles.legalText}>Privacy Policy</ThemedText>
                            <Ionicons name="open-outline" size={16} color="#FF4D6D" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.legalLink}>
                            <ThemedText style={styles.legalText}>Terms of Service</ThemedText>
                            <Ionicons name="open-outline" size={16} color="#FF4D6D" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.legalLink}>
                            <ThemedText style={styles.legalText}>Cookie Policy</ThemedText>
                            <Ionicons name="open-outline" size={16} color="#FF4D6D" />
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
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        padding: 16,
        borderRadius: 12,
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: '#7F1D1D',
        lineHeight: 20,
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
        padding: 16,
    },
    settingInfo: {
        flex: 1,
        marginRight: 12,
    },
    settingTitle: {
        fontSize: 16,
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    actionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    actionIcon: {
        marginRight: 12,
    },
    actionTitle: {
        fontSize: 16,
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    legalSection: {
        marginTop: 32,
        marginHorizontal: 16,
    },
    legalLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    legalText: {
        fontSize: 14,
        color: '#FF4D6D',
        fontWeight: '500',
    },
});