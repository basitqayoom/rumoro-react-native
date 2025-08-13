import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../index';
import { updateTokens, logout } from '../slices/authSlice';
import { showToast } from '../slices/uiSlice';
import ENV from '../../config/environment';

const API_BASE_URL = ENV.API_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        store.dispatch(logout());
        processQueue(error, null);
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh_token: refreshToken,
        });

        const { token, refresh_token } = response.data;
        await AsyncStorage.setItem('authToken', token);
        if (refresh_token) {
          await AsyncStorage.setItem('refreshToken', refresh_token);
        }

        store.dispatch(updateTokens({ token, refreshToken: refresh_token }));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        processQueue(null, token);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 500) {
      store.dispatch(showToast({
        message: 'Server error. Please try again later.',
        type: 'error',
      }));
    } else if (error.response?.status === 403) {
      store.dispatch(showToast({
        message: 'You do not have permission to perform this action.',
        type: 'error',
      }));
    } else if (!error.response && error.message === 'Network Error') {
      store.dispatch(showToast({
        message: 'No internet connection. Please check your network.',
        type: 'error',
      }));
    }

    return Promise.reject(error);
  }
);

export default apiClient;