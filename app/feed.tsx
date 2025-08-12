import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

// Design tokens from copilot/design_tokens.json
const colors = {
    primary: {
        500: '#FF4D6D',
    },
    neutral: {
        surface0: '#FFFFFF',
        ink900: '#111114',
    },
};

export default function FeedScreen() {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText type="h1" style={styles.title}>
                    Your Feed
                </ThemedText>
                <ThemedText type="body" style={styles.description}>
                    Discover the latest gossips and conversations in your network.
                </ThemedText>
                <ThemedText type="subtitle" style={styles.placeholder}>
                    Feed Screen - Coming Soon
                </ThemedText>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral.surface0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary[500],
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: colors.neutral.ink900,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    placeholder: {
        fontSize: 18,
        color: colors.neutral.ink900,
        opacity: 0.6,
        textAlign: 'center',
    },
});
