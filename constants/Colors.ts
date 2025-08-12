/*
 * Rumoro Design System Colors
 * Based on the design tokens and dating app aesthetic
 */

export const Colors = {
  light: {
    // Primary brand colors (rose/coral)
    primary: {
      50: "#FFF0F3",
      100: "#FFE3E8",
      400: "#FF6B86",
      500: "#FF4D6D", // Main brand color
      600: "#E03A58",
      700: "#C12A49",
    },

    // Accent colors (Kashmir saffron)
    accent: {
      100: "#FFE8CE",
      500: "#F4A261",
    },

    // Neutral colors
    text: "#111114", // ink900
    textSecondary: "#2B2E3A", // ink700
    textMuted: "#6B7280", // muted500
    background: "#FFFFFF", // surface0
    backgroundAlt: "#F8F9FB", // surfaceAlt
    border: "#E5E7EB", // line300

    // Semantic colors
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",

    // Tab and UI specific
    tint: "#FF4D6D",
    tabIconDefault: "#6B7280",
    tabIconSelected: "#FF4D6D",
    icon: "#6B7280",
  },

  dark: {
    // Primary brand colors (adjusted for dark theme)
    primary: {
      50: "#FFF0F3",
      100: "#FFE3E8",
      400: "#FF6B86",
      500: "#FF4D6D",
      600: "#E03A58", // Primary on dark
      700: "#C12A49",
    },

    // Accent colors
    accent: {
      100: "#FFE8CE",
      500: "#F4A261",
    },

    // Dark theme neutrals
    text: "#F5F6FA", // inkD
    textSecondary: "#F5F6FA",
    textMuted: "#9CA3AF", // mutedD
    background: "#101114", // surfaceD0
    backgroundAlt: "#171821", // surfaceD1
    border: "#2A2D34", // lineD

    // Semantic colors (same as light for consistency)
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",

    // Tab and UI specific
    tint: "#E03A58",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: "#E03A58",
    icon: "#9CA3AF",
  },

  // Gradient definitions
  gradients: {
    primary: ["#FF6B6B", "#FF3E8A"],
    hero: ["#FF6B6B", "#FF3E8A"],
  },
};

// Export individual color tokens for easier access
export const tokens = {
  colors: Colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;
