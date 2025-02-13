import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount
} from '../lib/api/messages';

export function useMessages(subscriberId: string, options?: Parameters<typeof getMessages>[2]) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery(
    ['messages', user?.id, subscriberId, options],
    () => getMessages(user!.id, subscriberId, options),
    {
      enabled: !!user && !!subscriberId
    }
  );

  const sendMutation = useMutation(
    (content: string) =>
      sendMessage({
        creator_id: user!.id,
        subscriber_id: subscriberId,
        content,
        is_read: false
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', user?.id, subscriberId]);
      }
    }
  );

  const markAsReadMutation = useMutation(
    () => markMessagesAsRead(user!.id, subscriberId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', user?.id, subscriberId]);
        queryClient.invalidateQueries(['unread-count', user?.id]);
      }
    }
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    isSending: sendMutation.isLoading
  };
}

export function useUnreadCount() {
  const { user } = useAuth();

  const { data: unreadCount, isLoading, error } = useQuery(
    ['unread-count', user?.id],
    () => getUnreadCount(user!.id),
    {
      enabled: !!user
    }
  );

  return {
    unreadCount: unreadCount || 0,
    isLoading,
    error
  };
}