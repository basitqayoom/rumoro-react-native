import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'h1' | 'h2' | 'h3' | 'h4' | 'subtitle' | 'body' | 'bodySmall' | 'caption' | 'button';
    variant?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'danger';
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = 'body',
    variant = 'primary',
    ...rest
}: ThemedTextProps) {
    const theme = useColorScheme() ?? 'light';

    const getTextColor = () => {
        if (lightColor || darkColor) {
            return theme === 'light' ? lightColor : darkColor;
        }

        switch (variant) {
            case 'secondary':
                return Colors[theme].textSecondary;
            case 'muted':
                return Colors[theme].textMuted;
            case 'accent':
                return Colors[theme].accent[500];
            case 'success':
                return Colors[theme].success;
            case 'warning':
                return Colors[theme].warning;
            case 'danger':
                return Colors[theme].danger;
            default:
                return Colors[theme].text;
        }
    };

    return (
        <Text
            style={[
                Typography.scale[type],
                { color: getTextColor() },
                style,
            ]}
            {...rest}
        />
    );
}
