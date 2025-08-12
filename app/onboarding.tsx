import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { Button } from '../components/ui/Button';
import { CountryCodePicker, DEFAULT_COUNTRY } from '../components/ui/CountryCodePicker';
import { Icon } from '../components/ui/Icon';
import Logo from '../components/ui/Logo';

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

type OnboardingStep = 'auth-selection' | 'phone-input' | 'otp-verification';

export default function OnboardingScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('auth-selection');

    const slideAnim = useRef(new Animated.Value(0)).current;
    const otpInputs = useRef<TextInput[]>([]);
    const insets = useSafeAreaInsets();

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
        setCurrentStep(step);
    };

    const getStepIndex = (step: OnboardingStep): number => {
        const steps: OnboardingStep[] = ['auth-selection', 'phone-input', 'otp-verification'];
        return steps.indexOf(step);
    };

    // Handle phone number submission
    const handlePhoneSubmit = async () => {
        if (!phoneNumber.trim()) {
            Alert.alert('Error', 'Please enter a valid phone number');
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
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (index === 5 && value && newOtp.every(digit => digit !== '')) {
            handleOtpVerification(newOtp.join(''));
        }
    };

    // Handle OTP verification
    const handleOtpVerification = async (otpCode?: string) => {
        const finalOtp = otpCode || otp.join('');

        if (finalOtp.length !== 6) {
            Alert.alert('Error', 'Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            // Simulate API call for OTP verification
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Navigate to feed on success
            router.replace('/feed');
        } catch {
            Alert.alert('Error', 'Invalid OTP. Please try again.');
            setOtp(['', '', '', '', '', '']);
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

            <View style={styles.header}>
                <View style={styles.stepIcon}>
                    <Icon name="phone" size={28} color={colors.primary[500]} />
                </View>
                <ThemedText type="h2" style={styles.title}>
                    Enter your phone number
                </ThemedText>
                <ThemedText type="body" style={styles.subtitle}>
                    We&apos;ll send you a verification code to confirm your identity
                </ThemedText>
            </View>

            <View style={styles.inputSection}>
                <View style={styles.phoneInputContainer}>
                    <CountryCodePicker
                        selectedCountry={selectedCountry}
                        onSelectCountry={setSelectedCountry}
                    />
                    <TextInput
                        style={styles.phoneInput}
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        maxLength={selectedCountry.maxLength}
                        autoFocus
                    />
                </View>

                <View style={styles.helpText}>
                    <Icon name="info" size={14} color={colors.neutral.ink600} />
                    <ThemedText type="caption" style={styles.helpTextContent}>
                        Standard messaging rates may apply
                    </ThemedText>
                </View>
            </View>

            <Button
                title="Send Verification Code"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handlePhoneSubmit}
                disabled={!phoneNumber.trim()}
                style={styles.submitButton}
            />
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

            <View style={styles.header}>
                <View style={styles.stepIcon}>
                    <Icon name="lock" size={28} color={colors.primary[500]} />
                </View>
                <ThemedText type="h2" style={styles.title}>
                    Enter verification code
                </ThemedText>
                <ThemedText type="body" style={styles.subtitle}>
                    We sent a 6-digit code to {selectedCountry.dialCode} {phoneNumber}
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

            <Button
                title="Verify & Continue"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={() => handleOtpVerification()}
                disabled={otp.some(digit => !digit)}
                style={styles.submitButton}
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface0} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
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
                </Animated.View>
            </KeyboardAvoidingView>
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
        width: screenWidth * 3, // Total width for 3 screens
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
        paddingTop: 40,
        paddingBottom: 32,
    },
    logoContainer: {
        marginBottom: 24,
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
    subtitle: {
        fontSize: 16,
        color: colors.neutral.ink600,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 16,
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
        padding: 12,
        marginTop: 8,
        marginBottom: 8,
    },
    backText: {
        fontSize: 16,
        color: colors.primary[600],
        fontWeight: '500',
        marginLeft: 8,
    },
    inputSection: {
        paddingVertical: 24,
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
        justifyContent: 'space-between',
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
});
