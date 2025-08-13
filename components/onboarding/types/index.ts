export type OnboardingStep =
  | "auth-selection"
  | "phone-input"
  | "otp-verification"
  | "instagram-linking";

export interface OnboardingState {
  phoneNumber: string;
  selectedCountry: any; // This will be the Country type from CountryCodePicker
  otp: string[];
  resendTimer: number;
  loading: boolean;
}

export interface OnboardingStepProps {
  onNext: (step: OnboardingStep) => void;
  onBack: (step: OnboardingStep) => void;
  loading: boolean;
}

export interface AuthSelectionProps extends OnboardingStepProps {
  onGoogleSignIn: () => Promise<void>;
}

export interface PhoneInputProps extends OnboardingStepProps {
  phoneNumber: string;
  selectedCountry: any;
  onPhoneNumberChange: (value: string) => void;
  onCountryChange: (country: any) => void;
  onSubmit: () => Promise<void>;
  isValid: boolean;
}

export interface OtpVerificationProps extends OnboardingStepProps {
  otp: string[];
  phoneNumber: string;
  selectedCountry: any;
  resendTimer: number;
  onOtpChange: (value: string, index: number) => void;
  onVerify: (otpCode?: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
}

export interface InstagramLinkingProps extends OnboardingStepProps {
  onLinkInstagram: () => Promise<void>;
  onSkip: () => void;
}
