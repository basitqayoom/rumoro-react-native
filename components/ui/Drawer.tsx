/* eslint-disable import/no-named-as-default */
/* eslint-disable import/namespace */
import React from 'react';
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
// eslint-disable-next-line import/no-named-as-default-member
import Icon from './Icon';
import ProfileAvatar from './ProfileAvatar';

const DRAWER_WIDTH = 304;
Dimensions.get('window');

interface DrawerProps {
    visible: boolean;
    onClose: () => void;
    buzzPoints?: number;
    isAuthenticated?: boolean;
    username?: string;
    followingCount?: number;
    followersCount?: number;
}

interface DrawerItemProps {
    title: string;
    icon: string;
    onPress: () => void;
    isDestructive?: boolean;
    showArrow?: boolean;
}

const DrawerItem: React.FC<DrawerItemProps> = ({
    title,
    icon,
    onPress,
    isDestructive,
    showArrow = true,
}) => (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.drawerItemLeft}>
            <Icon
                name={icon}
                size={22}
                color={isDestructive ? Colors.light.danger : Colors.light.textMuted}
            />
            <Text
                style={[
                    styles.drawerItemText,
                    { color: isDestructive ? Colors.light.danger : Colors.light.text },
                ]}
            >
                {title}
            </Text>
        </View>
        {showArrow && <Icon name="chevron-forward" size={18} color={Colors.light.textMuted} />}
    </TouchableOpacity>
);

export default function Drawer({
    visible,
    onClose,
    buzzPoints = 0,
    isAuthenticated = true,
    username = 'anonymous_user',
    followingCount = 42,
    followersCount = 128,
}: DrawerProps) {
    const insets = useSafeAreaInsets();

    // Single progress value drives both scrim opacity (0→0.4) and drawer translateX (-W→0)
    const progress = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(progress, {
            toValue: visible ? 1 : 0,
            duration: visible ? 220 : 180,
            useNativeDriver: true, // transforms/opacity only
        }).start();
    }, [visible, progress]);

    const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [-DRAWER_WIDTH, 0],
    });

    const scrimOpacity = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.4],
    });

    const handleScrimPress = () => onClose();
    const handleProfile = () => onClose();
    const handleLinkedAccounts = () => onClose();
    const handleCreateChannels = () => onClose();
    const handleBookmarks = () => onClose();
    const handleAboutRumoro = () => onClose();
    const handleSignOut = () => onClose();

    // Always mounted; toggle hit-testing via pointerEvents to prevent background taps when closed
    return (
        <View
            style={StyleSheet.absoluteFill}
            pointerEvents={visible ? 'auto' : 'none'}
            accessibilityElementsHidden={!visible}
            importantForAccessibility={visible ? 'yes' : 'no-hide-descendants'}
        >
            {/* Scrim */}
            <Pressable style={styles.scrim} onPress={handleScrimPress}>
                <Animated.View style={[styles.scrimOverlay, { opacity: scrimOpacity }]} />
            </Pressable>

            {/* Drawer */}
            <Animated.View
                style={[
                    styles.drawer,
                    {
                        transform: [{ translateX }],
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    },
                ]}
            >
                {/* Header Block */}
                <View style={styles.headerBlock}>
                    <View style={styles.avatarSection}>
                        <ProfileAvatar size="large" />
                    </View>

                    {isAuthenticated ? (
                        <View style={styles.userInfoSection}>
                            <Text style={styles.username}>@{username}</Text>
                            <Text style={styles.buzzText}>Buzz: {buzzPoints}</Text>

                            <View style={styles.statsContainer}>
                                <TouchableOpacity style={styles.statItem}>
                                    <Text style={styles.statNumber}>{followingCount}</Text>
                                    <Text style={styles.statLabel}>Following</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.statItem}>
                                    <Text style={styles.statNumber}>{followersCount}</Text>
                                    <Text style={styles.statLabel}>Followers</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.unauthenticatedSection}>
                            <Text style={styles.signInText}>Sign in to continue</Text>
                            <TouchableOpacity style={styles.signInButton}>
                                <Text style={styles.signInButtonText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.divider} />

                {isAuthenticated && (
                    <>
                        <DrawerItem title="Profile" icon="person" onPress={handleProfile} />
                        <DrawerItem title="Linked Accounts" icon="link" onPress={handleLinkedAccounts} />
                        <DrawerItem
                            title="Create / Edit Channels"
                            icon="add-circle"
                            onPress={handleCreateChannels}
                        />
                        <DrawerItem title="Bookmarks" icon="bookmark" onPress={handleBookmarks} />
                        <DrawerItem title="About Rumoro" icon="information-circle" onPress={handleAboutRumoro} />
                    </>
                )}

                <View style={styles.divider} />

                {isAuthenticated && (
                    <DrawerItem
                        title="Sign Out"
                        icon="log-out"
                        onPress={handleSignOut}
                        isDestructive
                        showArrow={false}
                    />
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrim: {
        ...StyleSheet.absoluteFillObject,
    },
    scrimOverlay: {
        flex: 1,
        backgroundColor: '#000',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: DRAWER_WIDTH,
        height: '100%',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    container: { flex: 1 },
    headerBlock: { padding: 20, paddingBottom: 24 },
    avatarSection: { alignItems: 'center', marginBottom: 20 },
    userInfoSection: { alignItems: 'center' },
    username: { fontSize: 18, fontWeight: '700', color: '#111114', marginBottom: 8 },
    buzzText: { fontSize: 16, color: '#6B7280', marginBottom: 20, fontWeight: '500' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingHorizontal: 20 },
    statItem: { alignItems: 'center', flex: 1 },
    statNumber: { fontSize: 18, fontWeight: '700', color: '#111114', marginBottom: 4 },
    statLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
    unauthenticatedSection: { alignItems: 'center' },
    signInText: { fontSize: 16, color: '#111114', marginBottom: 12, textAlign: 'center' },
    signInButton: { backgroundColor: '#FF4D6D', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    signInButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginHorizontal: 16, marginVertical: 8 },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        minHeight: 56,
    },
    drawerItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    drawerItemText: { fontSize: 16, color: '#111114', marginLeft: 16, fontWeight: '500' },
});
