import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { supabase } from '../../supabase';

// OnlyFans API response schemas
const profileSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string().nullable(),
  about: z.string().nullable(),
  joinDate: z.string(),
  location: z.string().nullable(),
  website: z.string().nullable(),
  wishlist: z.string().nullable(),
  listsCount: z.number(),
  photosCount: z.number(),
  videosCount: z.number(),
  favoritesCount: z.number(),
  avatarUrl: z.string().nullable(),
  headerUrl: z.string().nullable(),
  subscriptionPrice: z.number(),
  subscriptionBundles: z.array(z.object({
    months: z.number(),
    price: z.number(),
    discount: z.number()
  }))
});

const postSchema = z.object({
  id: z.string(),
  text: z.string(),
  price: z.number().nullable(),
  isArchived: z.boolean(),
  isDeleted: z.boolean(),
  isPinned: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  media: z.array(z.object({
    id: z.string(),
    type: z.enum(['photo', 'video']),
    url: z.string(),
    preview: z.string().nullable(),
    squarePreview: z.string().nullable(),
    source: z.object({
      source: z.string(),
      width: z.number(),
      height: z.number()
    }).nullable()
  }))
});

export class OnlyFansAPI {
  private baseUrl = 'https://onlyfans.com/api/v2';
  private userId: string;
  private sessionCookie: string;
  private dynamicRules: any;

  constructor(userId: string, sessionCookie: string) {
    this.userId = userId;
    this.sessionCookie = sessionCookie;
    this.dynamicRules = {};
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      // Add required headers and auth
      const headers = {
        'Accept': 'application/json',
        'Cookie': this.sessionCookie,
        'User-Agent': 'OnlySurge/1.0',
        ...this.getDynamicHeaders(endpoint),
        ...options.headers
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`OnlyFans API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('OnlyFans API request failed:', error);
      throw error;
    }
  }

  private getDynamicHeaders(endpoint: string) {
    // Implementation of dynamic rules for headers
    // This is required to bypass OnlyFans API protection
    return {
      'sign': this.dynamicRules.sign || '',
      'time': this.dynamicRules.time || Date.now().toString()
    };
  }

  async getProfile() {
    try {
      const data = await this.request('/users/me');
      return profileSchema.parse(data);
    } catch (error) {
      console.error('Failed to fetch OnlyFans profile:', error);
      toast.error('Failed to fetch OnlyFans profile');
      throw error;
    }
  }

  async getPosts(options: { limit?: number; before?: string } = {}) {
    try {
      const params = new URLSearchParams({
        limit: (options.limit || 20).toString(),
        ...(options.before ? { before: options.before } : {})
      });

      const data = await this.request(`/posts/me?${params}`);
      return z.array(postSchema).parse(data);
    } catch (error) {
      console.error('Failed to fetch OnlyFans posts:', error);
      toast.error('Failed to fetch OnlyFans posts');
      throw error;
    }
  }

  async createPost(post: {
    text: string;
    price?: number;
    mediaIds: string[];
    schedule?: Date;
  }) {
    try {
      // Show warning about manual posting
      toast.error('OnlyFans posts must be created manually. Please visit OnlyFans to post content.');
      throw new Error('Direct posting to OnlyFans is not supported');
    } catch (error) {
      console.error('Failed to create OnlyFans post:', error);
      throw error;
    }
  }

  async uploadMedia(file: File) {
    try {
      // Show warning about manual upload
      toast.error('Media must be uploaded manually on OnlyFans');
      throw new Error('Direct media upload to OnlyFans is not supported');
    } catch (error) {
      console.error('Failed to upload media to OnlyFans:', error);
      throw error;
    }
  }

  async getMessages(options: { limit?: number; before?: string } = {}) {
    try {
      const params = new URLSearchParams({
        limit: (options.limit || 20).toString(),
        ...(options.before ? { before: options.before } : {})
      });

      const data = await this.request(`/messages?${params}`);
      // Parse and validate message data
      return data;
    } catch (error) {
      console.error('Failed to fetch OnlyFans messages:', error);
      toast.error('Failed to fetch OnlyFans messages');
      throw error;
    }
  }

  async sendMessage(userId: string, message: string) {
    try {
      // Show warning about manual messaging
      toast.error('Messages must be sent manually on OnlyFans');
      throw new Error('Direct messaging on OnlyFans is not supported');
    } catch (error) {
      console.error('Failed to send OnlyFans message:', error);
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
          platform: 'onlyfans',
          access_token: data.sessionCookie,
          username: data.username,
          profile_url: `https://onlyfans.com/${data.username}`,
          metadata: data
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save OnlyFans connection:', error);
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
        .eq('platform', 'onlyfans')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get OnlyFans connection:', error);
      return null;
    }
  }
}