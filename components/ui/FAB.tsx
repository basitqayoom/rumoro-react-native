import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, useColorScheme, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import Icon from './Icon';

export interface FABProps {
    onPress?: () => void;
    style?: ViewStyle;
}

export const FAB: React.FC<FABProps> = ({ onPress, style }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    // Animation for subtle floating effect
    const floatAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const floatAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: false,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false,
                }),
            ])
        );

        floatAnimation.start();

        return () => floatAnimation.stop();
    }, [floatAnim]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    };

    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -3],
    });

    return (
        <Animated.View
            style={[
                styles.fabContainer,
                {
                    transform: [
                        { translateY },
                        { scale: scaleAnim }
                    ]
                }
            ]}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    styles.fab,
                    {
                        backgroundColor: theme.primary[600],
                        shadowColor: theme.primary[600],
                    },
                    style,
                ]}
            >
                <Icon name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    fabContainer: {
        position: 'absolute',
        bottom: 40,
        right: 20,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
    },
});

export default FAB;


