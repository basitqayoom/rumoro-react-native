import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CHANNEL_COST = 30;
const MAX_CHANNEL_NAME_LENGTH = 16;
const MIN_CHANNEL_NAME_LENGTH = 3;

export default function CreateChannelScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const params = useLocalSearchParams();
    const { profileId } = params;
    
    const [channelName, setChannelName] = useState('');
    const [userBuzzScore] = useState(150); // Mock user buzz score
    const [isCreating, setIsCreating] = useState(false);
    
    const remainingChars = MAX_CHANNEL_NAME_LENGTH - channelName.length;
    const canCreate = channelName.length >= MIN_CHANNEL_NAME_LENGTH && 
                     channelName.length <= MAX_CHANNEL_NAME_LENGTH &&
                     userBuzzScore >= CHANNEL_COST;
    
    const validateChannelName = (name: string): { valid: boolean; error?: string } => {
        if (name.length < MIN_CHANNEL_NAME_LENGTH) {
            return { valid: false, error: `Channel name must be at least ${MIN_CHANNEL_NAME_LENGTH} characters` };
        }
        
        if (name.length > MAX_CHANNEL_NAME_LENGTH) {
            return { valid: false, error: `Channel name must be less than ${MAX_CHANNEL_NAME_LENGTH} characters` };
        }
        
        if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
            return { valid: false, error: 'Channel name can only contain letters, numbers, and spaces' };
        }
        
        const bannedWords = ['hate', 'violence', 'spam', 'scam'];
        const nameLower = name.toLowerCase();
        for (const word of bannedWords) {
            if (nameLower.includes(word)) {
                return { valid: false, error: 'Channel name contains prohibited words' };
            }
        }
        
        return { valid: true };
    };
    
    const handleCreate = async () => {
        const validation = validateChannelName(channelName);
        if (!validation.valid) {
            Alert.alert('Invalid Channel Name', validation.error);
            return;
        }
        
        if (userBuzzScore < CHANNEL_COST) {
            Alert.alert(
                'Insufficient Buzz',
                `You need ${CHANNEL_COST} Buzz to create a channel. You currently have ${userBuzzScore} Buzz.`,
                [{ text: 'OK' }]
            );
            return;
        }
        
        Alert.alert(
            'Create Channel?',
            `Creating "${channelName}" will cost ${CHANNEL_COST} Buzz.\n\nYour balance: ${userBuzzScore} Buzz\nAfter creation: ${userBuzzScore - CHANNEL_COST} Buzz`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: `Create (${CHANNEL_COST} Buzz)`,
                    onPress: async () => {
                        setIsCreating(true);
                        
                        // Simulate API call
                        setTimeout(() => {
                            Alert.alert(
                                'Success!',
                                `Channel "${channelName}" has been created!\n\n-${CHANNEL_COST} Buzz\nNew balance: ${userBuzzScore - CHANNEL_COST} Buzz`,
                                [{
                                    text: 'OK',
                                    onPress: () => router.back()
                                }]
                            );
                            setIsCreating(false);
                        }, 1500);
                    }
                }
            ]
        );
    };
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Create Channel</ThemedText>
                    <View style={styles.headerSpacer} />
                </View>
                
                <View style={styles.content}>
                    <View style={styles.buzzInfo}>
                        <View style={styles.buzzBalance}>
                            <Ionicons name="flash" size={24} color="#F59E0B" />
                            <View>
                                <ThemedText style={styles.buzzLabel}>Your Buzz Balance</ThemedText>
                                <ThemedText style={styles.buzzAmount}>{userBuzzScore} Buzz</ThemedText>
                            </View>
                        </View>
                        <View style={styles.costBadge}>
                            <ThemedText style={styles.costText}>Cost: {CHANNEL_COST} Buzz</ThemedText>
                        </View>
                    </View>
                    
                    <View style={styles.inputSection}>
                        <ThemedText style={styles.label}>Channel Name</ThemedText>
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                            placeholder="Enter channel name..."
                            placeholderTextColor="#6B7280"
                            value={channelName}
                            onChangeText={setChannelName}
                            maxLength={MAX_CHANNEL_NAME_LENGTH}
                            autoFocus
                        />
                        <View style={styles.inputHelper}>
                            <ThemedText style={styles.helperText}>
                                {MIN_CHANNEL_NAME_LENGTH}-{MAX_CHANNEL_NAME_LENGTH} characters, letters/numbers/spaces only
                            </ThemedText>
                            <ThemedText style={[
                                styles.charCount,
                                remainingChars < 3 && styles.charCountWarning
                            ]}>
                                {remainingChars}
                            </ThemedText>
                        </View>
                    </View>
                    
                    <View style={styles.rulesSection}>
                        <ThemedText style={styles.rulesTitle}>Channel Rules</ThemedText>
                        <View style={styles.ruleItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <ThemedText style={styles.ruleText}>
                                Community-owned (anyone can post)
                            </ThemedText>
                        </View>
                        <View style={styles.ruleItem}>
                            <Ionicons name="information-circle" size={16} color="#3B82F6" />
                            <ThemedText style={styles.ruleText}>
                                Max 5 custom channels per profile
                            </ThemedText>
                        </View>
                        <View style={styles.ruleItem}>
                            <Ionicons name="time" size={16} color="#6B7280" />
                            <ThemedText style={styles.ruleText}>
                                Auto-hidden if empty for 7 days
                            </ThemedText>
                        </View>
                        <View style={styles.ruleItem}>
                            <Ionicons name="shield" size={16} color="#F59E0B" />
                            <ThemedText style={styles.ruleText}>
                                Profile owner can disable/merge channels
                            </ThemedText>
                        </View>
                    </View>
                    
                    <View style={styles.communityTag}>
                        <Ionicons name="people" size={20} color="#6B7280" />
                        <ThemedText style={styles.communityText}>
                            This channel will be marked as "community-created"
                        </ThemedText>
                    </View>
                    
                    <TouchableOpacity
                        style={[
                            styles.createButton,
                            !canCreate && styles.createButtonDisabled
                        ]}
                        onPress={handleCreate}
                        disabled={!canCreate || isCreating}
                    >
                        {isCreating ? (
                            <ThemedText style={styles.createButtonText}>Creating...</ThemedText>
                        ) : (
                            <>
                                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                                <ThemedText style={styles.createButtonText}>
                                    Create Channel ({CHANNEL_COST} Buzz)
                                </ThemedText>
                            </>
                        )}
                    </TouchableOpacity>
                    
                    <ThemedText style={styles.disclaimer}>
                        Note: Channel creation is non-refundable. Channels are subject to community guidelines.
                    </ThemedText>
                </View>
            </KeyboardAvoidingView>
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
        padding: 20,
    },
    buzzInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    buzzBalance: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    buzzLabel: {
        fontSize: 12,
        color: '#92400E',
    },
    buzzAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#92400E',
    },
    costBadge: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    costText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 12,
    },
    inputSection: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#111114',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    inputHelper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    helperText: {
        fontSize: 12,
        color: '#6B7280',
        flex: 1,
    },
    charCount: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    charCountWarning: {
        color: '#F59E0B',
    },
    rulesSection: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    rulesTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        color: '#6B7280',
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    ruleText: {
        fontSize: 13,
        color: '#6B7280',
        flex: 1,
    },
    communityTag: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        marginBottom: 24,
    },
    communityText: {
        fontSize: 14,
        color: '#6B7280',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4D6D',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        marginBottom: 16,
    },
    createButtonDisabled: {
        backgroundColor: '#FFB3C1',
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    disclaimer: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
    },
});