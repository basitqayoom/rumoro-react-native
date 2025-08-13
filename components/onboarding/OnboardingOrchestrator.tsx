
import React from 'react';
import { Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './constants';
import { useOnboarding } from './hooks/useOnboarding';
import {
    AuthSelectionScreen,
    InstagramLinkingScreen,
    OtpVerificationScreen,
    PhoneInputScreen
} from './screens';
import { onboardingStyles } from './styles';

export const OnboardingOrchestrator: React.FC = () => {
    const {
        // State
        phoneNumber,
        selectedCountry,
        otp,
        resendTimer,
        loading,

        // Refs
        slideAnim,
        otpInputs,
        phoneInputRef,

        // Actions
        setSelectedCountry,
        navigateToStep,
        handlePhoneNumberChange,
        isPhoneNumberValid,
        handlePhoneSubmit,
        handleOtpChange,
        handleOtpVerification,
        handleGoogleSignIn,
        handleInstagramLinking,
        handleSkipInstagram,
        handleResendOtp,
    } = useOnboarding();

    return (
        <SafeAreaView style={[onboardingStyles.container, { paddingTop: 0 }]}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface0} />

            <Animated.View
                style={[
                    onboardingStyles.stepsWrapper,
                    {
                        transform: [{ translateX: slideAnim }],
                    },
                ]}
            >
                <Animated.View style={onboardingStyles.step}>
                    <AuthSelectionScreen
                        onNext={navigateToStep}
                        onBack={navigateToStep}
                        onGoogleSignIn={handleGoogleSignIn}
                        loading={loading}
                    />
                </Animated.View>

                <Animated.View style={onboardingStyles.step}>
                    <PhoneInputScreen
                        onNext={navigateToStep}
                        onBack={navigateToStep}
                        phoneNumber={phoneNumber}
                        selectedCountry={selectedCountry}
                        onPhoneNumberChange={handlePhoneNumberChange}
                        onCountryChange={setSelectedCountry}
                        onSubmit={handlePhoneSubmit}
                        isValid={isPhoneNumberValid()}
                        loading={loading}
                        phoneInputRef={phoneInputRef}
                    />
                </Animated.View>

                <Animated.View style={onboardingStyles.step}>
                    <OtpVerificationScreen
                        onNext={navigateToStep}
                        onBack={navigateToStep}
                        otp={otp}
                        phoneNumber={phoneNumber}
                        selectedCountry={selectedCountry}
                        resendTimer={resendTimer}
                        onOtpChange={handleOtpChange}
                        onVerify={handleOtpVerification}
                        onResendOtp={handleResendOtp}
                        loading={loading}
                        otpInputs={otpInputs}
                    />
                </Animated.View>

                <Animated.View style={onboardingStyles.step}>
                    <InstagramLinkingScreen
                        onNext={navigateToStep}
                        onBack={navigateToStep}
                        onLinkInstagram={handleInstagramLinking}
                        onSkip={handleSkipInstagram}
                        loading={loading}
                    />
                </Animated.View>
            </Animated.View>
        </SafeAreaView>
    );
};
