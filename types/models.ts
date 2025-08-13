export interface User {
    id: string;
    phoneNumber: string;
    buzzScore: number;
    linkedSocials: {
        instagram?: string;
        twitter?: string;
        snapchat?: string;
    };
    createdAt: Date;
    lastActiveAt: Date;
}

export interface PersonProfile {
    id: string;
    handle: string;
    platform: 'instagram' | 'twitter' | 'snapchat';
    displayName: string;
    avatar?: string;
    bio?: string;
    isClaimed: boolean;
    claimedBy?: string;
    isVerified: boolean;
    followerCount?: number;
    createdAt: Date;
    lastUpdatedAt: Date;
}

export type ChannelType = 'preset' | 'user-created';

export interface Channel {
    id: string;
    profileId: string;
    name: string;
    type: ChannelType;
    createdBy?: string;
    createdAt: Date;
    gossipCount: number;
    isActive: boolean;
}

export const PRESET_CHANNELS = [
    'Work',
    'College/School', 
    'Talent/Skills',
    'Tea/Spill',
    'Q&A',
    'Fact-Check',
    'Misc'
] as const;

export type PresetChannelName = typeof PRESET_CHANNELS[number];

export interface Gossip {
    id: string;
    profileId: string;
    channelId: string;
    authorId: string;
    content: string;
    replyCount: number;
    createdAt: Date;
    isBoosted?: boolean;
    boostExpiresAt?: Date;
    isHidden?: boolean;
}

export interface Reply {
    id: string;
    gossipId: string;
    authorId: string;
    content: string;
    createdAt: Date;
}

export interface BuzzTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'earn' | 'spend';
    reason: 
        | 'daily_open'
        | 'post_survived'
        | 'post_replies'
        | 'claim_profile'
        | 'create_channel'
        | 'boost_gossip'
        | 'cosmetic';
    metadata?: any;
    createdAt: Date;
}

export interface Report {
    id: string;
    targetType: 'gossip' | 'reply' | 'profile';
    targetId: string;
    reportedBy: string;
    reason: string;
    createdAt: Date;
    status: 'pending' | 'reviewed' | 'resolved';
}