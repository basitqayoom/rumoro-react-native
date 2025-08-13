import apiClient from '../../store/api/apiClient';

export interface Gossip {
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

export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
}

export interface GossipFeed {
  results: Gossip[];
  hasMore: boolean;
  page: number;
}

export interface CreateGossipDto {
  content: string;
  profileId: string;
  channelId: string;
  imageUrl?: string;
}

class GossipService {
  async getFeed(page: number = 1, type: 'hot' | 'latest' = 'hot'): Promise<GossipFeed> {
    const response = await apiClient.get('/gossips/feed/', {
      params: { page, type },
    });
    return response.data;
  }

  async getGossipsByProfile(profileId: string, channelId?: string): Promise<Gossip[]> {
    const params: any = { profile_id: profileId };
    if (channelId) {
      params.channel_id = channelId;
    }
    const response = await apiClient.get('/gossips/', { params });
    return response.data;
  }

  async getGossip(gossipId: string): Promise<Gossip> {
    const response = await apiClient.get(`/gossips/${gossipId}/`);
    return response.data;
  }

  async createGossip(data: CreateGossipDto): Promise<Gossip> {
    const response = await apiClient.post('/gossips/', {
      content: data.content,
      profile_id: data.profileId,
      channel_id: data.channelId,
      image_url: data.imageUrl,
    });
    return response.data;
  }

  async deleteGossip(gossipId: string): Promise<void> {
    await apiClient.delete(`/gossips/${gossipId}/`);
  }

  async likeGossip(gossipId: string): Promise<{ liked: boolean }> {
    const response = await apiClient.post(`/gossips/${gossipId}/like/`);
    return response.data;
  }

  async createReply(gossipId: string, content: string): Promise<Reply> {
    const response = await apiClient.post(`/gossips/${gossipId}/reply/`, {
      content,
    });
    return response.data;
  }

  async reportContent(targetId: string, type: 'gossip' | 'reply', reason: string): Promise<void> {
    await apiClient.post(`/gossips/${targetId}/report/`, {
      type,
      reason,
    });
  }

  async hideGossip(gossipId: string): Promise<void> {
    await apiClient.post(`/gossips/${gossipId}/hide/`);
  }

  async boostGossip(gossipId: string, duration: number = 24): Promise<Gossip> {
    const response = await apiClient.post(`/gossips/${gossipId}/boost/`, {
      duration_hours: duration,
    });
    return response.data;
  }
}

export default new GossipService();