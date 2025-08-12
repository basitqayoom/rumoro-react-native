import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export default function HelpScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const faqCategories = [
        {
            title: 'Getting Started',
            items: [
                {
                    id: 'start1',
                    question: 'How do I create an anonymous account?',
                    answer: 'Creating an anonymous account is easy! Simply sign up with a username and password. No email or personal information required. Your identity remains completely private.'
                },
                {
                    id: 'start2',
                    question: 'What is Rumoro?',
                    answer: 'Rumoro is an anonymous social platform where you can share and discover rumors, secrets, and stories without revealing your identity. It\'s a safe space for free expression.'
                },
                {
                    id: 'start3',
                    question: 'Is Rumoro really anonymous?',
                    answer: 'Yes! We don\'t collect personal information, track IP addresses, or store any data that could identify you. Your privacy is our top priority.'
                }
            ]
        },
        {
            title: 'Posting & Sharing',
            items: [
                {
                    id: 'post1',
                    question: 'How do I post a rumor?',
                    answer: 'Tap the plus button on the main screen, write your rumor (up to 280 characters), add hashtags if desired, and hit post. Your rumor will be shared anonymously.'
                },
                {
                    id: 'post2',
                    question: 'Can I edit or delete my posts?',
                    answer: 'You can delete your posts within 24 hours of posting. After that, posts become permanent to maintain the authentic rumor ecosystem. Editing is not available to prevent manipulation.'
                },
                {
                    id: 'post3',
                    question: 'What are trending rumors?',
                    answer: 'Trending rumors are the most popular posts based on engagement (likes, comments, shares) in your area or globally. They appear in the Trending tab.'
                }
            ]
        },
        {
            title: 'Privacy & Safety',
            items: [
                {
                    id: 'privacy1',
                    question: 'How do I block someone?',
                    answer: 'Go to their profile, tap the three dots menu, and select "Block User". They won\'t be able to see your posts or message you.'
                },
                {
                    id: 'privacy2',
                    question: 'What happens if I report content?',
                    answer: 'Reported content is reviewed by our moderation team within 24 hours. If it violates our guidelines, it will be removed. The reporter remains anonymous.'
                },
                {
                    id: 'privacy3',
                    question: 'Can others see my activity?',
                    answer: 'By default, your likes and follows are private. You can adjust these settings in Privacy settings to make them visible or completely hidden.'
                }
            ]
        },
        {
            title: 'Account & Settings',
            items: [
                {
                    id: 'account1',
                    question: 'How do I recover my account?',
                    answer: 'If you set up a recovery email (optional), you can reset your password. Otherwise, for security reasons, anonymous accounts cannot be recovered.'
                },
                {
                    id: 'account2',
                    question: 'Can I have multiple accounts?',
                    answer: 'Yes, you can create multiple anonymous accounts. Each account is completely separate and there\'s no link between them.'
                },
                {
                    id: 'account3',
                    question: 'How do I delete my account?',
                    answer: 'Go to Settings > Account > Delete Account. This action is permanent and will remove all your posts and data immediately.'
                }
            ]
        }
    ];

    const toggleExpanded = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleContactSupport = () => {
        Alert.alert(
            'Contact Support',
            'Choose how you\'d like to reach us:',
            [
                { text: 'Email', onPress: () => Alert.alert('Email', 'support@rumoro.app') },
                { text: 'In-App Chat', onPress: () => Alert.alert('Chat', 'Opening chat support...') },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const filteredCategories = faqCategories.map(category => ({
        ...category,
        items: category.items.filter(item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.items.length > 0);

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Help & Support</ThemedText>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.searchContainer}>
                        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
                            <Ionicons name="search" size={20} color={colors.tabIconDefault} />
                            <TextInput
                                style={[styles.searchInput, { color: colors.text }]}
                                placeholder="Search for help..."
                                placeholderTextColor={colors.tabIconDefault}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Ionicons name="close-circle" size={20} color={colors.tabIconDefault} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View style={styles.quickActions}>
                        <TouchableOpacity 
                            style={[styles.quickAction, { backgroundColor: colors.card }]}
                            onPress={handleContactSupport}
                        >
                            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF5F5' }]}>
                                <Ionicons name="chatbubbles" size={24} color="#FF4D6D" />
                            </View>
                            <ThemedText style={styles.quickActionTitle}>Contact Support</ThemedText>
                            <ThemedText style={styles.quickActionDescription}>Get help from our team</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.card }]}>
                            <View style={[styles.quickActionIcon, { backgroundColor: '#F0F9FF' }]}>
                                <Ionicons name="book" size={24} color="#3B82F6" />
                            </View>
                            <ThemedText style={styles.quickActionTitle}>User Guide</ThemedText>
                            <ThemedText style={styles.quickActionDescription}>Learn how to use Rumoro</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.faqSection}>
                        <ThemedText style={styles.faqTitle}>Frequently Asked Questions</ThemedText>
                        
                        {filteredCategories.map((category, index) => (
                            <View key={index} style={styles.category}>
                                <ThemedText style={styles.categoryTitle}>{category.title}</ThemedText>
                                {category.items.map(item => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.faqItem, { backgroundColor: colors.card }]}
                                        onPress={() => toggleExpanded(item.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.faqHeader}>
                                            <ThemedText style={styles.faqQuestion}>{item.question}</ThemedText>
                                            <Ionicons 
                                                name={expandedItems.includes(item.id) ? 'chevron-up' : 'chevron-down'} 
                                                size={20} 
                                                color={colors.tabIconDefault}
                                            />
                                        </View>
                                        {expandedItems.includes(item.id) && (
                                            <ThemedText style={styles.faqAnswer}>{item.answer}</ThemedText>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}

                        {filteredCategories.length === 0 && (
                            <View style={styles.noResults}>
                                <Ionicons name="search" size={48} color={colors.tabIconDefault} />
                                <ThemedText style={styles.noResultsText}>No results found</ThemedText>
                                <ThemedText style={styles.noResultsSubtext}>
                                    Try searching with different keywords
                                </ThemedText>
                            </View>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <ThemedText style={styles.footerTitle}>Still need help?</ThemedText>
                        <ThemedText style={styles.footerText}>
                            Our support team is available 24/7 to assist you with any questions or issues.
                        </ThemedText>
                        <TouchableOpacity 
                            style={[styles.contactButton, { backgroundColor: '#FF4D6D' }]}
                            onPress={handleContactSupport}
                        >
                            <ThemedText style={styles.contactButtonText}>Contact Support Team</ThemedText>
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
    searchContainer: {
        padding: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    quickAction: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    quickActionDescription: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    faqSection: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    faqTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    category: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    faqItem: {
        marginBottom: 8,
        borderRadius: 12,
        padding: 16,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
        marginRight: 12,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 12,
        lineHeight: 20,
    },
    noResults: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noResultsText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
    },
    noResultsSubtext: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    footer: {
        marginTop: 40,
        marginHorizontal: 16,
        padding: 24,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        alignItems: 'center',
    },
    footerTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 20,
    },
    contactButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    contactButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});