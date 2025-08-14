import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import FAB from '../../components/ui/FAB';

export default function ChannelsTab() {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText type="h1">Channels</ThemedText>
                <ThemedText type="subtitle">Explore topic-based channels.</ThemedText>
            </View>
            <FAB onPress={() => { }} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
});


