import useSWR from 'swr';
import { getUsageMetrics, type UsageMetrics } from '../lib/usage';

export function useUsage() {
  const { data, error } = useSWR<UsageMetrics>(
    'usage-metrics',
    () => getUsageMetrics(),
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: false
    }
  );

  return {
    usage: data,
    loading: !error && !data,
    error
  };
}