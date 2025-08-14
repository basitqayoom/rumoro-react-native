/* eslint-disable import/namespace */
import React, { useState } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
// eslint-disable-next-line import/no-named-as-default
import FAB from '../../components/ui/FAB';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import SegmentedTwoTab from '../../components/ui/headers/SegmentedTwoTab';
import { Colors } from '../../constants/Colors';

export default function HomeTab() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const [seg, setSeg] = useState<'for-you' | 'following'>('for-you');

    return (
        <ThemedView style={styles.container}>
            {/* Enhanced sub-tabs header */}
            <View style={[styles.subTabsContainer, { backgroundColor: theme.background }]}>
                <SegmentedTwoTab value={seg} onChange={setSeg} theme={theme} />
            </View>

            {/* Content based on active tab */}
            <View style={styles.content}>
                {seg === 'for-you' ? (
                    <>
                        <ThemedText type="h1" style={styles.title}>For You</ThemedText>
                        <ThemedText type="subtitle" style={styles.subtitle}>
                            Personalized content based on your interests and activity.
                        </ThemedText>
                        <View style={styles.placeholderContent}>
                            <Text style={[styles.placeholderText, { color: theme.textMuted }]}>
                                🎯 Your personalized feed will appear here
                            </Text>
                        </View>
                    </>
                ) : (
                    <>
                        <ThemedText type="h1" style={styles.title}>Following</ThemedText>
                        <ThemedText type="subtitle" style={styles.subtitle}>
                            Content from people and channels you follow.
                        </ThemedText>
                        <View style={styles.placeholderContent}>
                            <Text style={[styles.placeholderText, { color: theme.textMuted }]}>
                                👥 Content from your network will appear here
                            </Text>
                        </View>
                    </>
                )}
            </View>

            <FAB onPress={() => { }} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    subTabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    title: {
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 22,
    },
    placeholderContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    placeholderText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
});


