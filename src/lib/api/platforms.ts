import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';
import type { PlatformConnection } from '../platforms/types';

export async function getPlatformConnections(userId: string) {
  try {
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('creator_id', userId);

    if (error) throw error;

    return data as PlatformConnection[];
  } catch (error) {
    console.error('Error fetching platform connections:', error);
    toast.error('Failed to fetch platform connections');
    throw error;
  }
}

export async function createPlatformConnection(
  connection: Omit<PlatformConnection, 'id' | 'created_at' | 'updated_at'>
) {
  try {
    const { data, error } = await supabase
      .from('platform_connections')
      .insert(connection)
      .select()
      .single();

    if (error) throw error;

    toast.success('Platform connected successfully');
    return data as PlatformConnection;
  } catch (error) {
    console.error('Error creating platform connection:', error);
    toast.error('Failed to connect platform');
    throw error;
  }
}

export async function updatePlatformConnection(
  id: string,
  updates: Partial<PlatformConnection>
) {
  try {
    const { data, error } = await supabase
      .from('platform_connections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    toast.success('Platform connection updated');
    return data as PlatformConnection;
  } catch (error) {
    console.error('Error updating platform connection:', error);
    toast.error('Failed to update platform connection');
    throw error;
  }
}

export async function deletePlatformConnection(id: string) {
  try {
    const { error } = await supabase
      .from('platform_connections')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast.success('Platform disconnected successfully');
  } catch (error) {
    console.error('Error deleting platform connection:', error);
    toast.error('Failed to disconnect platform');
    throw error;
  }
}