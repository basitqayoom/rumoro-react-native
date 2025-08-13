import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Gossip {
  id: string;
  profile: {
    id: string;
    handle: string;
    platform: string;
    displayName: string;
    avatar?: string;
  };
  channel: {
    id: string;
    name: string;
    type: string;
  };
  content: string;
  imageUrl?: string;
  replyCount: number;
  likeCount: number;
  createdAt: string;
  isBoosted: boolean;
  isLiked: boolean;
  authorName: string;
  trendingScore: number;
  replies?: Reply[];
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
}

interface GossipState {
  feed: Gossip[];
  userGossips: Gossip[];
  cache: Record<string, Gossip>;
  hasMore: boolean;
  isLoading: boolean;
  page: number;
  feedType: 'hot' | 'latest';
  error: string | null;
}

const initialState: GossipState = {
  feed: [],
  userGossips: [],
  cache: {},
  hasMore: true,
  isLoading: false,
  page: 1,
  feedType: 'hot',
  error: null,
};

const gossipSlice = createSlice({
  name: 'gossip',
  initialState,
  reducers: {
    setFeed: (state, action: PayloadAction<Gossip[]>) => {
      state.feed = action.payload;
      action.payload.forEach(gossip => {
        state.cache[gossip.id] = gossip;
      });
    },
    appendToFeed: (state, action: PayloadAction<Gossip[]>) => {
      state.feed = [...state.feed, ...action.payload];
      action.payload.forEach(gossip => {
        state.cache[gossip.id] = gossip;
      });
    },
    setUserGossips: (state, action: PayloadAction<Gossip[]>) => {
      state.userGossips = action.payload;
    },
    addGossip: (state, action: PayloadAction<Gossip>) => {
      state.feed.unshift(action.payload);
      state.cache[action.payload.id] = action.payload;
    },
    updateGossip: (state, action: PayloadAction<{ id: string; updates: Partial<Gossip> }>) => {
      const { id, updates } = action.payload;
      if (state.cache[id]) {
        state.cache[id] = { ...state.cache[id], ...updates };
      }
      state.feed = state.feed.map(gossip =>
        gossip.id === id ? { ...gossip, ...updates } : gossip
      );
    },
    removeGossip: (state, action: PayloadAction<string>) => {
      state.feed = state.feed.filter(g => g.id !== action.payload);
      delete state.cache[action.payload];
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setFeedType: (state, action: PayloadAction<'hot' | 'latest'>) => {
      state.feedType = action.payload;
      state.feed = [];
      state.page = 1;
      state.hasMore = true;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addReply: (state, action: PayloadAction<{ gossipId: string; reply: Reply }>) => {
      const { gossipId, reply } = action.payload;
      if (state.cache[gossipId]) {
        if (!state.cache[gossipId].replies) {
          state.cache[gossipId].replies = [];
        }
        state.cache[gossipId].replies!.push(reply);
        state.cache[gossipId].replyCount += 1;
      }
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const gossipId = action.payload;
      if (state.cache[gossipId]) {
        state.cache[gossipId].isLiked = !state.cache[gossipId].isLiked;
        state.cache[gossipId].likeCount += state.cache[gossipId].isLiked ? 1 : -1;
      }
    },
  },
});

export const {
  setFeed,
  appendToFeed,
  setUserGossips,
  addGossip,
  updateGossip,
  removeGossip,
  setHasMore,
  setLoading,
  setPage,
  setFeedType,
  setError,
  addReply,
  toggleLike,
} = gossipSlice.actions;

export default gossipSlice.reducer;