import React from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    TouchableOpacityProps,
    useColorScheme,
    ViewStyle,
} from 'react-native';
import { Colors, tokens } from '../../constants/Colors';
import { ThemedText } from '../ThemedText';

type ButtonProps = TouchableOpacityProps & {
    title?: string;
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'filled';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
};

export function Button({
    title,
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
    style,
    ...rest
}: ButtonProps) {
    const theme = useColorScheme() ?? 'light';

    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            borderRadius: tokens.borderRadius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            ...tokens.shadows.sm,
        };

        // Size variants
        switch (size) {
            case 'sm':
                baseStyle.paddingHorizontal = tokens.spacing.md;
                baseStyle.paddingVertical = tokens.spacing.sm;
                baseStyle.minHeight = 40;
                break;
            case 'lg':
                baseStyle.paddingHorizontal = tokens.spacing.xl;
                baseStyle.paddingVertical = tokens.spacing.md;
                baseStyle.minHeight = 56;
                break;
            default: // md
                baseStyle.paddingHorizontal = tokens.spacing.lg;
                baseStyle.paddingVertical = tokens.spacing.md;
                baseStyle.minHeight = 48;
        }

        // Full width
        if (fullWidth) {
            baseStyle.width = '100%';
        }

        // Variant styles
        switch (variant) {
            case 'secondary':
                baseStyle.backgroundColor = Colors[theme].backgroundAlt;
                baseStyle.borderWidth = 1;
                baseStyle.borderColor = Colors[theme].border;
                break;
            case 'outline':
                baseStyle.backgroundColor = 'transparent';
                baseStyle.borderWidth = 2;
                baseStyle.borderColor = Colors[theme].primary[500];
                break;
            case 'ghost':
                baseStyle.backgroundColor = 'transparent';
                baseStyle.shadowOpacity = 0;
                baseStyle.elevation = 0;
                break;
            case 'filled':
            case 'primary':
            default:
                baseStyle.backgroundColor = Colors[theme].primary[500];
        }

        // Disabled state
        if (disabled || loading) {
            baseStyle.opacity = 0.6;
        }

        return baseStyle;
    };

    const getTextColor = () => {
        switch (variant) {
            case 'outline':
            case 'ghost':
                return Colors[theme].primary[500];
            case 'secondary':
                return Colors[theme].text;
            case 'filled':
            case 'primary':
            default:
                return '#FFFFFF';
        }
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...rest}
        >
            {loading && (
                <ActivityIndicator
                    size="small"
                    color={getTextColor()}
                    style={{ marginRight: tokens.spacing.sm }}
                />
            )}
            {children || (
                <ThemedText
                    type="button"
                    style={{ color: getTextColor() }}
                >
                    {title}
                </ThemedText>
            )}
        </TouchableOpacity>
    );
}
