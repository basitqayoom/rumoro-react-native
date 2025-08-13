
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../ThemedText';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { InstagramIcon } from '../../ui/InstagramIcon';
import { colors } from '../constants';
import { onboardingStyles } from '../styles';
import { InstagramLinkingProps } from '../types';

export const InstagramLinkingScreen: React.FC<InstagramLinkingProps> = ({
    onLinkInstagram,
    onSkip,
    loading,
}) => {
    return (
        <View style={onboardingStyles.stepContainer}>
            <View style={onboardingStyles.compactHeader}>
                <ThemedText type="h2" style={onboardingStyles.compactTitle}>
                    Let Others Find You
                </ThemedText>
                <ThemedText type="body" style={onboardingStyles.compactSubtitle}>
                    Connect your Instagram so people can find your profile and gossip about you anonymously
                </ThemedText>
            </View>

            <ScrollView
                contentContainerStyle={onboardingStyles.instagramScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={onboardingStyles.instagramScrollView}
            >
                <View style={onboardingStyles.instagramMainContent}>
                    <View style={onboardingStyles.instagramHeroSection}>
                        <View style={onboardingStyles.instagramIconContainer}>
                            <InstagramIcon size={48} color="#E4405F" />
                        </View>

                        <ThemedText type="h3" style={onboardingStyles.instagramMainHeading}>
                            Be Part of the Conversation
                        </ThemedText>
                        <ThemedText type="body" style={onboardingStyles.instagramMainDescription}>
                            Link your Instagram so others can find you by your handle and share anonymous gossip about you.
                        </ThemedText>
                    </View>

                    <View style={onboardingStyles.anonymityHighlight}>
                        <View style={onboardingStyles.anonymityHeader}>
                            <Icon name="eye-off" size={20} color={colors.primary[600]} style={onboardingStyles.anonymityIcon} />
                            <ThemedText style={onboardingStyles.anonymityTitle}>Stay Anonymous</ThemedText>
                        </View>
                        <ThemedText style={onboardingStyles.anonymityText}>
                            You will still be <ThemedText style={onboardingStyles.anonymityEmphasis}>completely anonymous</ThemedText> while posting gossip about others
                        </ThemedText>
                    </View>

                    <View style={onboardingStyles.benefitsSection}>
                        <View style={onboardingStyles.benefitRow}>
                            <View style={onboardingStyles.benefitIconBg}>
                                <Icon name="users" size={16} color={colors.primary[600]} />
                            </View>
                            <View style={onboardingStyles.benefitContent}>
                                <ThemedText type="caption" style={onboardingStyles.benefitTitle}>Discoverable</ThemedText>
                                <ThemedText type="caption" style={onboardingStyles.benefitDescription}>
                                    People can find you by your Instagram handle
                                </ThemedText>
                            </View>
                        </View>

                        <View style={onboardingStyles.benefitRow}>
                            <View style={onboardingStyles.benefitIconBg}>
                                <Icon name="message-circle" size={16} color={colors.primary[600]} />
                            </View>
                            <View style={onboardingStyles.benefitContent}>
                                <ThemedText type="caption" style={onboardingStyles.benefitTitle}>Anonymous Gossip</ThemedText>
                                <ThemedText type="caption" style={onboardingStyles.benefitDescription}>
                                    Receive anonymous posts about yourself
                                </ThemedText>
                            </View>
                        </View>

                        <View style={[onboardingStyles.benefitRow, onboardingStyles.benefitRowLast]}>
                            <View style={onboardingStyles.benefitIconBg}>
                                <Icon name="shield" size={16} color={colors.primary[600]} />
                            </View>
                            <View style={onboardingStyles.benefitContent}>
                                <ThemedText type="caption" style={onboardingStyles.benefitTitle}>Privacy Protected</ThemedText>
                                <ThemedText type="caption" style={onboardingStyles.benefitDescription}>
                                    Your Instagram info stays completely private
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    <View style={onboardingStyles.proTipSection}>
                        <View style={onboardingStyles.proTipContainer}>
                            <Icon name="lightbulb" size={18} color={colors.primary[600]} style={onboardingStyles.proTipBulb} />
                            <View style={onboardingStyles.proTipTextContainer}>
                                <ThemedText style={onboardingStyles.proTipLabel}>Pro tip</ThemedText>
                                <ThemedText style={onboardingStyles.proTipMessage}>
                                    The more discoverable you are, the more interesting gossip you&apos;ll get!
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={onboardingStyles.buttonContainer}>
                <Button
                    title="Connect Instagram"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    onPress={onLinkInstagram}
                    iconName="instagram"
                    iconColor="#FFFFFF"
                    style={onboardingStyles.instagramConnectButton}
                />
                <TouchableOpacity onPress={onSkip} style={onboardingStyles.skipButton}>
                    <ThemedText type="body" style={onboardingStyles.skipText}>
                        I&apos;ll Do This Later
                    </ThemedText>
                    <Icon name="arrow-right" size={16} color={colors.neutral.ink600} style={onboardingStyles.skipArrow} />
                </TouchableOpacity>
            </View>
        </View>
    );
};
