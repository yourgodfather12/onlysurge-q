import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

export interface UsageMetrics {
  storage: {
    used: number;
    limit: number;
  };
  posts: {
    count: number;
    limit: number;
  };
  automations: {
    active: number;
    limit: number;
  };
  apiCalls: {
    count: number;
    limit: number;
  };
}

export async function getUsageMetrics(): Promise<UsageMetrics> {
  try {
    const { data, error } = await supabase
      .rpc('get_usage_metrics');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch usage metrics:', error);
    throw error;
  }
}

export async function checkUsageLimit(
  type: keyof UsageMetrics,
  increment = 1
): Promise<boolean> {
  try {
    const { data: allowed, error } = await supabase
      .rpc('check_usage_limit', {
        p_type: type,
        p_increment: increment
      });

    if (error) throw error;

    if (!allowed) {
      toast.error(`You've reached your ${type} limit. Please upgrade your plan.`);
    }

    return allowed;
  } catch (error) {
    console.error('Failed to check usage limit:', error);
    return false;
  }
}

export async function trackUsage(
  type: keyof UsageMetrics,
  amount = 1
): Promise<void> {
  try {
    const { error } = await supabase
      .rpc('track_usage', {
        p_type: type,
        p_amount: amount
      });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to track usage:', error);
  }
}