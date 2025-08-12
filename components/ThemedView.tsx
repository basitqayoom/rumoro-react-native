import { Colors } from '../constants/Colors';
import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';

type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    variant?: 'default' | 'alt' | 'primary' | 'accent';
};   

export function ThemedView({
    style, 
    lightColor,
    darkColor,
    variant = 'default',
    ...otherProps
}: ThemedViewProps) {
    const theme = useColorScheme() ?? 'light';

    const getBackgroundColor = () => {
        if (lightColor || darkColor) {
            return theme === 'light' ? lightColor : darkColor;
        }

        switch (variant) {
            case 'alt':
                return Colors[theme].backgroundAlt;
            case 'primary':
                return Colors[theme].primary[500];
            case 'accent':
                return Colors[theme].accent[500];
            default:
                return Colors[theme].background;
        }
    };

    return (
        <View
            style={[
                { backgroundColor: getBackgroundColor() },
                style,
            ]}
            {...otherProps}
        />
    );
}
