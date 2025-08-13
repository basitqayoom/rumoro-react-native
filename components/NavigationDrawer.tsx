import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions,
    TouchableWithoutFeedback,
    StatusBar,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { BuzzDisplay } from './BuzzDisplay';

const { width: screenWidth } = Dimensions.get('window');
const DRAWER_WIDTH = screenWidth * 0.75;

interface NavigationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MenuItem {
    id: string;
    title: string;
    icon: string;
    route?: string;
    action?: () => void;
}

const menuItems: MenuItem[] = [
    { id: 'profile', title: 'Profile', icon: '👤', route: '/profile' },
    { id: 'settings', title: 'Settings', icon: '⚙️', route: '/settings' },
    { id: 'notifications', title: 'Notification Settings', icon: '🔔', route: '/notification-settings' },
    { id: 'privacy', title: 'Privacy', icon: '🔒', route: '/privacy' },
    { id: 'help', title: 'Help & Support', icon: '❓', route: '/help' },
    { id: 'about', title: 'About', icon: 'ℹ️', route: '/about' },
];

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const handleMenuItemPress = (item: MenuItem) => {
        onClose();
        if (item.route) {
            router.push(item.route as any);
        }
        if (item.action) {
            item.action();
        }
    };

    const handleLogout = () => {
        onClose();
        // Navigate to onboarding/login screen
        router.replace('/onboarding');
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.drawer, { backgroundColor: colors.background }]}>
                            <SafeAreaView style={styles.safeArea}>
                                <View style={styles.header}>
                                    <View style={styles.userInfo}>
                                        <Image 
                                            source={{ uri: 'https://i.pravatar.cc/150?img=10' }} 
                                            style={styles.userAvatar}
                                        />
                                        <View style={styles.userDetails}>
                                            <ThemedText style={styles.userName}>Anonymous User</ThemedText>
                                            <ThemedText style={styles.userHandle}>@anon_user</ThemedText>
                                            <View style={styles.buzzContainer}>
                                                <BuzzDisplay amount={150} size="small" />
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <ThemedText style={styles.closeIcon}>✕</ThemedText>
                                    </TouchableOpacity>
                                </View>

                                <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                                    {menuItems.map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.menuItem}
                                            onPress={() => handleMenuItemPress(item)}
                                        >
                                            <ThemedText style={styles.menuIcon}>{item.icon}</ThemedText>
                                            <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                <View style={styles.footer}>
                                    <TouchableOpacity 
                                        style={[styles.logoutButton, { backgroundColor: '#FF4D6D' }]}
                                        onPress={handleLogout}
                                    >
                                        <ThemedText style={styles.logoutIcon}>🚪</ThemedText>
                                        <ThemedText style={styles.logoutText}>Logout</ThemedText>
                                    </TouchableOpacity>
                                    <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
                                </View>
                            </SafeAreaView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111114',
        marginBottom: 2,
    },
    userHandle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    buzzContainer: {
        alignSelf: 'flex-start',
    },
    closeButton: {
        padding: 8,
    },
    closeIcon: {
        fontSize: 20,
        color: '#6B7280',
    },
    menuContainer: {
        flex: 1,
        paddingVertical: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 16,
        width: 24,
    },
    menuTitle: {
        fontSize: 16,
        color: '#111114',
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    logoutIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    version: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});

export default NavigationDrawer;