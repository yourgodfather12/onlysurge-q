import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  getContentItems,
  createContentItem,
  updateContentItem,
  deleteContentItem
} from '../lib/api/content';
import type { ContentItem } from '../types/database';

export function useContent(options?: Parameters<typeof getContentItems>[1]) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ['content', user?.id, options],
    () => getContentItems(user!.id, options),
    {
      enabled: !!user
    }
  );

  const createMutation = useMutation(
    (content: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) =>
      createContentItem(content),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['content', user?.id]);
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, updates }: { id: string; updates: Partial<ContentItem> }) =>
      updateContentItem(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['content', user?.id]);
      }
    }
  );

  const deleteMutation = useMutation(
    (id: string) => deleteContentItem(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['content', user?.id]);
      }
    }
  );

  return {
    content: data?.items || [],
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    error,
    createContent: createMutation.mutate,
    updateContent: updateMutation.mutate,
    deleteContent: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
}