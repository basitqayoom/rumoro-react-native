/*
 * Rumoro Design System Typography
 * Based on the design tokens
 */

export const Typography = {
  fonts: {
    display: "Sora", // For headings and key UI elements
    ui: "Inter", // For body text and interface
    mono: "SpaceMono-Regular", // For code/monospace
  },

  scale: {
    h1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "700" as const,
      fontFamily: "Sora",
    },
    h2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: "600" as const,
      fontFamily: "Sora",
    },
    h3: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "600" as const,
      fontFamily: "Sora",
    },
    h4: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "600" as const,
      fontFamily: "Inter",
    },
    subtitle: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "500" as const,
      fontFamily: "Inter",
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400" as const,
      fontFamily: "Inter",
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "400" as const,
      fontFamily: "Inter",
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "400" as const,
      fontFamily: "Inter",
    },
    button: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: "600" as const,
      fontFamily: "Inter",
    },
  },
} as const;
