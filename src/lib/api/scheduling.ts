import { supabase } from '../supabase';
import { ScheduledPost } from '../../types/database';
import { toast } from 'react-hot-toast';

export async function getScheduledPosts(userId: string, options?: {
  startDate?: Date;
  endDate?: Date;
  status?: 'pending' | 'published' | 'failed';
}) {
  try {
    let query = supabase
      .from('scheduled_posts')
      .select(`
        *,
        content_items (*)
      `)
      .eq('creator_id', userId)
      .order('scheduled_time', { ascending: true });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.startDate) {
      query = query.gte('scheduled_time', options.startDate.toISOString());
    }

    if (options?.endDate) {
      query = query.lte('scheduled_time', options.endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as (ScheduledPost & { content_items: any })[];
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    toast.error('Failed to fetch scheduled posts');
    throw error;
  }
}

export async function createScheduledPost(post: Omit<ScheduledPost, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;

    toast.success('Post scheduled successfully');
    return data as ScheduledPost;
  } catch (error) {
    console.error('Error scheduling post:', error);
    toast.error('Failed to schedule post');
    throw error;
  }
}

export async function updateScheduledPost(id: string, updates: Partial<ScheduledPost>) {
  try {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    toast.success('Schedule updated successfully');
    return data as ScheduledPost;
  } catch (error) {
    console.error('Error updating schedule:', error);
    toast.error('Failed to update schedule');
    throw error;
  }
}

export async function deleteScheduledPost(id: string) {
  try {
    const { error } = await supabase
      .from('scheduled_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast.success('Schedule deleted successfully');
  } catch (error) {
    console.error('Error deleting schedule:', error);
    toast.error('Failed to delete schedule');
    throw error;
  }
}