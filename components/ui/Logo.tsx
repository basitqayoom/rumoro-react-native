import React from 'react';
import { Image, ImageStyle, View, ViewStyle } from 'react-native';

// Design tokens from copilot/design_tokens.json
const colors = {
    primary: {
        50: '#FFF0F3',
        100: '#FFE3E8',
        400: '#FF6B86',
        500: '#FF4D6D',
        600: '#E03A58',
        700: '#C12A49',
    },
    neutral: {
        surface0: '#FFFFFF',
        ink900: '#111114',
    },
    accent: {
        500: '#F4A261',
        100: '#FFE8CE',
    },
};

export interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    variant?: 'light' | 'dark' | 'brand' | 'gradient';
    style?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({
    size = 'medium',
    variant = 'light',
    style,
}) => {
    const logoConfig = {
        small: {
            containerSize: 48,
            borderRadius: 24, // Circular
            shadowRadius: 6,
        },
        medium: {
            containerSize: 84,
            borderRadius: 42, // Circular
            shadowRadius: 10,
        },
        large: {
            containerSize: 128,
            borderRadius: 64, // Circular
            shadowRadius: 16,
        },
    };

    const config = logoConfig[size];

    const getVariantStyles = () => {
        switch (variant) {
            case 'light':
                return {
                    container: {
                        backgroundColor: colors.neutral.surface0,
                        shadowColor: colors.primary[600],
                        borderColor: colors.primary[100],
                        borderWidth: 2,
                    },
                };
            case 'dark':
                return {
                    container: {
                        backgroundColor: colors.neutral.ink900,
                        shadowColor: colors.primary[400],
                        borderColor: colors.primary[600],
                        borderWidth: 2,
                    },
                };
            case 'brand':
                return {
                    container: {
                        backgroundColor: colors.primary[500],
                        shadowColor: colors.primary[700],
                        borderColor: colors.primary[400],
                        borderWidth: 2,
                    },
                };
            case 'gradient':
                return {
                    container: {
                        backgroundColor: colors.neutral.surface0,
                        shadowColor: colors.primary[500],
                        borderColor: colors.primary[400],
                        borderWidth: 3,
                    },
                };
            default:
                return {
                    container: {
                        backgroundColor: colors.neutral.surface0,
                        shadowColor: colors.primary[600],
                        borderColor: colors.primary[100],
                        borderWidth: 2,
                    },
                };
        }
    };

    const variantStyles = getVariantStyles();

    const containerStyle: ViewStyle = {
        width: config.containerSize,
        height: config.containerSize,
        borderRadius: config.borderRadius, // Perfect circle
        backgroundColor: variantStyles.container.backgroundColor,
        borderColor: variantStyles.container.borderColor,
        borderWidth: variantStyles.container.borderWidth,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: variantStyles.container.shadowColor,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: config.shadowRadius,
        elevation: config.shadowRadius * 2,
        position: 'relative',
        // Add a subtle tilt for that Gen Z vibe
        transform: [{ rotate: '-2deg' }],
        overflow: 'hidden', // Ensure circular cropping
    };

    const imageStyle: ImageStyle = {
        width: config.containerSize * 1.2, // 120% of container to zoom in and crop
        height: config.containerSize * 1.2,
        borderRadius: config.containerSize * 0.6, // Keep circular
        // Counter-rotate the image to make it straight while container is tilted
        transform: [{ rotate: '2deg' }],
    };

    // Inner glow effect for gradient variant
    const innerGlowStyle: ViewStyle = variant === 'gradient' ? {
        position: 'absolute',
        top: 3,
        left: 3,
        right: 3,
        bottom: 3,
        borderRadius: config.borderRadius - 3,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary[400],
        opacity: 0.6,
    } : {};

    return (
        <View style={[containerStyle, style]}>
            {variant === 'gradient' && <View style={innerGlowStyle} />}
            <Image
                source={require('../../assets/images/logo/logo.png')}
                style={imageStyle}
                resizeMode="cover" // This will crop and zoom to fill the circular space
            />
        </View>
    );
};

export default Logo;
