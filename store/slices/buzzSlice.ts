import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BuzzTransaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  metadata?: any;
  balanceAfter: number;
  createdAt: string;
}

interface BuzzState {
  balance: number;
  transactions: BuzzTransaction[];
  dailyRewardClaimed: boolean;
  lastClaimDate: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BuzzState = {
  balance: 0,
  transactions: [],
  dailyRewardClaimed: false,
  lastClaimDate: null,
  isLoading: false,
  error: null,
};

const buzzSlice = createSlice({
  name: 'buzz',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    updateBalance: (state, action: PayloadAction<{ amount: number; type: 'earn' | 'spend' }>) => {
      const { amount, type } = action.payload;
      state.balance += type === 'earn' ? amount : -amount;
    },
    setTransactions: (state, action: PayloadAction<BuzzTransaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<BuzzTransaction>) => {
      state.transactions.unshift(action.payload);
      state.balance = action.payload.balanceAfter;
    },
    setDailyRewardClaimed: (state, action: PayloadAction<boolean>) => {
      state.dailyRewardClaimed = action.payload;
    },
    setLastClaimDate: (state, action: PayloadAction<string>) => {
      state.lastClaimDate = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBalance,
  updateBalance,
  setTransactions,
  addTransaction,
  setDailyRewardClaimed,
  setLastClaimDate,
  setLoading,
  setError,
} = buzzSlice.actions;

export default buzzSlice.reducer;