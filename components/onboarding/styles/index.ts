import { Dimensions, Platform, StyleSheet } from "react-native";
import { colors } from "../constants";

const { width: screenWidth } = Dimensions.get("window");

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.surface0,
    overflow: "hidden", // Hide off-screen content
  },
  stepsWrapper: {
    flex: 1,
    flexDirection: "row",
    width: screenWidth * 4, // Total width for 4 screens
  },
  step: {
    width: screenWidth, // Each step takes full screen width
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
  },
  compactHeader: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  stepIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary[700],
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 34,
  },
  compactTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary[700],
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral.ink600,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  compactSubtitle: {
    fontSize: 14,
    color: colors.neutral.ink600,
    textAlign: "center",
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
    alignItems: "center",
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  securityText: {
    fontSize: 12,
    color: colors.primary[600],
    fontWeight: "500",
    marginLeft: 6,
  },
  termsText: {
    fontSize: 12,
    color: colors.neutral.ink600,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 32,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 8,
    marginTop: 0,
    marginBottom: 8,
    marginLeft: -8, // Align with screen edge accounting for padding
  },
  backText: {
    fontSize: 16,
    color: colors.primary[600],
    fontWeight: "500",
    marginLeft: 8,
  },
  inputSection: {
    paddingVertical: 16,
    minHeight: 150, // Reduced height for better positioning
  },
  phoneInputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.neutral.ink300,
    borderRadius: 12,
    overflow: "hidden",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  helpTextContent: {
    fontSize: 12,
    color: colors.neutral.ink600,
    marginLeft: 6,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
    fontWeight: "600",
    color: colors.neutral.ink900,
    backgroundColor: colors.neutral.surface0,
  },
  otpInputFilled: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginBottom: 16,
  },
  resendIcon: {
    marginRight: 8,
  },
  resendText: {
    fontSize: 16,
    color: colors.primary[600],
    fontWeight: "500",
  },
  resendTextDisabled: {
    color: colors.neutral.ink600,
  },
  submitButton: {
    marginBottom: 40,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start", // Changed from space-between to flex-start
    paddingBottom: 20,
  },
  inputScreenContainer: {
    flex: 1,
  },
  inputScrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: Platform.OS === "android" ? 300 : 20, // Extra padding for Android keyboard
  },
  bottomButtonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: colors.neutral.surface0,
  },
  instagramContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  instagramContent: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  instagramHeading: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.neutral.ink900,
    marginBottom: 12,
    textAlign: "center",
  },
  instagramDescription: {
    textAlign: "center",
    color: colors.neutral.ink600,
    lineHeight: 22,
    marginBottom: 24,
  },
  benefitsList: {
    width: "100%",
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
    width: "100%",
  },
  instagramIconWrapper: {
    alignItems: "center",
    marginBottom: 28,
    padding: 20,
    borderRadius: 50,
    backgroundColor: colors.primary[50],
  },
  instagramContentCard: {
    backgroundColor: colors.neutral.surface0,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
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
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  proTipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    fontWeight: "600",
    color: colors.primary[600],
  },
  skipContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  skipText: {
    color: colors.neutral.ink600,
    fontSize: 16,
    fontWeight: "500",
  },
  skipArrow: {
    marginLeft: 8,
  },
  primaryButton: {
    marginBottom: 12,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "flex-start",
  },
  instagramHeroSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  instagramIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  instagramMainHeading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.neutral.ink900,
    textAlign: "center",
    marginBottom: 12,
  },
  instagramMainDescription: {
    fontSize: 16,
    color: colors.neutral.ink600,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  benefitsSection: {
    backgroundColor: colors.neutral.surface0,
    borderRadius: 16,
    padding: 24,
    marginVertical: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    fontWeight: "600",
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
    flexDirection: "row",
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  anonymityIcon: {
    marginRight: 8,
  },
  anonymityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary[700],
  },
  anonymityText: {
    fontSize: 14,
    color: colors.neutral.ink600,
    lineHeight: 20,
  },
  anonymityEmphasis: {
    fontWeight: "600",
    color: colors.primary[600],
  },
});
