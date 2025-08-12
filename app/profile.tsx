import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'Anonymous User',
        username: '@anon_user',
        bio: 'Spreading rumors, sharing secrets, living incognito 🎭',
        location: 'Hidden Location',
        website: 'rumoro.app',
        joined: 'March 2024'
    });
    const [editData, setEditData] = useState(profileData);

    const stats = [
        { label: 'Posts', value: '142' },
        { label: 'Followers', value: '2.5K' },
        { label: 'Following', value: '892' }
    ];

    const handleSave = () => {
        setProfileData(editData);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
    };

    const handleCancel = () => {
        setEditData(profileData);
        setIsEditing(false);
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.header, { backgroundColor: colors.background }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Profile</ThemedText>
                    <TouchableOpacity 
                        onPress={() => isEditing ? handleSave() : setIsEditing(true)}
                        style={styles.editButton}
                    >
                        <ThemedText style={[styles.editButtonText, { color: '#FF4D6D' }]}>
                            {isEditing ? 'Save' : 'Edit'}
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.profileHeader}>
                        <View style={styles.coverPhoto}>
                            <Image 
                                source={{ uri: 'https://picsum.photos/400/150' }}
                                style={styles.coverImage}
                            />
                        </View>
                        <TouchableOpacity style={styles.avatarContainer}>
                            <Image 
                                source={{ uri: 'https://i.pravatar.cc/150?img=10' }}
                                style={styles.avatar}
                            />
                            {isEditing && (
                                <View style={styles.changePhotoOverlay}>
                                    <Ionicons name="camera" size={20} color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileInfo}>
                        {isEditing ? (
                            <TextInput
                                style={[styles.nameInput, { color: colors.text, borderColor: colors.border }]}
                                value={editData.name}
                                onChangeText={(text) => setEditData({...editData, name: text})}
                                placeholder="Your name"
                                placeholderTextColor={colors.tabIconDefault}
                            />
                        ) : (
                            <ThemedText style={styles.name}>{profileData.name}</ThemedText>
                        )}
                        
                        {isEditing ? (
                            <TextInput
                                style={[styles.usernameInput, { color: colors.text, borderColor: colors.border }]}
                                value={editData.username}
                                onChangeText={(text) => setEditData({...editData, username: text})}
                                placeholder="@username"
                                placeholderTextColor={colors.tabIconDefault}
                            />
                        ) : (
                            <ThemedText style={styles.username}>{profileData.username}</ThemedText>
                        )}

                        {isEditing ? (
                            <TextInput
                                style={[styles.bioInput, { color: colors.text, borderColor: colors.border }]}
                                value={editData.bio}
                                onChangeText={(text) => setEditData({...editData, bio: text})}
                                placeholder="Bio"
                                placeholderTextColor={colors.tabIconDefault}
                                multiline
                                numberOfLines={3}
                            />
                        ) : (
                            <ThemedText style={styles.bio}>{profileData.bio}</ThemedText>
                        )}

                        <View style={styles.statsContainer}>
                            {stats.map((stat, index) => (
                                <View key={index} style={styles.statItem}>
                                    <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                                    <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                                </View>
                            ))}
                        </View>

                        <View style={styles.detailsContainer}>
                            <View style={styles.detailItem}>
                                <Ionicons name="location-outline" size={16} color={colors.tabIconDefault} />
                                {isEditing ? (
                                    <TextInput
                                        style={[styles.detailInput, { color: colors.text }]}
                                        value={editData.location}
                                        onChangeText={(text) => setEditData({...editData, location: text})}
                                        placeholder="Location"
                                        placeholderTextColor={colors.tabIconDefault}
                                    />
                                ) : (
                                    <ThemedText style={styles.detailText}>{profileData.location}</ThemedText>
                                )}
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="link-outline" size={16} color={colors.tabIconDefault} />
                                {isEditing ? (
                                    <TextInput
                                        style={[styles.detailInput, { color: colors.text }]}
                                        value={editData.website}
                                        onChangeText={(text) => setEditData({...editData, website: text})}
                                        placeholder="Website"
                                        placeholderTextColor={colors.tabIconDefault}
                                    />
                                ) : (
                                    <ThemedText style={styles.detailText}>{profileData.website}</ThemedText>
                                )}
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="calendar-outline" size={16} color={colors.tabIconDefault} />
                                <ThemedText style={styles.detailText}>Joined {profileData.joined}</ThemedText>
                            </View>
                        </View>

                        {isEditing && (
                            <TouchableOpacity 
                                onPress={handleCancel}
                                style={[styles.cancelButton, { borderColor: colors.border }]}
                            >
                                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.postsSection}>
                        <ThemedText style={styles.sectionTitle}>Recent Posts</ThemedText>
                        <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
                            <Ionicons name="newspaper-outline" size={48} color={colors.tabIconDefault} />
                            <ThemedText style={styles.emptyText}>No posts yet</ThemedText>
                            <ThemedText style={styles.emptySubtext}>Start sharing your rumors!</ThemedText>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    editButton: {
        padding: 8,
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    profileHeader: {
        position: 'relative',
        marginBottom: 60,
    },
    coverPhoto: {
        height: 150,
        backgroundColor: '#E5E7EB',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: -40,
        left: 20,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    changePhotoOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        paddingHorizontal: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    nameInput: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
        borderBottomWidth: 1,
        paddingVertical: 4,
    },
    username: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 12,
    },
    usernameInput: {
        fontSize: 16,
        marginBottom: 12,
        borderBottomWidth: 1,
        paddingVertical: 4,
    },
    bio: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
    },
    bioInput: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailsContainer: {
        marginBottom: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        fontSize: 14,
        marginLeft: 8,
        color: '#6B7280',
    },
    detailInput: {
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 4,
    },
    cancelButton: {
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        marginTop: 12,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    postsSection: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    emptyState: {
        padding: 40,
        borderRadius: 12,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6B7280',
    },
});