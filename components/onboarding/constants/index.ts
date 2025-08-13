import { OnboardingStep } from "../types";

// Design tokens from copilot/design_tokens.json
export const colors = {
  primary: {
    50: "#FFF0F3",
    100: "#FFE3E8",
    500: "#FF4D6D",
    600: "#E03A58",
    700: "#C12A49",
  },
  neutral: {
    surface0: "#FFFFFF",
    ink900: "#111114",
    ink600: "#6B7280",
    ink300: "#D1D5DB",
    ink100: "#F3F4F6",
  },
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  "auth-selection",
  "phone-input",
  "otp-verification",
  "instagram-linking",
];

export const ANIMATION_DURATION = 300;
export const OTP_LENGTH = 4;
export const RESEND_TIMER_DURATION = 60;
