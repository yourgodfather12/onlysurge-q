import { PlatformConfig, PlatformConnection, PlatformStats, PlatformPost } from './types';

// Fansly API configuration
const config: PlatformConfig = {
  clientId: import.meta.env.VITE_FANSLY_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_FANSLY_CLIENT_SECRET || '',
  redirectUri: `${window.location.origin}/auth/fansly/callback`,
  scopes: ['basic', 'post', 'message']
};

// Fansly API wrapper using their official API
// Documentation: https://developers.fansly.com
export class FanslyAPI {
  private accessToken: string;
  private baseUrl = 'https://api.fansly.com/v1';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Fansly API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  static async authorize(code: string): Promise<PlatformConnection> {
    const response = await fetch('https://api.fansly.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error('Failed to authorize with Fansly');
    }

    const data = await response.json();
    return {
      id: data.user_id,
      platform: 'fansly',
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      username: data.username,
      profileUrl: data.profile_url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Profile and Stats
  async getStats(): Promise<PlatformStats> {
    const data = await this.request('/creator/stats');
    return {
      followers: data.followers_count,
      posts: data.posts_count,
      engagement: data.engagement_rate,
      revenue: data.total_earnings
    };
  }

  // Content Management
  async getPosts(page = 1, limit = 20): Promise<PlatformPost[]> {
    const data = await this.request(`/posts?page=${page}&limit=${limit}`);
    return data.posts.map((post: any) => ({
      id: post.id,
      platform: 'fansly',
      content: post.content,
      mediaUrls: post.media_urls,
      status: post.status,
      stats: {
        likes: post.likes_count,
        comments: post.comments_count,
        views: post.views_count,
        revenue: post.earnings
      }
    }));
  }

  async createPost(post: Partial<PlatformPost>): Promise<PlatformPost> {
    const data = await this.request('/posts', {
      method: 'POST',
      body: JSON.stringify({
        content: post.content,
        media_urls: post.mediaUrls,
        schedule_time: post.scheduledTime
      })
    });

    return {
      id: data.id,
      platform: 'fansly',
      content: data.content,
      mediaUrls: data.media_urls,
      status: data.status,
      scheduledTime: data.schedule_time
    };
  }

  // Media Upload
  async uploadMedia(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const data = await this.request('/media/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return data.url;
  }

  // Messages
  async getMessages(page = 1, limit = 20) {
    return this.request(`/messages?page=${page}&limit=${limit}`);
  }

  async sendMessage(userId: string, content: string, attachments: string[] = []) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({
        recipient_id: userId,
        content,
        media_urls: attachments
      })
    });
  }
}