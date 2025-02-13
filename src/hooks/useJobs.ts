import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  getJobs,
  createJob,
  cancelJob,
  retryJob
} from '../lib/api/jobs';

export function useJobs(options?: {
  type?: 'post' | 'message' | 'sync';
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  limit?: number;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: jobs, isLoading, error } = useQuery(
    ['jobs', user?.id, options],
    () => getJobs(user!.id, options),
    {
      enabled: !!user
    }
  );

  const createMutation = useMutation(
    ({ type, data, scheduledFor }: { type: string; data: any; scheduledFor?: Date }) =>
      createJob(user!.id, type as any, data, scheduledFor),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['jobs', user?.id]);
      }
    }
  );

  const cancelMutation = useMutation(
    (id: string) => cancelJob(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['jobs', user?.id]);
      }
    }
  );

  const retryMutation = useMutation(
    (id: string) => retryJob(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['jobs', user?.id]);
      }
    }
  );

  return {
    jobs,
    isLoading,
    error,
    createJob: createMutation.mutate,
    cancelJob: cancelMutation.mutate,
    retryJob: retryMutation.mutate,
    isCreating: createMutation.isLoading,
    isCanceling: cancelMutation.isLoading,
    isRetrying: retryMutation.isLoading
  };
}