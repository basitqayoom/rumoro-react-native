import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Logo from '../components/ui/Logo';

// Design tokens from copilot/design_tokens.json
const colors = {
  primary: {
    50: '#FFF0F3',
    500: '#FF4D6D',
    600: '#E03A58',
    700: '#C12A49',
  },
  neutral: {
    surface0: '#FFFFFF',
  },
};

// Splash screen configuration
const SPLASH_CONFIG = {
  brandName: 'RUMORO',
  tagline: 'Spill the tea, stay anonymous',
  displayDuration: 2000, // 2 seconds
  animationDuration: 800,
};

// Auth state - for now set to false (will be replaced with actual auth logic later)
const AUTH_STATE = {
  isLoggedIn: false,
};

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: SPLASH_CONFIG.animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: SPLASH_CONFIG.animationDuration,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to appropriate screen based on auth state
    const timer = setTimeout(() => {
      if (AUTH_STATE.isLoggedIn) {
        // User is logged in - go to feed
        router.replace('/(tabs)/feed');
      } else {
        // User is not logged in - go to onboarding
        router.replace('/onboarding');
      }
    }, SPLASH_CONFIG.displayDuration);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[600]} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Brand Logo */}
        <View style={styles.logoContainer}>
          <Logo size="large" variant="gradient" />
        </View>

        {/* Brand Name */}
        <Text style={styles.brandName}>{SPLASH_CONFIG.brandName}</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>{SPLASH_CONFIG.tagline}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.neutral.surface0,
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: colors.primary[700],
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary[50],
    letterSpacing: 0.5,
  },
});
