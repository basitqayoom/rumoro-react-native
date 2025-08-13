import apiClient from '../../store/api/apiClient';

export interface PersonProfile {
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
  isOwner?: boolean;
  channels?: Channel[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'preset' | 'user-created';
  gossipCount: number;
  isActive: boolean;
}

export interface ClaimResponse {
  success: boolean;
  buzzEarned: number;
}

export interface LinkResponse {
  success: boolean;
  platform: string;
}

export interface ProfileUpdate {
  bio?: string;
  avatar?: string;
}

class ProfileService {
  async getProfile(profileId: string): Promise<PersonProfile> {
    const response = await apiClient.get(`/profiles/${profileId}/`);
    return response.data;
  }

  async searchProfiles(query: string, platform?: string): Promise<PersonProfile[]> {
    const params: any = { search: query };
    if (platform) {
      params.platform = platform;
    }
    const response = await apiClient.get('/profiles/search/', { params });
    return response.data;
  }

  async getTrendingProfiles(): Promise<PersonProfile[]> {
    const response = await apiClient.get('/profiles/trending/');
    return response.data;
  }

  async claimProfile(profileId: string): Promise<ClaimResponse> {
    const response = await apiClient.post(`/profiles/${profileId}/claim/`);
    return response.data;
  }

  async linkSocialAccount(platform: string, token: string): Promise<LinkResponse> {
    const response = await apiClient.post(`/profiles/link-social/`, {
      platform,
      access_token: token,
    });
    return response.data;
  }

  async unlinkSocialAccount(profileId: string, platform: string): Promise<void> {
    await apiClient.delete(`/profiles/${profileId}/unlink-social/`, {
      data: { platform },
    });
  }

  async updateProfile(profileId: string, updates: ProfileUpdate): Promise<PersonProfile> {
    const response = await apiClient.patch(`/profiles/${profileId}/`, updates);
    return response.data;
  }

  async getMyProfiles(): Promise<PersonProfile[]> {
    const response = await apiClient.get('/profiles/', {
      params: { owned: true },
    });
    return response.data;
  }
}

export default new ProfileService();