import apiClient from '../../store/api/apiClient';

export interface BuzzTransaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  metadata?: any;
  balanceAfter: number;
  createdAt: string;
}

export interface BuzzBalance {
  balance: number;
  dailyStreak: number;
  lastClaimDate: string | null;
}

class BuzzService {
  async getBalance(): Promise<BuzzBalance> {
    const response = await apiClient.get('/users/me/buzz-balance/');
    return response.data;
  }

  async getTransactionHistory(filter?: 'all' | 'earn' | 'spend'): Promise<BuzzTransaction[]> {
    const params = filter && filter !== 'all' ? { type: filter } : {};
    const response = await apiClient.get('/users/me/transactions/', { params });
    return response.data;
  }

  async claimDailyReward(): Promise<BuzzTransaction> {
    const response = await apiClient.post('/buzz/claim-daily/');
    return response.data;
  }

  async spendBuzz(amount: number, reason: string, metadata?: any): Promise<BuzzTransaction> {
    const response = await apiClient.post('/buzz/spend/', {
      amount,
      reason,
      metadata,
    });
    return response.data;
  }
}

export default new BuzzService();