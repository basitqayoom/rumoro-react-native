import apiClient from '../../store/api/apiClient';

export interface Channel {
  id: string;
  profileId: string;
  name: string;
  type: 'preset' | 'user-created';
  gossipCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateChannelDto {
  name: string;
  profileId: string;
}

class ChannelService {
  async getChannels(profileId: string): Promise<Channel[]> {
    const response = await apiClient.get('/channels/', {
      params: { profile_id: profileId },
    });
    return response.data;
  }

  async getChannel(channelId: string): Promise<Channel> {
    const response = await apiClient.get(`/channels/${channelId}/`);
    return response.data;
  }

  async createChannel(data: CreateChannelDto): Promise<Channel> {
    const response = await apiClient.post('/channels/', {
      name: data.name,
      profile_id: data.profileId,
    });
    return response.data;
  }

  async updateChannel(channelId: string, name: string): Promise<Channel> {
    const response = await apiClient.patch(`/channels/${channelId}/`, {
      name,
    });
    return response.data;
  }

  async disableChannel(channelId: string): Promise<void> {
    await apiClient.delete(`/channels/${channelId}/`);
  }
}

export default new ChannelService();