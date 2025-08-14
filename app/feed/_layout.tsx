/* eslint-disable import/namespace */
/* eslint-disable import/no-named-as-default */
import { Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, useColorScheme } from 'react-native';
// eslint-disable-next-line import/namespace, import/no-named-as-default-member
import Drawer from '../../components/ui/Drawer';
import BrandTitle from '../../components/ui/headers/BrandTitle';
import Icon from '../../components/ui/Icon';
import ProfileAvatar from '../../components/ui/ProfileAvatar';
import { Colors } from '../../constants/Colors';

export default function FeedTabsLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [drawerVisible, setDrawerVisible] = useState(false);

    // Animation for glazing effect
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        );

        shimmerAnimation.start();

        return () => shimmerAnimation.stop();
    }, [shimmerAnim]);

    const handleAvatarPress = () => {
        setDrawerVisible(true);
    };

    const handleDrawerClose = () => {
        setDrawerVisible(false);
    };

    return (
        <>
            <Tabs
                screenOptions={{
                    headerTitle: () => (
                        <BrandTitle
                            color={theme.primary[500]}
                            glow={theme.primary[400]}
                            shadow={theme.primary[400]}
                        />
                    ),
                    headerLeft: () => (
                        <TouchableOpacity
                            style={{ marginLeft: 16 }}
                            activeOpacity={0.7}
                            onPress={handleAvatarPress}
                        >
                            <ProfileAvatar size="medium" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 16 }} activeOpacity={0.7}>
                            <Icon name="settings" size={22} color={theme.icon} />
                        </TouchableOpacity>
                    ),
                    tabBarActiveTintColor: theme.tabIconSelected,
                    tabBarInactiveTintColor: theme.tabIconDefault,
                    tabBarStyle: {
                        backgroundColor: theme.background,
                        borderTopWidth: 0, // Remove the separator line
                        elevation: 0, // Remove shadow on Android
                        shadowOpacity: 0, // Remove shadow on iOS
                    },
                    headerStyle: {
                        backgroundColor: '#FFFFFF', // Pure white background
                        elevation: 0, // Remove shadow on Android
                        shadowOpacity: 0, // Remove shadow on iOS
                        borderBottomWidth: 0, // Remove bottom border
                    },
                    headerTitleStyle: {
                        color: theme.text,
                        textAlign: 'center',
                        alignSelf: 'center',
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        title: 'Search',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="search" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="channels"
                    options={{
                        title: 'Channels',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="chatbubbles" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="notifications"
                    options={{
                        title: 'Notifications',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="notifications" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="messages"
                    options={{
                        title: 'Messages',
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="mail" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>

            {/* Drawer */}
            <Drawer
                visible={drawerVisible}
                onClose={handleDrawerClose}
                buzzPoints={124}
                isAuthenticated={true}
                username="anonymous_user"
                followingCount={42}
                followersCount={128}
            />
        </>
    );
}


