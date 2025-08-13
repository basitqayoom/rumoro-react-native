
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../ThemedText';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { colors } from '../constants';
import { onboardingStyles } from '../styles';
import { OtpVerificationProps } from '../types';

export const OtpVerificationScreen: React.FC<OtpVerificationProps & { otpInputs: React.MutableRefObject<TextInput[]> }> = ({
    onBack,
    otp,
    phoneNumber,
    selectedCountry,
    resendTimer,
    onOtpChange,
    onVerify,
    onResendOtp,
    loading,
    otpInputs,
}) => {
    return (
        <View style={onboardingStyles.stepContainer}>
            <TouchableOpacity
                style={onboardingStyles.backButton}
                onPress={() => onBack('phone-input')}
            >
                <Icon name="arrow-left" size={20} color={colors.primary[600]} />
                <ThemedText style={onboardingStyles.backText}>Back</ThemedText>
            </TouchableOpacity>

            <KeyboardAvoidingView
                style={onboardingStyles.inputScreenContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    contentContainerStyle={onboardingStyles.inputScrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={onboardingStyles.compactHeader}>
                        <ThemedText type="h2" style={onboardingStyles.compactTitle}>
                            Enter verification code
                        </ThemedText>
                        <ThemedText type="caption" style={onboardingStyles.compactSubtitle}>
                            Code sent to {selectedCountry.dialCode} {phoneNumber}
                        </ThemedText>
                    </View>

                    <View style={onboardingStyles.inputSection}>
                        <View style={onboardingStyles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => {
                                        if (ref) otpInputs.current[index] = ref;
                                    }}
                                    style={[
                                        onboardingStyles.otpInput,
                                        digit && onboardingStyles.otpInputFilled,
                                    ]}
                                    value={digit}
                                    onChangeText={(value) => onOtpChange(value, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    textAlign="center"
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={onResendOtp}
                            disabled={resendTimer > 0}
                            style={onboardingStyles.resendButton}
                        >
                            <Icon
                                name="refresh"
                                size={16}
                                color={resendTimer > 0 ? colors.neutral.ink600 : colors.primary[600]}
                                style={onboardingStyles.resendIcon}
                            />
                            <ThemedText style={[
                                onboardingStyles.resendText,
                                resendTimer > 0 && onboardingStyles.resendTextDisabled,
                            ]}>
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                            </ThemedText>
                        </TouchableOpacity>

                        <View style={onboardingStyles.helpText}>
                            <Icon name="info" size={14} color={colors.neutral.ink600} />
                            <ThemedText type="caption" style={onboardingStyles.helpTextContent}>
                                Didn&apos;t receive the code? Check your spam folder
                            </ThemedText>
                        </View>
                    </View>
                </ScrollView>

                <View style={onboardingStyles.buttonContainer}>
                    <Button
                        title="Verify & Continue"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        onPress={() => onVerify()}
                        disabled={otp.some(digit => !digit)}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};
