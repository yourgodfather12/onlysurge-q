import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  getWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook
} from '../lib/api/webhooks';

export function useWebhooks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: webhooks, isLoading, error } = useQuery(
    ['webhooks', user?.id],
    () => getWebhooks(user!.id),
    {
      enabled: !!user
    }
  );

  const createMutation = useMutation(
    ({ url, events }: { url: string; events: string[] }) =>
      createWebhook(user!.id, url, events),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['webhooks', user?.id]);
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, updates }: { id: string; updates: any }) =>
      updateWebhook(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['webhooks', user?.id]);
      }
    }
  );

  const deleteMutation = useMutation(
    (id: string) => deleteWebhook(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['webhooks', user?.id]);
      }
    }
  );

  const testMutation = useMutation(
    (webhook: any) => testWebhook(webhook)
  );

  return {
    webhooks,
    isLoading,
    error,
    createWebhook: createMutation.mutate,
    updateWebhook: updateMutation.mutate,
    deleteWebhook: deleteMutation.mutate,
    testWebhook: testMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    isTesting: testMutation.isLoading
  };
}