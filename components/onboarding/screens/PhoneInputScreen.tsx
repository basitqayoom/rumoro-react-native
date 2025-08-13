
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../ThemedText';
import { Button } from '../../ui/Button';
import { CountryCodePicker } from '../../ui/CountryCodePicker';
import { Icon } from '../../ui/Icon';
import { colors } from '../constants';
import { onboardingStyles } from '../styles';
import { PhoneInputProps } from '../types';

export const PhoneInputScreen: React.FC<PhoneInputProps & { phoneInputRef: React.RefObject<TextInput | null> }> = ({
    onBack,
    phoneNumber,
    selectedCountry,
    onPhoneNumberChange,
    onCountryChange,
    onSubmit,
    isValid,
    loading,
    phoneInputRef,
}) => {
    return (
        <View style={onboardingStyles.stepContainer}>
            <TouchableOpacity
                style={onboardingStyles.backButton}
                onPress={() => onBack('auth-selection')}
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
                            Enter your phone number
                        </ThemedText>
                    </View>

                    <View style={onboardingStyles.inputSection}>
                        <View style={onboardingStyles.phoneInputContainer}>
                            <CountryCodePicker
                                selectedCountry={selectedCountry}
                                onSelectCountry={onCountryChange}
                            />
                            <TextInput
                                ref={phoneInputRef}
                                style={onboardingStyles.phoneInput}
                                placeholder="Phone number"
                                value={phoneNumber}
                                onChangeText={onPhoneNumberChange}
                                keyboardType="phone-pad"
                                maxLength={selectedCountry.maxLength}
                            />
                        </View>

                        <View style={onboardingStyles.helpText}>
                            <Icon name="info" size={14} color={colors.neutral.ink600} />
                            <ThemedText type="caption" style={onboardingStyles.helpTextContent}>
                                Standard messaging rates may apply
                            </ThemedText>
                        </View>
                    </View>
                </ScrollView>

                <View style={onboardingStyles.buttonContainer}>
                    <Button
                        title="Send Verification Code"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        onPress={onSubmit}
                        disabled={!phoneNumber.trim() || !isValid}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};
