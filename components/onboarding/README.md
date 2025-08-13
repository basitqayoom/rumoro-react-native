# Onboarding Component Architecture

This directory contains the modular onboarding components extracted from the monolithic `app/onboarding.tsx` file for better organization, maintainability, and reusability.

## Directory Structure

```
components/onboarding/
├── constants/
│   └── index.ts          # Design tokens, animation durations, and other constants
├── hooks/
│   └── useOnboarding.ts  # Custom hook containing all onboarding business logic
├── screens/
│   ├── AuthSelectionScreen.tsx     # Initial auth method selection screen
│   ├── PhoneInputScreen.tsx        # Phone number input screen
│   ├── OtpVerificationScreen.tsx   # OTP verification screen
│   ├── InstagramLinkingScreen.tsx  # Instagram linking screen
│   └── index.ts                    # Screen exports
├── styles/
│   └── index.ts          # Shared styles for all onboarding screens
├── types/
│   └── index.ts          # TypeScript type definitions
├── OnboardingOrchestrator.tsx      # Main orchestrator component
└── index.ts              # Main exports
```

## Components Overview

### OnboardingOrchestrator
- **Purpose**: Main component that coordinates all onboarding screens
- **Responsibilities**: 
  - Uses the `useOnboarding` hook for state management
  - Handles screen transitions with animations
  - Renders each screen component in an animated container

### Screen Components
Each screen component is focused on a specific step of the onboarding process:

1. **AuthSelectionScreen**: Welcome screen with Google and phone auth options
2. **PhoneInputScreen**: Phone number input with country code picker
3. **OtpVerificationScreen**: OTP input with resend functionality
4. **InstagramLinkingScreen**: Instagram connection with skip option

### useOnboarding Hook
- **Purpose**: Centralized state management and business logic
- **Features**:
  - State management for all onboarding data
  - Navigation animations
  - Form validation
  - API call simulations
  - Timer management for OTP resend

### Types & Constants
- **types/index.ts**: TypeScript interfaces for props and state
- **constants/index.ts**: Design tokens, durations, and configuration values

## Benefits of Modular Architecture

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Screen components can be reused in different contexts
3. **Testing**: Easier to unit test individual components
4. **Development**: Multiple developers can work on different screens simultaneously
5. **Code Organization**: Related code is grouped together logically

## Usage

```tsx
import { OnboardingOrchestrator } from '../components/onboarding';

export default function OnboardingScreen() {
    return <OnboardingOrchestrator />;
}
```

## Key Features

- **Smooth Animations**: Horizontal slide transitions between screens
- **Type Safety**: Full TypeScript support with proper type definitions
- **Design System**: Uses design tokens from `copilot/design_tokens.json`
- **Responsive**: Works across different screen sizes
- **Accessibility**: Follows React Native accessibility best practices

## Customization

To customize the onboarding flow:

1. **Add new screens**: Create new screen components in `screens/` directory
2. **Modify navigation**: Update the orchestrator to include new screens
3. **Update types**: Add new interfaces in `types/index.ts`
4. **Extend hooks**: Add new state/logic to `useOnboarding.ts`

## Migration Notes

This modular architecture replaces the previous 1067-line monolithic `onboarding.tsx` file. The functionality remains identical, but the code is now organized into focused, maintainable components.
