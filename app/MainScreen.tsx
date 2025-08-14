import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import FabButton from '../components/ui/FabButton';
import TabBar from '../components/ui/TabBar';

export default function MainScreen() {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <TabBar />
                {/* Main feed content will go here */}
                <ThemedText type="h1" style={styles.title}>
                    Main Screen
                </ThemedText>
                <ThemedText type="body" style={styles.description}>
                    Everything will be created here.
                </ThemedText>
            </View>
            <FabButton />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
    },
});
