import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  syncContent,
  getSyncStatus,
  cancelSync
} from '../lib/sync/contentSync';

export function useSync() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const syncMutation = useMutation(
    (options: Parameters<typeof syncContent>[1]) =>
      syncContent(user!.id, options),
    {
      onSuccess: (jobId) => {
        queryClient.invalidateQueries(['sync-status', jobId]);
      }
    }
  );

  const cancelMutation = useMutation(
    (jobId: string) => cancelSync(jobId),
    {
      onSuccess: (_, jobId) => {
        queryClient.invalidateQueries(['sync-status', jobId]);
      }
    }
  );

  return {
    startSync: syncMutation.mutate,
    cancelSync: cancelMutation.mutate,
    isSyncing: syncMutation.isLoading,
    isCancelling: cancelMutation.isLoading,
    error: syncMutation.error || cancelMutation.error
  };
}

export function useSyncStatus(jobId?: string) {
  const { data: status, isLoading, error } = useQuery(
    ['sync-status', jobId],
    () => getSyncStatus(jobId!),
    {
      enabled: !!jobId,
      refetchInterval: (data) =>
        data?.status === 'completed' || data?.status === 'failed'
          ? false
          : 5000
    }
  );

  return {
    status,
    isLoading,
    error
  };
}