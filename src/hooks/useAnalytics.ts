import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  getAnalytics,
  getContentPerformance,
  trackEvent
} from '../lib/api/analytics';

export function useAnalytics(timeRange?: string) {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery(
    ['analytics', user?.id, timeRange],
    () => getAnalytics(user!.id, timeRange),
    {
      enabled: !!user
    }
  );

  return {
    analytics: data,
    isLoading,
    error
  };
}

export function useContentPerformance(contentId: string) {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery(
    ['content-performance', user?.id, contentId],
    () => getContentPerformance(user!.id, contentId),
    {
      enabled: !!user && !!contentId
    }
  );

  return {
    performance: data,
    isLoading,
    error
  };
}

export function useTrackEvent() {
  const { user } = useAuth();

  return {
    trackEvent: (eventType: string, metadata?: any) => {
      if (user) {
        trackEvent(user.id, eventType, metadata);
      }
    }
  };
}