import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface BuzzDisplayProps {
    amount: number;
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
    onPress?: () => void;
}

export function BuzzDisplay({ 
    amount, 
    size = 'medium', 
    showLabel = true,
    onPress 
}: BuzzDisplayProps) {
    const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
    const fontSize = size === 'small' ? 14 : size === 'medium' ? 16 : 18;
    
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push('/buzz-history');
        }
    };
    
    return (
        <TouchableOpacity style={[styles.container, styles[size]]} onPress={handlePress}>
            <Ionicons name="flash" size={iconSize} color="#F59E0B" />
            <View style={styles.textContainer}>
                {showLabel && (
                    <ThemedText style={[styles.label, { fontSize: fontSize - 4 }]}>
                        Buzz
                    </ThemedText>
                )}
                <ThemedText style={[styles.amount, { fontSize }]}>
                    {amount.toLocaleString()}
                </ThemedText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        borderRadius: 20,
        gap: 6,
    },
    small: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    medium: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    large: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    label: {
        color: '#92400E',
        fontWeight: '500',
    },
    amount: {
        color: '#92400E',
        fontWeight: 'bold',
    },
});