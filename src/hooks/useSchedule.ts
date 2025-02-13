import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  getScheduledPosts,
  createScheduledPost,
  updateScheduledPost,
  deleteScheduledPost
} from '../lib/api/scheduling';
import type { ScheduledPost } from '../types/database';

export function useSchedule(options?: Parameters<typeof getScheduledPosts>[1]) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: scheduledPosts, isLoading, error } = useQuery(
    ['schedule', user?.id, options],
    () => getScheduledPosts(user!.id, options),
    {
      enabled: !!user
    }
  );

  const createMutation = useMutation(
    (post: Omit<ScheduledPost, 'id' | 'created_at' | 'updated_at'>) =>
      createScheduledPost(post),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['schedule', user?.id]);
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, updates }: { id: string; updates: Partial<ScheduledPost> }) =>
      updateScheduledPost(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['schedule', user?.id]);
      }
    }
  );

  const deleteMutation = useMutation(
    (id: string) => deleteScheduledPost(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['schedule', user?.id]);
      }
    }
  );

  return {
    scheduledPosts,
    isLoading,
    error,
    createScheduledPost: createMutation.mutate,
    updateScheduledPost: updateMutation.mutate,
    deleteScheduledPost: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
}