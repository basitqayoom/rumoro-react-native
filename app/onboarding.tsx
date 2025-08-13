import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { Button } from '../components/ui/Button';
import { CountryCodePicker, DEFAULT_COUNTRY } from '../components/ui/CountryCodePicker';
import { Icon } from '../components/ui/Icon';
import { InstagramIcon } from '../components/ui/InstagramIcon';
import { Logo } from '../components/ui/Logo';

const { width: screenWidth } = Dimensions.get('window');

// Design tokens from copilot/design_tokens.json
const colors = {
    primary: {
        50: '#FFF0F3',
        100: '#FFE3E8',
        500: '#FF4D6D',
        600: '#E03A58',
        700: '#C12A49',
    },
    neutral: {
        surface0: '#FFFFFF',
        ink900: '#111114',
        ink600: '#6B7280',
        ink300: '#D1D5DB',
        ink100: '#F3F4F6',
    },
};

type OnboardingStep = 'auth-selection' | 'phone-input' | 'otp-verification' | 'instagram-linking';

export default function OnboardingScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);
    const [loading, setLoading] = useState(false);

    const slideAnim = useRef(new Animated.Value(0)).current;
    const otpInputs = useRef<TextInput[]>([]);
    const phoneInputRef = useRef<TextInput>(null);

    // Resend OTP timer effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // Navigation animation
    const navigateToStep = (step: OnboardingStep) => {
        const stepIndex = getStepIndex(step);
        Animated.timing(slideAnim, {
            toValue: -stepIndex * screenWidth,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Focus phone input when navigating to phone input screen
        if (step === 'phone-input') {
            setTimeout(() => {
                phoneInputRef.current?.focus();
            }, 350); // Small delay after animation
        }
    };

    const getStepIndex = (step: OnboardingStep): number => {
        const steps: OnboardingStep[] = ['auth-selection', 'phone-input', 'otp-verification', 'instagram-linking'];
        return steps.indexOf(step);
    };

    // Handle phone number input
    const handlePhoneNumberChange = (value: string) => {
        // Only allow numbers
        const numericValue = value.replace(/[^0-9]/g, '');
        setPhoneNumber(numericValue);
    };

    // Check if phone number is valid (reaches max length)
    const isPhoneNumberValid = () => {
        return phoneNumber.length === selectedCountry.maxLength;
    };

    // Handle phone number submission
    const handlePhoneSubmit = async () => {
        if (!phoneNumber.trim() || !isPhoneNumberValid()) {
            Alert.alert('Error', `Please enter a valid ${selectedCountry.maxLength}-digit phone number`);
            return;
        }

        setLoading(true);
        try {
            // Simulate API call for sending OTP
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Navigate to OTP screen
            navigateToStep('otp-verification');
            setResendTimer(60);

            // Focus first OTP input
            setTimeout(() => {
                otpInputs.current[0]?.focus();
            }, 300);
        } catch {
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP input
    const handleOtpChange = (value: string, index: number) => {
        // Only allow numbers
        const numericValue = value.replace(/[^0-9]/g, '');

        const newOtp = [...otp];
        newOtp[index] = numericValue;
        setOtp(newOtp);

        // Auto-focus next input
        if (numericValue && index < 3) {
            otpInputs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (index === 3 && numericValue && newOtp.every(digit => digit !== '')) {
            handleOtpVerification(newOtp.join(''));
        }
    };

    // Handle OTP verification
    const handleOtpVerification = async (otpCode?: string) => {
        const finalOtp = otpCode || otp.join('');

        if (finalOtp.length !== 4) {
            Alert.alert('Error', 'Please enter the complete 4-digit OTP');
            return;
        }

        setLoading(true);
        try {
            // Simulate API call for OTP verification
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Navigate to Instagram linking screen on success
            navigateToStep('instagram-linking');
        } catch {
            Alert.alert('Error', 'Invalid OTP. Please try again.');
            setOtp(['', '', '', '']);
            otpInputs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Sign-In
    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            // Simulate Google Sign-In
            await new Promise(resolve => setTimeout(resolve, 2000));
            Alert.alert('Success', 'Google Sign-In successful!', [
                { text: 'OK', onPress: () => router.replace('/feed') }
            ]);
        } catch {
            Alert.alert('Error', 'Google Sign-In failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Instagram linking
    const handleInstagramLinking = async () => {
        setLoading(true);
        try {
            // Simulate Instagram linking
            await new Promise(resolve => setTimeout(resolve, 1500));
            Alert.alert('Success', 'Instagram linked successfully!', [
                { text: 'OK', onPress: () => router.replace('/feed') }
            ]);
        } catch {
            Alert.alert('Error', 'Failed to link Instagram. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle skip Instagram
    const handleSkipInstagram = () => {
        router.replace('/feed');
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setResendTimer(60);
            Alert.alert('Success', 'OTP sent successfully!');
        } catch {
            Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Instagram Linking Screen
    const renderInstagramLinking = () => (
        <View style={styles.stepContainer}>
            <View style={styles.compactHeader}>
                <ThemedText type="h2" style={styles.compactTitle}>
                    Let Others Find You
                </ThemedText>
                <ThemedText type="body" style={styles.compactSubtitle}>
                    Connect your Instagram so people can find your profile and gossip about you anonymously
                </ThemedText>
            </View>

            <ScrollView
                contentContainerStyle={styles.instagramScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.instagramScrollView}
            >
                <View style={styles.instagramMainContent}>
                    <View style={styles.instagramHeroSection}>
                        <View style={styles.instagramIconContainer}>
                            <InstagramIcon size={48} color="#E4405F" />
                        </View>

                        <ThemedText type="h3" style={styles.instagramMainHeading}>
                            Be Part of the Conversation
                        </ThemedText>
                        <ThemedText type="body" style={styles.instagramMainDescription}>
                            Link your Instagram so others can find you by your handle and share anonymous gossip about you.
                        </ThemedText>
                    </View>

                    <View style={styles.anonymityHighlight}>
                        <View style={styles.anonymityHeader}>
                            <Icon name="eye-off" size={20} color={colors.primary[600]} style={styles.anonymityIcon} />
                            <ThemedText style={styles.anonymityTitle}>Stay Anonymous</ThemedText>
                        </View>
                        <ThemedText style={styles.anonymityText}>
                            You will still be <ThemedText style={styles.anonymityEmphasis}>completely anonymous</ThemedText> while posting gossip about others
                        </ThemedText>
                    </View>

                    <View style={styles.benefitsSection}>
                        <View style={styles.benefitRow}>
                            <View style={styles.benefitIconBg}>
                                <Icon name="users" size={16} color={colors.primary[600]} />
                            </View>
                            <View style={styles.benefitContent}>
                                <ThemedText type="caption" style={styles.benefitTitle}>Discoverable</ThemedText>
                                <ThemedText type="caption" style={styles.benefitDescription}>
                                    People can find you by your Instagram handle
                                </ThemedText>
                            </View>
                        </View>

                        <View style={styles.benefitRow}>
                            <View style={styles.benefitIconBg}>
                                <Icon name="message-circle" size={16} color={colors.primary[600]} />
                            </View>
                            <View style={styles.benefitContent}>
                                <ThemedText type="caption" style={styles.benefitTitle}>Anonymous Gossip</ThemedText>
                                <ThemedText type="caption" style={styles.benefitDescription}>
                                    Receive anonymous posts about yourself
                                </ThemedText>
                            </View>
                        </View>

                        <View style={[styles.benefitRow, styles.benefitRowLast]}>
                            <View style={styles.benefitIconBg}>
                                <Icon name="shield" size={16} color={colors.primary[600]} />
                            </View>
                            <View style={styles.benefitContent}>
                                <ThemedText type="caption" style={styles.benefitTitle}>Privacy Protected</ThemedText>
                                <ThemedText type="caption" style={styles.benefitDescription}>
                                    Your Instagram info stays completely private
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    <View style={styles.proTipSection}>
                        <View style={styles.proTipContainer}>
                            <Icon name="lightbulb" size={18} color={colors.primary[600]} style={styles.proTipBulb} />
                            <View style={styles.proTipTextContainer}>
                                <ThemedText style={styles.proTipLabel}>Pro tip</ThemedText>
                                <ThemedText style={styles.proTipMessage}>
                                    The more discoverable you are, the more interesting gossip you&apos;ll get!
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <Button
                    title="Connect Instagram"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onPress={handleInstagramLinking}
                    iconName="instagram"
                    iconColor="#FFFFFF"
                    style={styles.instagramConnectButton}
                />
                <TouchableOpacity onPress={handleSkipInstagram} style={styles.skipButton}>
                    <ThemedText type="body" style={styles.skipText}>
                        I&apos;ll Do This Later
                    </ThemedText>
                    <Icon name="arrow-right" size={16} color={colors.neutral.ink600} style={styles.skipArrow} />
                </TouchableOpacity>
            </View>
        </View>
    );



    // Auth Selection Screen
    const renderAuthSelection = () => (
        <View style={styles.stepContainer}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Logo size="large" variant="brand" />
                </View>
                <ThemedText type="h1" style={styles.title}>
                    Welcome to Rumoro
                </ThemedText>
                <ThemedText type="body" style={styles.subtitle}>
                    Choose how you&apos;d like to get started
                </ThemedText>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Continue with Phone"
                    variant="primary"
                    size="lg"
                    fullWidth
                    iconName="phone"
                    iconColor="#FFFFFF"
                    onPress={() => navigateToStep('phone-input')}
                    style={styles.authButton}
                />

                <Button
                    title="Continue with Google"
                    variant="outline"
                    size="lg"
                    fullWidth
                    iconName="google"
                    loading={loading}
                    onPress={handleGoogleSignIn}
                    style={styles.authButton}
                />
            </View>

            <View style={styles.footer}>
                <View style={styles.securityBadge}>
                    <Icon name="shield" size={16} color={colors.primary[600]} />
                    <ThemedText type="caption" style={styles.securityText}>
                        Secure & Private
                    </ThemedText>
                </View>
                <ThemedText type="caption" style={styles.termsText}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </ThemedText>
            </View>
        </View>
    );

    // Phone Input Screen
    const renderPhoneInput = () => (
        <View style={styles.stepContainer}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigateToStep('auth-selection')}
            >
                <Icon name="arrow-left" size={20} color={colors.primary[600]} />
                <ThemedText style={styles.backText}>Back</ThemedText>
            </TouchableOpacity>

            <KeyboardAvoidingView
                style={styles.inputScreenContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.inputScrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.compactHeader}>
                        <ThemedText type="h2" style={styles.compactTitle}>
                            Enter your phone number
                        </ThemedText>
                    </View>

                    <View style={styles.inputSection}>
                        <View style={styles.phoneInputContainer}>
                            <CountryCodePicker
                                selectedCountry={selectedCountry}
                                onSelectCountry={setSelectedCountry}
                            />
                            <TextInput
                                ref={phoneInputRef}
                                style={styles.phoneInput}
                                placeholder="Phone number"
                                value={phoneNumber}
                                onChangeText={handlePhoneNumberChange}
                                keyboardType="phone-pad"
                                maxLength={selectedCountry.maxLength}
                            />
                        </View>

                        <View style={styles.helpText}>
                            <Icon name="info" size={14} color={colors.neutral.ink600} />
                            <ThemedText type="caption" style={styles.helpTextContent}>
                                Standard messaging rates may apply
                            </ThemedText>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Send Verification Code"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        onPress={handlePhoneSubmit}
                        disabled={!phoneNumber.trim() || !isPhoneNumberValid()}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );

    // OTP Verification Screen
    const renderOtpVerification = () => (
        <View style={styles.stepContainer}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigateToStep('phone-input')}
            >
                <Icon name="arrow-left" size={20} color={colors.primary[600]} />
                <ThemedText style={styles.backText}>Back</ThemedText>
            </TouchableOpacity>

            <KeyboardAvoidingView
                style={styles.inputScreenContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.inputScrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.compactHeader}>
                        <ThemedText type="h2" style={styles.compactTitle}>
                            Enter verification code
                        </ThemedText>
                        <ThemedText type="caption" style={styles.compactSubtitle}>
                            Code sent to {selectedCountry.dialCode} {phoneNumber}
                        </ThemedText>
                    </View>

                    <View style={styles.inputSection}>
                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => {
                                        if (ref) otpInputs.current[index] = ref;
                                    }}
                                    style={[
                                        styles.otpInput,
                                        digit && styles.otpInputFilled,
                                    ]}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    textAlign="center"
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={handleResendOtp}
                            disabled={resendTimer > 0}
                            style={styles.resendButton}
                        >
                            <Icon
                                name="refresh"
                                size={16}
                                color={resendTimer > 0 ? colors.neutral.ink600 : colors.primary[600]}
                                style={styles.resendIcon}
                            />
                            <ThemedText style={[
                                styles.resendText,
                                resendTimer > 0 && styles.resendTextDisabled,
                            ]}>
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                            </ThemedText>
                        </TouchableOpacity>

                        <View style={styles.helpText}>
                            <Icon name="info" size={14} color={colors.neutral.ink600} />
                            <ThemedText type="caption" style={styles.helpTextContent}>
                                Didn&apos;t receive the code? Check your spam folder
                            </ThemedText>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Verify & Continue"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        onPress={() => handleOtpVerification()}
                        disabled={otp.some(digit => !digit)}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { paddingTop: 0 }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface0} />

            <Animated.View
                style={[
                    styles.stepsWrapper,
                    {
                        transform: [{ translateX: slideAnim }],
                    },
                ]}
            >
                <View style={styles.step}>
                    {renderAuthSelection()}
                </View>
                <View style={styles.step}>
                    {renderPhoneInput()}
                </View>
                <View style={styles.step}>
                    {renderOtpVerification()}
                </View>
                <View style={styles.step}>
                    {renderInstagramLinking()}
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface0,
        overflow: 'hidden', // Hide off-screen content
    },
    stepsWrapper: {
        flex: 1,
        flexDirection: 'row',
        width: screenWidth * 4, // Total width for 4 screens
    },
    step: {
        width: screenWidth, // Each step takes full screen width
        flex: 1,
    },
    stepContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 16,
    },
    compactHeader: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 16,
    },
    logoContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    stepIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary[700],
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 34,
    },
    compactTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary[700],
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 28,
    },
    subtitle: {
        fontSize: 16,
        color: colors.neutral.ink600,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 16,
    },
    compactSubtitle: {
        fontSize: 14,
        color: colors.neutral.ink600,
        textAlign: 'center',
        lineHeight: 20,
    },
    buttonContainer: {
        gap: 16,
        paddingVertical: 32,
    },
    authButton: {
        marginBottom: 0,
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    securityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary[50],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 16,
    },
    securityText: {
        fontSize: 12,
        color: colors.primary[600],
        fontWeight: '500',
        marginLeft: 6,
    },
    termsText: {
        fontSize: 12,
        color: colors.neutral.ink600,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 32,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        padding: 8,
        marginTop: 0,
        marginBottom: 8,
        marginLeft: -8, // Align with screen edge accounting for padding
    },
    backText: {
        fontSize: 16,
        color: colors.primary[600],
        fontWeight: '500',
        marginLeft: 8,
    },
    inputSection: {
        paddingVertical: 16,
        minHeight: 150, // Reduced height for better positioning
    },
    phoneInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.neutral.ink300,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: colors.neutral.ink900,
    },
    helpText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    helpTextContent: {
        fontSize: 12,
        color: colors.neutral.ink600,
        marginLeft: 6,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    otpInput: {
        width: 48,
        height: 56,
        borderWidth: 2,
        borderColor: colors.neutral.ink300,
        borderRadius: 12,
        fontSize: 24,
        fontWeight: '600',
        color: colors.neutral.ink900,
        backgroundColor: colors.neutral.surface0,
    },
    otpInputFilled: {
        borderColor: colors.primary[500],
        backgroundColor: colors.primary[50],
    },
    resendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginBottom: 16,
    },
    resendIcon: {
        marginRight: 8,
    },
    resendText: {
        fontSize: 16,
        color: colors.primary[600],
        fontWeight: '500',
    },
    resendTextDisabled: {
        color: colors.neutral.ink600,
    },
    submitButton: {
        marginBottom: 40,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start', // Changed from space-between to flex-start
        paddingBottom: 20,
    },
    inputScreenContainer: {
        flex: 1,
    },
    inputScrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingBottom: Platform.OS === 'android' ? 300 : 20, // Extra padding for Android keyboard
    },
    bottomButtonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        backgroundColor: colors.neutral.surface0,
    },
    instagramContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    instagramContent: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    instagramHeading: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.neutral.ink900,
        marginBottom: 12,
        textAlign: 'center',
    },
    instagramDescription: {
        textAlign: 'center',
        color: colors.neutral.ink600,
        lineHeight: 22,
        marginBottom: 24,
    },
    benefitsList: {
        width: '100%',
        gap: 12,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    benefitDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary[500],
        marginRight: 12,
    },
    benefitText: {
        flex: 1,
        color: colors.neutral.ink600,
        fontSize: 14,
        lineHeight: 20,
    },
    instagramButton: {
        marginBottom: 16,
        backgroundColor: colors.primary[500],
    },
    instagramConnectButton: {
        backgroundColor: colors.primary[500],
        borderRadius: 12,
        marginBottom: 12,
    },
    instagramVisualSection: {
        alignItems: 'center',
        width: '100%',
    },
    instagramIconWrapper: {
        alignItems: 'center',
        marginBottom: 28,
        padding: 20,
        borderRadius: 50,
        backgroundColor: colors.primary[50],
    },
    instagramContentCard: {
        backgroundColor: colors.neutral.surface0,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    benefitIconBg: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    proTipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.primary[50],
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary[500],
    },
    proTipIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    proTipText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        color: colors.neutral.ink600,
    },
    proTipLabel: {
        fontWeight: '600',
        color: colors.primary[600],
    },
    skipContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    skipText: {
        color: colors.neutral.ink600,
        fontSize: 16,
        fontWeight: '500',
    },
    skipArrow: {
        marginLeft: 8,
    },
    primaryButton: {
        marginBottom: 12,
    },
    skipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: 8,
    },
    // New Instagram screen styles
    instagramScrollContent: {
        paddingHorizontal: 0,
        paddingBottom: 40,
        flexGrow: 1,
    },
    instagramScrollView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    instagramMainContent: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    instagramHeroSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    instagramIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    instagramMainHeading: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.neutral.ink900,
        textAlign: 'center',
        marginBottom: 12,
    },
    instagramMainDescription: {
        fontSize: 16,
        color: colors.neutral.ink600,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 12,
    },
    benefitsSection: {
        backgroundColor: colors.neutral.surface0,
        borderRadius: 16,
        padding: 24,
        marginVertical: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    benefitRowLast: {
        marginBottom: 0,
    },
    benefitContent: {
        flex: 1,
        marginLeft: 12,
    },
    benefitTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.neutral.ink900,
        marginBottom: 4,
    },
    benefitDescription: {
        fontSize: 13,
        color: colors.neutral.ink600,
        lineHeight: 18,
    },
    proTipSection: {
        marginBottom: 8,
    },
    proTipContainer: {
        flexDirection: 'row',
        backgroundColor: colors.primary[50],
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary[500],
    },
    proTipBulb: {
        marginRight: 12,
        marginTop: 1,
    },
    proTipTextContainer: {
        flex: 1,
    },
    proTipMessage: {
        fontSize: 13,
        color: colors.neutral.ink600,
        lineHeight: 18,
        marginTop: 2,
    },
    // Anonymity highlight styles
    anonymityHighlight: {
        backgroundColor: colors.primary[100],
        borderRadius: 12,
        padding: 16,
        marginVertical: 20,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary[600],
    },
    anonymityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    anonymityIcon: {
        marginRight: 8,
    },
    anonymityTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary[700],
    },
    anonymityText: {
        fontSize: 14,
        color: colors.neutral.ink600,
        lineHeight: 20,
    },
    anonymityEmphasis: {
        fontWeight: '600',
        color: colors.primary[600],
    },
});
