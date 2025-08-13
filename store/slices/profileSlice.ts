import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PersonProfile {
  id: string;
  handle: string;
  platform: 'instagram' | 'twitter' | 'snapchat';
  displayName: string;
  avatar?: string;
  bio?: string;
  isClaimed: boolean;
  isVerified: boolean;
  followerCount: number;
  totalGossips: number;
  trendingScore: number;
  channels?: Channel[];
}

interface Channel {
  id: string;
  name: string;
  type: 'preset' | 'user-created';
  gossipCount: number;
  isActive: boolean;
}

interface SocialLinks {
  instagram: boolean;
  twitter: boolean;
  snapchat: boolean;
}

interface ProfileState {
  currentProfile: PersonProfile | null;
  linkedSocials: SocialLinks;
  buzzBalance: number;
  dailyStreak: number;
  searchResults: PersonProfile[];
  trendingProfiles: PersonProfile[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  currentProfile: null,
  linkedSocials: {
    instagram: false,
    twitter: false,
    snapchat: false,
  },
  buzzBalance: 0,
  dailyStreak: 0,
  searchResults: [],
  trendingProfiles: [],
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCurrentProfile: (state, action: PayloadAction<PersonProfile>) => {
      state.currentProfile = action.payload;
    },
    updateLinkedSocials: (state, action: PayloadAction<SocialLinks>) => {
      state.linkedSocials = action.payload;
    },
    setBuzzBalance: (state, action: PayloadAction<number>) => {
      state.buzzBalance = action.payload;
    },
    setDailyStreak: (state, action: PayloadAction<number>) => {
      state.dailyStreak = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<PersonProfile[]>) => {
      state.searchResults = action.payload;
    },
    setTrendingProfiles: (state, action: PayloadAction<PersonProfile[]>) => {
      state.trendingProfiles = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateOnlineStatus: (state, action: PayloadAction<{ profileId: string; isOnline: boolean }>) => {
      if (state.currentProfile?.id === action.payload.profileId) {
        // Handle online status update if needed
      }
    },
  },
});

export const {
  setCurrentProfile,
  updateLinkedSocials,
  setBuzzBalance,
  setDailyStreak,
  setSearchResults,
  setTrendingProfiles,
  setLoading,
  setError,
  updateOnlineStatus,
} = profileSlice.actions;

export default profileSlice.reducer;