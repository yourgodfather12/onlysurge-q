import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { OnlyFansAPI } from '../lib/api/platforms/onlyfans';
import { FanslyAPI } from '../lib/api/platforms/fansly';
import {
  getPlatformConnections,
  createPlatformConnection,
  updatePlatformConnection,
  deletePlatformConnection
} from '../lib/api/platforms';

export function usePlatformConnections() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: connections, isLoading, error } = useQuery(
    ['platform-connections', user?.id],
    () => getPlatformConnections(user!.id),
    {
      enabled: !!user
    }
  );

  const createMutation = useMutation(
    (connection: Parameters<typeof createPlatformConnection>[0]) =>
      createPlatformConnection(connection),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['platform-connections', user?.id]);
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, updates }: Parameters<typeof updatePlatformConnection>[0]) =>
      updatePlatformConnection(id, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['platform-connections', user?.id]);
      }
    }
  );

  const deleteMutation = useMutation(
    (id: string) => deletePlatformConnection(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['platform-connections', user?.id]);
      }
    }
  );

  return {
    connections,
    isLoading,
    error,
    createConnection: createMutation.mutate,
    updateConnection: updateMutation.mutate,
    deleteConnection: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
}

export function useOnlyFans() {
  const { user } = useAuth();

  const { data: connection, isLoading } = useQuery(
    ['onlyfans-connection', user?.id],
    () => OnlyFansAPI.getConnection(user!.id),
    {
      enabled: !!user
    }
  );

  const api = connection ? new OnlyFansAPI(user!.id, connection.access_token) : null;

  return {
    isConnected: !!connection,
    isLoading,
    api
  };
}

export function useFansly() {
  const { user } = useAuth();

  const { data: connection, isLoading } = useQuery(
    ['fansly-connection', user?.id],
    () => FanslyAPI.getConnection(user!.id),
    {
      enabled: !!user
    }
  );

  const api = connection
    ? new FanslyAPI(connection.access_token, connection.refresh_token)
    : null;

  return {
    isConnected: !!connection,
    isLoading,
    api
  };
}