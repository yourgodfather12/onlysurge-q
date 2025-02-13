import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { supabase } from '../../supabase';

// Fansly API response schemas
const profileSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  website: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
  subscriptionTiers: z.array(z.object({
    id: z.string(),
    price: z.number(),
    currency: z.string(),
    description: z.string().nullable(),
    benefits: z.array(z.string())
  })),
  stats: z.object({
    followers: z.number(),
    following: z.number(),
    posts: z.number(),
    likes: z.number()
  })
});

const postSchema = z.object({
  id: z.string(),
  content: z.string(),
  price: z.number().nullable(),
  isArchived: z.boolean(),
  isPinned: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  media: z.array(z.object({
    id: z.string(),
    type: z.enum(['image', 'video']),
    url: z.string(),
    thumbnail: z.string().nullable(),
    duration: z.number().nullable()
  })),
  stats: z.object({
    likes: z.number(),
    comments: z.number(),
    tips: z.number()
  })
});

export class FanslyAPI {
  private baseUrl = 'https://apiv3.fansly.com';
  private accessToken: string;
  private refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });

      if (response.status === 401) {
        await this.refreshAccessToken();
        // Retry request with new token
        return this.request(endpoint, options);
      }

      if (!response.ok) {
        throw new Error(`Fansly API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Fansly API request failed:', error);
      throw error;
    }
  }

  private async refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: this.refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;

      // Update token in database
      await supabase
        .from('platform_connections')
        .update({
          access_token: data.access_token,
          updated_at: new Date().toISOString()
        })
        .eq('platform', 'fansly')
        .eq('refresh_token', this.refreshToken);

    } catch (error) {
      console.error('Failed to refresh Fansly token:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const data = await this.request('/creator/profile');
      return profileSchema.parse(data);
    } catch (error) {
      console.error('Failed to fetch Fansly profile:', error);
      toast.error('Failed to fetch Fansly profile');
      throw error;
    }
  }

  async getPosts(options: { limit?: number; before?: string } = {}) {
    try {
      const params = new URLSearchParams({
        limit: (options.limit || 20).toString(),
        ...(options.before ? { before: options.before } : {})
      });

      const data = await this.request(`/posts?${params}`);
      return z.array(postSchema).parse(data);
    } catch (error) {
      console.error('Failed to fetch Fansly posts:', error);
      toast.error('Failed to fetch Fansly posts');
      throw error;
    }
  }

  async createPost(post: {
    content: string;
    price?: number;
    mediaIds: string[];
    schedule?: Date;
  }) {
    try {
      const response = await this.request('/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: post.content,
          price: post.price,
          media_ids: post.mediaIds,
          scheduled_for: post.schedule?.toISOString()
        })
      });

      return postSchema.parse(response);
    } catch (error) {
      console.error('Failed to create Fansly post:', error);
      toast.error('Failed to create Fansly post');
      throw error;
    }
  }

  async uploadMedia(file: File, onProgress?: (progress: number) => void) {
    try {
      // Get upload URL
      const { uploadUrl, mediaId } = await this.request('/media/upload-url', {
        method: 'POST',
        body: JSON.stringify({
          filename: file.name,
          mime_type: file.type
        })
      });

      // Upload file
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          onProgress?.(progress);
        }
      });

      await new Promise((resolve, reject) => {
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.open('PUT', uploadUrl);
        xhr.send(file);
      });

      // Confirm upload
      await this.request('/media/confirm', {
        method: 'POST',
        body: JSON.stringify({ media_id: mediaId })
      });

      return mediaId;
    } catch (error) {
      console.error('Failed to upload media to Fansly:', error);
      toast.error('Failed to upload media');
      throw error;
    }
  }

  async getMessages(options: { limit?: number; before?: string } = {}) {
    try {
      const params = new URLSearchParams({
        limit: (options.limit || 20).toString(),
        ...(options.before ? { before: options.before } : {})
      });

      return this.request(`/messages?${params}`);
    } catch (error) {
      console.error('Failed to fetch Fansly messages:', error);
      toast.error('Failed to fetch messages');
      throw error;
    }
  }

  async sendMessage(userId: string, content: string, attachments: string[] = []) {
    try {
      return this.request('/messages', {
        method: 'POST',
        body: JSON.stringify({
          recipient_id: userId,
          content,
          media_ids: attachments
        })
      });
    } catch (error) {
      console.error('Failed to send Fansly message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  }

  // Store connection in database
  static async saveConnection(userId: string, data: any) {
    try {
      const { error } = await supabase
        .from('platform_connections')
        .upsert({
          creator_id: userId,
          platform: 'fansly',
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          username: data.username,
          profile_url: `https://fansly.com/${data.username}`,
          metadata: data
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save Fansly connection:', error);
      throw error;
    }
  }

  // Get connection from database
  static async getConnection(userId: string) {
    try {
      const { data, error } = await supabase
        .from('platform_connections')
        .select('*')
        .eq('creator_id', userId)
        .eq('platform', 'fansly')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get Fansly connection:', error);
      return null;
    }
  }
}