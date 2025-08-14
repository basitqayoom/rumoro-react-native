import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Icon } from './Icon';

export default function FabButton() {
    // TODO: Implement navigation to compose screen or modal
    const handlePress = () => {
        // Example: navigate to compose or show modal
        // router.push('/compose');
    };

    return (
        <TouchableOpacity
            style={styles.fab}
            accessibilityLabel="Create"
            activeOpacity={0.85}
            onPress={handlePress}
        >
            <View style={styles.iconWrapper}>
                <Icon name="add" size={32} color="#fff" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 24,
        bottom: Platform.OS === 'ios' ? 32 : 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.light.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 4,
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
