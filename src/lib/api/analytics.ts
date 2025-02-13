import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';

interface AnalyticsMetrics {
  revenue: {
    monthly: number;
    growth: number;
  };
  subscribers: {
    active: number;
    growth: number;
  };
  churnRate: number;
  churnRateChange: number;
  avgSubscriptionLength: number;
  avgSubscriptionLengthChange: number;
  revenueData: Array<{
    date: string;
    value: number;
  }>;
  planDistribution: Array<{
    name: string;
    percentage: number;
  }>;
  retentionCohorts: Array<{
    date: string;
    size: number;
    retention: {
      month1: number;
      month3: number;
      month6: number;
      month12: number;
    };
  }>;
}

export async function getAnalytics(userId: string, timeRange: string = '30d'): Promise<AnalyticsMetrics> {
  try {
    const { data, error } = await supabase.rpc('get_subscription_analytics', {
      p_user_id: userId,
      p_time_range: timeRange
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    toast.error('Failed to fetch analytics');
    throw error;
  }
}

export async function getContentPerformance(userId: string, contentId: string) {
  try {
    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('creator_id', userId)
      .eq('content_id', contentId)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching content performance:', error);
    toast.error('Failed to fetch content performance');
    throw error;
  }
}

export async function trackEvent(userId: string, eventType: string, metadata: any = {}) {
  try {
    const { error } = await supabase
      .from('analytics_data')
      .insert({
        creator_id: userId,
        event_type: eventType,
        metadata
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking event:', error);
    // Don't show toast for tracking errors
  }
}