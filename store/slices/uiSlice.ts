import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isAppLoading: boolean;
  isRefreshing: boolean;
  activeTab: string;
  modals: {
    isReportModalOpen: boolean;
    isChannelModalOpen: boolean;
    isImagePickerOpen: boolean;
  };
  toasts: Toast[];
  networkStatus: 'online' | 'offline';
  appState: 'active' | 'background' | 'inactive';
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const initialState: UIState = {
  isAppLoading: false,
  isRefreshing: false,
  activeTab: 'home',
  modals: {
    isReportModalOpen: false,
    isChannelModalOpen: false,
    isImagePickerOpen: false,
  },
  toasts: [],
  networkStatus: 'online',
  appState: 'active',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.isAppLoading = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    showToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString(),
        duration: action.payload.duration || 3000,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    setNetworkStatus: (state, action: PayloadAction<'online' | 'offline'>) => {
      state.networkStatus = action.payload;
    },
    setAppState: (state, action: PayloadAction<'active' | 'background' | 'inactive'>) => {
      state.appState = action.payload;
    },
  },
});

export const {
  setAppLoading,
  setRefreshing,
  setActiveTab,
  openModal,
  closeModal,
  showToast,
  removeToast,
  setNetworkStatus,
  setAppState,
} = uiSlice.actions;

export default uiSlice.reducer;