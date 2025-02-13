import useSWR from 'swr';
import { getSubscriptionStatus } from '../lib/stripe';

export function useSubscription() {
  const { data, error, mutate } = useSWR(
    'subscription',
    () => getSubscriptionStatus(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    subscription: data,
    loading: !error && !data,
    error,
    mutate
  };
}