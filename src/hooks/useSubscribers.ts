import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  getSubscribers,
  getSubscriberStats,
  getSubscriberDetails
} from '../lib/api/subscribers';

export function useSubscribers(options?: Parameters<typeof getSubscribers>[1]) {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery(
    ['subscribers', user?.id, options],
    () => getSubscribers(user!.id, options),
    {
      enabled: !!user
    }
  );

  return {
    subscribers: data?.subscribers || [],
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    error
  };
}

export function useSubscriberStats() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery(
    ['subscriber-stats', user?.id],
    () => getSubscriberStats(user!.id),
    {
      enabled: !!user
    }
  );

  return {
    stats: data,
    isLoading,
    error
  };
}

export function useSubscriberDetails(subscriberId: string) {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery(
    ['subscriber-details', user?.id, subscriberId],
    () => getSubscriberDetails(user!.id, subscriberId),
    {
      enabled: !!user && !!subscriberId
    }
  );

  return {
    details: data,
    isLoading,
    error
  };
}