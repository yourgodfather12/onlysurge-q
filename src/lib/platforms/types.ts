// Add missing types for enhanced platform integration
export interface PlatformAnalytics {
  earnings: {
    total: number;
    subscriptions: number;
    tips: number;
    messages: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  growth: {
    followers: {
      total: number;
      new: number;
      lost: number;
    };
    retention: number;
    conversionRate: number;
  };
  content: {
    total: number;
    performance: {
      top: PlatformPost[];
      trending: PlatformPost[];
    };
  };
}

export interface AutomationTask {
  id: string;
  type: 'post' | 'message' | 'engagement' | 'moderation';
  status: 'pending' | 'running' | 'completed' | 'failed';
  data: any;
  result?: any;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface ContentVaultItem extends PlatformPost {
  vault: {
    hash: string;
    metadata: Record<string, any>;
    platforms: {
      id: string;
      platform: string;
      status: string;
      url?: string;
    }[];
    moderation: {
      status: 'pending' | 'approved' | 'rejected';
      result?: {
        safe: boolean;
        categories: string[];
        score: number;
      };
    };
  };
}