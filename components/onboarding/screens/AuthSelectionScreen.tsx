
import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '../../ThemedText';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { Logo } from '../../ui/Logo';
import { colors } from '../constants';
import { onboardingStyles } from '../styles';
import { AuthSelectionProps } from '../types';

export const AuthSelectionScreen: React.FC<AuthSelectionProps> = ({
    onNext,
    onGoogleSignIn,
    loading,
}) => {
    return (
        <View style={onboardingStyles.stepContainer}>
            <View style={onboardingStyles.header}>
                <View style={onboardingStyles.logoContainer}>
                    <Logo size="large" variant="brand" />
                </View>
                <ThemedText type="h1" style={onboardingStyles.title}>
                    Welcome to Rumoro
                </ThemedText>
                <ThemedText type="body" style={onboardingStyles.subtitle}>
                    Choose how you&apos;d like to get started
                </ThemedText>
            </View>

            <View style={onboardingStyles.buttonContainer}>
                <Button
                    title="Continue with Phone"
                    variant="primary"
                    size="lg"
                    fullWidth
                    iconName="phone"
                    iconColor="#FFFFFF"
                    onPress={() => onNext('phone-input')}
                    style={onboardingStyles.authButton}
                />

                <Button
                    title="Continue with Google"
                    variant="outline"
                    size="lg"
                    fullWidth
                    iconName="google"
                    loading={loading}
                    onPress={onGoogleSignIn}
                    style={onboardingStyles.authButton}
                />
            </View>

            <View style={onboardingStyles.footer}>
                <View style={onboardingStyles.securityBadge}>
                    <Icon name="shield" size={16} color={colors.primary[600]} />
                    <ThemedText type="caption" style={onboardingStyles.securityText}>
                        Secure & Private
                    </ThemedText>
                </View>
                <ThemedText type="caption" style={onboardingStyles.termsText}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </ThemedText>
            </View>
        </View>
    );
};
