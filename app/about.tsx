import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const socialLinks = [
        { name: 'Twitter', icon: 'logo-twitter', url: 'https://twitter.com/rumoro', color: '#1DA1F2' },
        { name: 'Instagram', icon: 'logo-instagram', url: 'https://instagram.com/rumoro', color: '#E4405F' },
        { name: 'Discord', icon: 'logo-discord', url: 'https://discord.gg/rumoro', color: '#5865F2' },
        { name: 'GitHub', icon: 'logo-github', url: 'https://github.com/rumoro', color: '#181717' }
    ];

    const teamMembers = [
        { name: 'Anonymous Founder', role: 'CEO & Visionary', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Shadow Developer', role: 'CTO & Lead Dev', avatar: 'https://i.pravatar.cc/150?img=2' },
        { name: 'Mystery Designer', role: 'Head of Design', avatar: 'https://i.pravatar.cc/150?img=3' },
        { name: 'Ghost Writer', role: 'Content Lead', avatar: 'https://i.pravatar.cc/150?img=4' }
    ];

    const features = [
        { icon: 'eye-off', title: 'True Anonymity', description: 'No tracking, no data collection' },
        { icon: 'shield-checkmark', title: 'End-to-End Encryption', description: 'Your secrets are safe with us' },
        { icon: 'globe', title: 'Global Community', description: 'Connect with millions worldwide' },
        { icon: 'flash', title: 'Real-Time Updates', description: 'Instant rumor sharing' }
    ];

    const handleLinkPress = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>About Rumoro</ThemedText>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.logoSection}>
                        <View style={[styles.logoContainer, { backgroundColor: '#FF4D6D' }]}>
                            <ThemedText style={styles.logoText}>R</ThemedText>
                        </View>
                        <ThemedText style={styles.appName}>Rumoro</ThemedText>
                        <ThemedText style={styles.tagline}>Share Secrets, Stay Anonymous</ThemedText>
                        <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
                    </View>

                    <View style={[styles.missionCard, { backgroundColor: colors.card }]}>
                        <ThemedText style={styles.missionTitle}>Our Mission</ThemedText>
                        <ThemedText style={styles.missionText}>
                            Rumoro is built on the belief that everyone deserves a space to express themselves freely 
                            without fear of judgment or consequences. We're creating a world where secrets can be 
                            shared, rumors can spread, and truth can emerge - all while protecting your identity.
                        </ThemedText>
                    </View>

                    <View style={styles.featuresSection}>
                        <ThemedText style={styles.sectionTitle}>Why Choose Rumoro?</ThemedText>
                        <View style={styles.featuresGrid}>
                            {features.map((feature, index) => (
                                <View key={index} style={[styles.featureCard, { backgroundColor: colors.card }]}>
                                    <View style={[styles.featureIcon, { backgroundColor: '#FFF5F5' }]}>
                                        <Ionicons 
                                            name={feature.icon as keyof typeof Ionicons.glyphMap} 
                                            size={24} 
                                            color="#FF4D6D" 
                                        />
                                    </View>
                                    <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
                                    <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.teamSection}>
                        <ThemedText style={styles.sectionTitle}>The Anonymous Team</ThemedText>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.teamScroll}
                        >
                            {teamMembers.map((member, index) => (
                                <View key={index} style={[styles.teamMember, { backgroundColor: colors.card }]}>
                                    <Image source={{ uri: member.avatar }} style={styles.teamAvatar} />
                                    <ThemedText style={styles.teamName}>{member.name}</ThemedText>
                                    <ThemedText style={styles.teamRole}>{member.role}</ThemedText>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.statsSection}>
                        <ThemedText style={styles.sectionTitle}>Our Impact</ThemedText>
                        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <ThemedText style={styles.statValue}>5M+</ThemedText>
                                    <ThemedText style={styles.statLabel}>Active Users</ThemedText>
                                </View>
                                <View style={styles.statItem}>
                                    <ThemedText style={styles.statValue}>50M+</ThemedText>
                                    <ThemedText style={styles.statLabel}>Rumors Shared</ThemedText>
                                </View>
                            </View>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <ThemedText style={styles.statValue}>180+</ThemedText>
                                    <ThemedText style={styles.statLabel}>Countries</ThemedText>
                                </View>
                                <View style={styles.statItem}>
                                    <ThemedText style={styles.statValue}>100%</ThemedText>
                                    <ThemedText style={styles.statLabel}>Anonymous</ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.socialSection}>
                        <ThemedText style={styles.sectionTitle}>Connect With Us</ThemedText>
                        <View style={styles.socialLinks}>
                            {socialLinks.map((link, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.socialButton, { backgroundColor: link.color + '20' }]}
                                    onPress={() => handleLinkPress(link.url)}
                                >
                                    <Ionicons 
                                        name={link.icon as keyof typeof Ionicons.glyphMap} 
                                        size={24} 
                                        color={link.color} 
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.legalSection}>
                        <TouchableOpacity 
                            style={styles.legalButton}
                            onPress={() => handleLinkPress('https://rumoro.app/privacy')}
                        >
                            <ThemedText style={styles.legalText}>Privacy Policy</ThemedText>
                            <Ionicons name="chevron-forward" size={16} color="#FF4D6D" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.legalButton}
                            onPress={() => handleLinkPress('https://rumoro.app/terms')}
                        >
                            <ThemedText style={styles.legalText}>Terms of Service</ThemedText>
                            <Ionicons name="chevron-forward" size={16} color="#FF4D6D" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.legalButton}
                            onPress={() => handleLinkPress('https://rumoro.app/licenses')}
                        >
                            <ThemedText style={styles.legalText}>Open Source Licenses</ThemedText>
                            <Ionicons name="chevron-forward" size={16} color="#FF4D6D" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <ThemedText style={styles.footerText}>Made with ❤️ in the shadows</ThemedText>
                        <ThemedText style={styles.copyright}>© 2024 Rumoro. All rights reserved.</ThemedText>
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
    logoSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 8,
    },
    version: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    missionCard: {
        marginHorizontal: 16,
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
    },
    missionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    missionText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#6B7280',
    },
    featuresSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    featureCard: {
        width: '47%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    teamSection: {
        marginBottom: 24,
    },
    teamScroll: {
        paddingHorizontal: 16,
    },
    teamMember: {
        width: 120,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginRight: 12,
    },
    teamAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
    },
    teamName: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    teamRole: {
        fontSize: 11,
        color: '#6B7280',
        textAlign: 'center',
    },
    statsSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    statsCard: {
        padding: 20,
        borderRadius: 12,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF4D6D',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    socialSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    socialLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    socialButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    legalSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    legalButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        marginBottom: 8,
    },
    legalText: {
        fontSize: 14,
        color: '#FF4D6D',
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    copyright: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});