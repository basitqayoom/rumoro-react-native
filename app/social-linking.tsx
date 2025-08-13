import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SocialAccount {
    platform: 'instagram' | 'twitter' | 'snapchat';
    handle?: string;
    isConnected: boolean;
    followerCount?: number;
    profileUrl?: string;
}

export default function SocialLinkingScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    
    const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
        {
            platform: 'instagram',
            isConnected: false
        },
        {
            platform: 'twitter',
            isConnected: false
        },
        {
            platform: 'snapchat',
            isConnected: false
        }
    ]);
    
    const [isLinking, setIsLinking] = useState<string | null>(null);
    
    const getPlatformDetails = (platform: string) => {
        switch (platform) {
            case 'instagram':
                return {
                    name: 'Instagram',
                    icon: 'logo-instagram',
                    color: '#E4405F',
                    description: 'Connect your Instagram account to discover and claim profiles'
                };
            case 'twitter':
                return {
                    name: 'X (Twitter)',
                    icon: 'logo-twitter',
                    color: '#1DA1F2',
                    description: 'Link your X account for profile verification'
                };
            case 'snapchat':
                return {
                    name: 'Snapchat',
                    icon: 'logo-snapchat',
                    color: '#FFFC00',
                    description: 'Connect Snapchat for anonymous sharing'
                };
            default:
                return null;
        }
    };
    
    const handleConnect = async (platform: string) => {
        setIsLinking(platform);
        
        // Simulate OAuth flow
        Alert.alert(
            `Connect ${getPlatformDetails(platform)?.name}`,
            'You will be redirected to authenticate with your account. Your password will never be shared with Rumoro.',
            [
                { text: 'Cancel', style: 'cancel', onPress: () => setIsLinking(null) },
                {
                    text: 'Continue',
                    onPress: async () => {
                        // Simulate OAuth redirect
                        setTimeout(() => {
                            // Mock successful connection
                            const mockData = {
                                instagram: { handle: '@johndoe', followers: 1234 },
                                twitter: { handle: '@john_doe', followers: 5678 },
                                snapchat: { handle: 'johndoe123', followers: 890 }
                            };
                            
                            setSocialAccounts(accounts =>
                                accounts.map(acc =>
                                    acc.platform === platform
                                        ? {
                                            ...acc,
                                            isConnected: true,
                                            handle: mockData[platform as keyof typeof mockData].handle,
                                            followerCount: mockData[platform as keyof typeof mockData].followers
                                        }
                                        : acc
                                )
                            );
                            
                            setIsLinking(null);
                            Alert.alert(
                                'Success!',
                                `Your ${getPlatformDetails(platform)?.name} account has been connected.`
                            );
                        }, 2000);
                    }
                }
            ]
        );
    };
    
    const handleDisconnect = (platform: string) => {
        Alert.alert(
            'Disconnect Account?',
            `Are you sure you want to disconnect your ${getPlatformDetails(platform)?.name} account?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Disconnect',
                    style: 'destructive',
                    onPress: () => {
                        setSocialAccounts(accounts =>
                            accounts.map(acc =>
                                acc.platform === platform
                                    ? { ...acc, isConnected: false, handle: undefined, followerCount: undefined }
                                    : acc
                            )
                        );
                        Alert.alert('Account Disconnected', 'You can reconnect anytime.');
                    }
                }
            ]
        );
    };
    
    const renderSocialCard = (account: SocialAccount) => {
        const details = getPlatformDetails(account.platform);
        if (!details) return null;
        
        return (
            <View key={account.platform} style={[styles.socialCard, { backgroundColor: colors.card }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: details.color + '20' }]}>
                        <Ionicons name={details.icon as any} size={28} color={details.color} />
                    </View>
                    <View style={styles.platformInfo}>
                        <ThemedText style={styles.platformName}>{details.name}</ThemedText>
                        {account.isConnected ? (
                            <View style={styles.connectedInfo}>
                                <ThemedText style={styles.handle}>{account.handle}</ThemedText>
                                {account.followerCount && (
                                    <ThemedText style={styles.followers}>
                                        {account.followerCount.toLocaleString()} followers
                                    </ThemedText>
                                )}
                            </View>
                        ) : (
                            <ThemedText style={styles.description}>{details.description}</ThemedText>
                        )}
                    </View>
                </View>
                
                {account.isConnected ? (
                    <View style={styles.connectedActions}>
                        <View style={styles.connectedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <ThemedText style={styles.connectedText}>Connected</ThemedText>
                        </View>
                        <TouchableOpacity
                            style={styles.disconnectButton}
                            onPress={() => handleDisconnect(account.platform)}
                        >
                            <ThemedText style={styles.disconnectText}>Disconnect</ThemedText>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.connectButton, { backgroundColor: details.color }]}
                        onPress={() => handleConnect(account.platform)}
                        disabled={isLinking !== null}
                    >
                        {isLinking === account.platform ? (
                            <ThemedText style={styles.connectButtonText}>Connecting...</ThemedText>
                        ) : (
                            <>
                                <Ionicons name="link" size={20} color="#FFFFFF" />
                                <ThemedText style={styles.connectButtonText}>Connect</ThemedText>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    };
    
    const connectedCount = socialAccounts.filter(acc => acc.isConnected).length;
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Link Social Accounts</ThemedText>
                <View style={styles.headerSpacer} />
            </View>
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <Ionicons name="shield-checkmark" size={32} color="#3B82F6" />
                        <ThemedText style={styles.infoTitle}>Why Link Your Accounts?</ThemedText>
                        <View style={styles.benefitsList}>
                            <View style={styles.benefitItem}>
                                <Ionicons name="checkmark" size={16} color="#10B981" />
                                <ThemedText style={styles.benefitText}>
                                    Discover profiles associated with your accounts
                                </ThemedText>
                            </View>
                            <View style={styles.benefitItem}>
                                <Ionicons name="checkmark" size={16} color="#10B981" />
                                <ThemedText style={styles.benefitText}>
                                    Claim your profiles and earn 10 Buzz
                                </ThemedText>
                            </View>
                            <View style={styles.benefitItem}>
                                <Ionicons name="checkmark" size={16} color="#10B981" />
                                <ThemedText style={styles.benefitText}>
                                    Get verified badge on your profiles
                                </ThemedText>
                            </View>
                            <View style={styles.benefitItem}>
                                <Ionicons name="checkmark" size={16} color="#10B981" />
                                <ThemedText style={styles.benefitText}>
                                    No passwords stored - OAuth only
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                </View>
                
                <View style={styles.statusBar}>
                    <ThemedText style={styles.statusText}>
                        {connectedCount} of 3 accounts connected
                    </ThemedText>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill,
                                { width: `${(connectedCount / 3) * 100}%` }
                            ]}
                        />
                    </View>
                </View>
                
                <View style={styles.accountsSection}>
                    {socialAccounts.map(renderSocialCard)}
                </View>
                
                <View style={styles.privacySection}>
                    <Ionicons name="lock-closed" size={20} color="#6B7280" />
                    <ThemedText style={styles.privacyText}>
                        Your social accounts are used only for discovery and verification. 
                        We never post on your behalf or access private information.
                    </ThemedText>
                </View>
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
    content: {
        flex: 1,
    },
    infoSection: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: '#EFF6FF',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E40AF',
        marginTop: 12,
        marginBottom: 16,
    },
    benefitsList: {
        width: '100%',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 8,
    },
    benefitText: {
        fontSize: 14,
        color: '#3B82F6',
        flex: 1,
        lineHeight: 20,
    },
    statusBar: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    statusText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 4,
    },
    accountsSection: {
        paddingHorizontal: 20,
    },
    socialCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    platformInfo: {
        flex: 1,
    },
    platformName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    connectedInfo: {
        gap: 2,
    },
    handle: {
        fontSize: 14,
        color: '#111114',
        fontWeight: '500',
    },
    followers: {
        fontSize: 12,
        color: '#6B7280',
    },
    connectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    connectButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    connectedActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    connectedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    connectedText: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '500',
    },
    disconnectButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    disconnectText: {
        fontSize: 14,
        color: '#EF4444',
        fontWeight: '500',
    },
    privacySection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F9FAFB',
        padding: 16,
        margin: 20,
        borderRadius: 12,
        gap: 12,
    },
    privacyText: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        flex: 1,
    },
});