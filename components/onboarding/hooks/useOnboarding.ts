import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, TextInput } from "react-native";
import { DEFAULT_COUNTRY } from "../../ui/CountryCodePicker";
import {
  ANIMATION_DURATION,
  ONBOARDING_STEPS,
  OTP_LENGTH,
  RESEND_TIMER_DURATION,
} from "../constants";
import { OnboardingStep } from "../types";

const { width: screenWidth } = Dimensions.get("window");

export const useOnboarding = () => {
  // State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  // Refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const otpInputs = useRef<TextInput[]>([]);
  const phoneInputRef = useRef<TextInput>(null);

  // Resend OTP timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Navigation animation
  const navigateToStep = (step: OnboardingStep) => {
    const stepIndex = getStepIndex(step);
    Animated.timing(slideAnim, {
      toValue: -stepIndex * screenWidth,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    // Focus phone input when navigating to phone input screen
    if (step === "phone-input") {
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 350); // Small delay after animation
    }
  };

  const getStepIndex = (step: OnboardingStep): number => {
    return ONBOARDING_STEPS.indexOf(step);
  };

  // Handle phone number input
  const handlePhoneNumberChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    setPhoneNumber(numericValue);
  };

  // Check if phone number is valid (reaches max length)
  const isPhoneNumberValid = () => {
    return phoneNumber.length === selectedCountry.maxLength;
  };

  // Handle phone number submission
  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim() || !isPhoneNumberValid()) {
      Alert.alert(
        "Error",
        `Please enter a valid ${selectedCountry.maxLength}-digit phone number`
      );
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for sending OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to OTP screen
      navigateToStep("otp-verification");
      setResendTimer(RESEND_TIMER_DURATION);

      // Focus first OTP input
      setTimeout(() => {
        otpInputs.current[0]?.focus();
      }, ANIMATION_DURATION);
    } catch {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Auto-focus next input
    if (numericValue && index < 3) {
      otpInputs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 3 && numericValue && newOtp.every((digit) => digit !== "")) {
      handleOtpVerification(newOtp.join(""));
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (otpCode?: string) => {
    const finalOtp = otpCode || otp.join("");

    if (finalOtp.length !== OTP_LENGTH) {
      Alert.alert("Error", "Please enter the complete 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to Instagram linking screen on success
      navigateToStep("instagram-linking");
    } catch {
      Alert.alert("Error", "Invalid OTP. Please try again.");
      setOtp(["", "", "", ""]);
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert("Success", "Google Sign-In successful!", [
        { text: "OK", onPress: () => router.replace("/feed") },
      ]);
    } catch {
      Alert.alert("Error", "Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Instagram linking
  const handleInstagramLinking = async () => {
    setLoading(true);
    try {
      // Simulate Instagram linking
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Success", "Instagram linked successfully!", [
        { text: "OK", onPress: () => router.replace("/feed") },
      ]);
    } catch {
      Alert.alert("Error", "Failed to link Instagram. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle skip Instagram
  const handleSkipInstagram = () => {
    router.replace("/feed");
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResendTimer(RESEND_TIMER_DURATION);
      Alert.alert("Success", "OTP sent successfully!");
    } catch {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
