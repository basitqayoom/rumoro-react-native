import apiClient from '../../store/api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthResponse {
  user: {
    id: string;
    phoneNumber: string;
    buzzScore: number;
    dailyStreak: number;
    createdAt: string;
    lastActiveAt: string;
  };
  token: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface TokenResponse {
  token: string;
  refreshToken?: string;
}

class AuthService {
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/auth/send-otp/', { phone_number: phoneNumber });
    return response.data;
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/verify-otp/', {
      phone_number: phoneNumber,
      otp,
    });
    
    await AsyncStorage.setItem('authToken', response.data.token);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post('/auth/refresh/', {
      refresh_token: refreshToken,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
    }
  }

  async googleSignIn(googleToken: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/google/', {
      google_token: googleToken,
    });
    
    await AsyncStorage.setItem('authToken', response.data.token);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    
    return response.data;
  }
}

export default new AuthService();