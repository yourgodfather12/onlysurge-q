import useSWR from 'swr';
import { supabase } from '../lib/supabase';

interface SubscriptionAnalytics {
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

async function fetchAnalytics(): Promise<SubscriptionAnalytics> {
  const { data, error } = await supabase
    .rpc('get_subscription_analytics');

  if (error) throw error;
  return data;
}

export function useSubscriptionAnalytics() {
  const { data, error } = useSWR(
    'subscription-analytics',
    fetchAnalytics,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: false
    }
  );

  return {
    data,
    loading: !error && !data,
    error
  };
}