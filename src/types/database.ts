export interface CreatorProfile {
  id: string;
  onlyfans_username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  subscription_price: number;
  total_earnings: number;
  total_subscribers: number;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  ai_caption: string | null;
  ai_hashtags: string[];
  ai_best_time: string | null;
  ai_engagement_score: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduledPost {
  id: string;
  creator_id: string;
  content_id: string;
  scheduled_time: string;
  caption: string | null;
  status: 'pending' | 'published' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface MessageTemplate {
  id: string;
  creator_id: string;
  name: string;
  template: string;
  keywords: string[];
  is_auto_reply: boolean;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  creator_id: string;
  title: string;
  url: string;
  icon: string;
  order: number;
  is_active: boolean;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  total_subscribers: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
}