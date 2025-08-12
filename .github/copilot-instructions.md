# GitHub Copilot Instructions

## Project Overview

This is a React Native/Expo application called Rumoro. The project follows a component-based architecture with TypeScript and uses modern React Native development practices.

## Business Context

- Refer to `copilot/business_info.md` for complete MVP specifications including:
  - App concept: Anonymous, profile-centric social app for posting text-only gossips
  - Core features: Person profiles via social handles, channels, Buzz Score system
  - Authentication: Phone + OTP sign-in with social linking (Instagram, X/Twitter, Snapchat)
  - Safety features: Report/block functionality, owner claims, keyword filters
  - Feed types: Hot (ranked) and Latest feeds
- Keep business requirements and user flows in mind when implementing features
- Maintain focus on text-only content and anonymous posting mechanics

## Code Style & Conventions

- Use TypeScript for all new files
- Follow React Native and Expo best practices
- Use functional components with hooks
- Implement proper TypeScript typing
- Follow the existing folder structure and naming conventions

## Architecture Guidelines

- Components are organized in the `components/` directory with UI components in `components/ui/`
- Screens/pages are in the `app/` directory following Expo Router conventions
- Constants are defined in the `constants/` directory
- Custom hooks are in the `hooks/` directory
- Design system tokens and documentation are in the `copilot/` directory

## Design System

- Follow the comprehensive design system defined in `copilot/design_system.md` which includes:
  - Brand direction with coral/rose theme and dating-app vibe
  - Color system with light and dark mode support
  - Typography scale and component specifications
  - Motion and interaction guidelines
- Use design tokens from `copilot/design_tokens.json` for:
  - Primary colors (coral/rose palette)
  - Neutral colors (ink and sky variations)
  - Accent colors and semantic tokens
  - Spacing, border radius, and sizing values
- Maintain consistency with existing themed components (`ThemedText`, `ThemedView`)
- Reference typography constants from `constants/Typography.ts`

## Development Practices

- Ensure components are responsive and work across different screen sizes
- Implement proper error handling
- Use meaningful component and variable names
- Add appropriate comments for complex logic
- Follow accessibility best practices for React Native

## Dependencies

- This is an Expo project - prefer Expo-compatible packages
- Use React Native community packages when Expo alternatives aren't available
- Always check compatibility before suggesting new dependencies

## File Naming

- Use PascalCase for component files (e.g., `MyComponent.tsx`)
- Use camelCase for utility files and hooks
- Use kebab-case for configuration files where appropriate

## When Making Changes

- Always consider the existing design system and component patterns
- Maintain consistency with the current codebase style
- Test suggestions work with React Native/Expo environment
- Consider both iOS and Android compatibility
