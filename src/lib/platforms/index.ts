import { OnlyFansAPI } from './onlyfans';
import { FanslyAPI } from './fansly';
import type { PlatformConnection, PlatformStats, PlatformPost } from './types';

// Platform registry
const platforms = {
  onlyfans: OnlyFansAPI,
  fansly: FanslyAPI
};

// Platform manager for handling multiple platform connections
export class PlatformManager {
  private connections: Map<string, any> = new Map();

  constructor(connections: PlatformConnection[]) {
    connections.forEach(connection => {
      const PlatformAPI = platforms[connection.platform as keyof typeof platforms];
      if (PlatformAPI) {
        this.connections.set(connection.platform, new PlatformAPI(connection.accessToken));
      }
    });
  }

  // Get stats from all connected platforms
  async getAllStats(): Promise<Record<string, PlatformStats>> {
    const stats: Record<string, PlatformStats> = {};
    
    for (const [platform, api] of this.connections.entries()) {
      try {
        stats[platform] = await api.getStats();
      } catch (error) {
        console.error(`Failed to get stats for ${platform}:`, error);
      }
    }

    return stats;
  }

  // Create a post across multiple platforms
  async createPost(post: Partial<PlatformPost>, targetPlatforms?: string[]): Promise<PlatformPost[]> {
    const platforms = targetPlatforms || Array.from(this.connections.keys());
    const posts: PlatformPost[] = [];

    for (const platform of platforms) {
      const api = this.connections.get(platform);
      if (api) {
        try {
          const createdPost = await api.createPost(post);
          posts.push(createdPost);
        } catch (error) {
          console.error(`Failed to create post on ${platform}:`, error);
        }
      }
    }

    return posts;
  }

  // Upload media to multiple platforms
  async uploadMedia(file: File, targetPlatforms?: string[]): Promise<Record<string, string>> {
    const platforms = targetPlatforms || Array.from(this.connections.keys());
    const urls: Record<string, string> = {};

    for (const platform of platforms) {
      const api = this.connections.get(platform);
      if (api) {
        try {
          urls[platform] = await api.uploadMedia(file);
        } catch (error) {
          console.error(`Failed to upload media to ${platform}:`, error);
        }
      }
    }

    return urls;
  }

  // Get posts from all platforms
  async getAllPosts(page = 1, limit = 20): Promise<Record<string, PlatformPost[]>> {
    const posts: Record<string, PlatformPost[]> = {};

    for (const [platform, api] of this.connections.entries()) {
      try {
        posts[platform] = await api.getPosts(page, limit);
      } catch (error) {
        console.error(`Failed to get posts from ${platform}:`, error);
      }
    }

    return posts;
  }

  // Check if a platform is connected
  isConnected(platform: string): boolean {
    return this.connections.has(platform);
  }

  // Get a specific platform API instance
  getPlatformAPI(platform: string): any {
    return this.connections.get(platform);
  }
}

// Export platform-specific APIs
export { OnlyFansAPI, FanslyAPI };
export type { PlatformConnection, PlatformStats, PlatformPost };