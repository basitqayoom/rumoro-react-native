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
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ReportReason {
    id: string;
    title: string;
    description: string;
    icon: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

const reportReasons: ReportReason[] = [
    {
        id: 'doxxing',
        title: 'Personal Information',
        description: 'Contains real names, addresses, phone numbers, or other private info',
        icon: 'alert-circle',
        severity: 'critical'
    },
    {
        id: 'threats',
        title: 'Threats or Violence',
        description: 'Contains threats of violence or harm to individuals',
        icon: 'warning',
        severity: 'critical'
    },
    {
        id: 'hate',
        title: 'Hate Speech',
        description: 'Promotes discrimination or hatred against groups or individuals',
        icon: 'close-circle',
        severity: 'high'
    },
    {
        id: 'harassment',
        title: 'Harassment or Bullying',
        description: 'Targeted harassment or bullying of individuals',
        icon: 'person-remove',
        severity: 'high'
    },
    {
        id: 'sexual',
        title: 'Sexual Content',
        description: 'Inappropriate sexual content or involving minors',
        icon: 'eye-off',
        severity: 'high'
    },
    {
        id: 'spam',
        title: 'Spam',
        description: 'Repetitive, promotional, or irrelevant content',
        icon: 'mail',
        severity: 'low'
    },
    {
        id: 'misinformation',
        title: 'Misinformation',
        description: 'Deliberately false or misleading information',
        icon: 'information-circle',
        severity: 'medium'
    },
    {
        id: 'other',
        title: 'Other',
        description: 'Content violates community guidelines in another way',
        icon: 'ellipsis-horizontal',
        severity: 'medium'
    }
];

export default function ReportContentScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const params = useLocalSearchParams();
    const { contentType, contentId } = params;
    
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return '#DC2626';
            case 'high': return '#F59E0B';
            case 'medium': return '#3B82F6';
            case 'low': return '#6B7280';
            default: return '#6B7280';
        }
    };
    
    const handleSubmit = () => {
        if (!selectedReason) {
            Alert.alert('Error', 'Please select a reason for reporting');
            return;
        }
        
        const reason = reportReasons.find(r => r.id === selectedReason);
        
        Alert.alert(
            'Submit Report?',
            `You are reporting this ${contentType} for: ${reason?.title}\n\nFalse reports may result in action against your account.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Submit Report',
                    style: 'destructive',
                    onPress: () => {
                        setIsSubmitting(true);
                        
                        // Simulate API call
                        setTimeout(() => {
                            Alert.alert(
                                'Report Submitted',
                                'Thank you for helping keep our community safe. We\'ll review this content within 24 hours.',
                                [{ text: 'OK', onPress: () => router.back() }]
                            );
                            setIsSubmitting(false);
                        }, 1500);
                    }
                }
            ]
        );
    };
    
    const handleBlock = () => {
        Alert.alert(
            'Block User?',
            'You won\'t see content from this user anymore. They won\'t be notified.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Block',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('User Blocked', 'You won\'t see their content anymore.');
                    }
                }
            ]
        );
    };
    
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Report Content</ThemedText>
                <View style={styles.headerSpacer} />
            </View>
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoSection}>
                    <Ionicons name="shield-checkmark" size={32} color="#3B82F6" />
                    <ThemedText style={styles.infoTitle}>Help Us Keep Rumoro Safe</ThemedText>
                    <ThemedText style={styles.infoText}>
                        We take reports seriously and review them within 24 hours. Your report is anonymous.
                    </ThemedText>
                </View>
                
                <View style={styles.reasonsSection}>
                    <ThemedText style={styles.sectionTitle}>Why are you reporting this?</ThemedText>
                    
                    {reportReasons.map((reason) => (
                        <TouchableOpacity
                            key={reason.id}
                            style={[
                                styles.reasonCard,
                                { backgroundColor: colors.card },
                                selectedReason === reason.id && styles.reasonCardSelected
                            ]}
                            onPress={() => setSelectedReason(reason.id)}
                        >
                            <View style={[
                                styles.reasonIcon,
                                { backgroundColor: getSeverityColor(reason.severity) + '20' }
                            ]}>
                                <Ionicons 
                                    name={reason.icon as any} 
                                    size={24} 
                                    color={getSeverityColor(reason.severity)} 
                                />
                            </View>
                            <View style={styles.reasonContent}>
                                <ThemedText style={styles.reasonTitle}>{reason.title}</ThemedText>
                                <ThemedText style={styles.reasonDescription}>{reason.description}</ThemedText>
                            </View>
                            {selectedReason === reason.id && (
                                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
                
                {selectedReason && (
                    <View style={styles.detailsSection}>
                        <ThemedText style={styles.sectionTitle}>Additional Details (Optional)</ThemedText>
                        <TextInput
                            style={[styles.detailsInput, { color: colors.text, borderColor: colors.border }]}
                            placeholder="Provide more context about this report..."
                            placeholderTextColor="#6B7280"
                            multiline
                            numberOfLines={4}
                            value={additionalDetails}
                            onChangeText={setAdditionalDetails}
                            maxLength={500}
                        />
                        <ThemedText style={styles.charCount}>{500 - additionalDetails.length} characters</ThemedText>
                    </View>
                )}
                
                <View style={styles.actionsSection}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !selectedReason && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!selectedReason || isSubmitting}
                    >
                        <Ionicons name="flag" size={20} color="#FFFFFF" />
                        <ThemedText style={styles.submitButtonText}>
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </ThemedText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.blockButton} onPress={handleBlock}>
                        <Ionicons name="person-remove" size={20} color="#EF4444" />
                        <ThemedText style={styles.blockButtonText}>Block User</ThemedText>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.policySection}>
                    <ThemedText style={styles.policyTitle}>Our Commitment</ThemedText>
                    <View style={styles.policyItem}>
                        <Ionicons name="checkmark" size={16} color="#10B981" />
                        <ThemedText style={styles.policyText}>
                            All reports are reviewed by our safety team
                        </ThemedText>
                    </View>
                    <View style={styles.policyItem}>
                        <Ionicons name="checkmark" size={16} color="#10B981" />
                        <ThemedText style={styles.policyText}>
                            Your identity remains anonymous
                        </ThemedText>
                    </View>
                    <View style={styles.policyItem}>
                        <Ionicons name="checkmark" size={16} color="#10B981" />
                        <ThemedText style={styles.policyText}>
                            False reports may result in account restrictions
                        </ThemedText>
                    </View>
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
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#EFF6FF',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
        color: '#1E40AF',
    },
    infoText: {
        fontSize: 14,
        color: '#3B82F6',
        textAlign: 'center',
        lineHeight: 20,
    },
    reasonsSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    reasonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    reasonCardSelected: {
        borderColor: '#10B981',
    },
    reasonIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    reasonContent: {
        flex: 1,
    },
    reasonTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    reasonDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    detailsSection: {
        padding: 20,
        paddingTop: 0,
    },
    detailsInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        lineHeight: 22,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'right',
    },
    actionsSection: {
        padding: 20,
        gap: 12,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4D6D',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#FFB3C1',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    blockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEE2E2',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    blockButtonText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
    policySection: {
        padding: 20,
        backgroundColor: '#F9FAFB',
    },
    policyTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        color: '#6B7280',
    },
    policyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    policyText: {
        fontSize: 13,
        color: '#6B7280',
        flex: 1,
    },
});