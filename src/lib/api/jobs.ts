import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';

interface Job {
  id: string;
  user_id: string;
  type: 'post' | 'message' | 'sync';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data: any;
  result?: any;
  error?: string;
  scheduled_for?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export async function createJob(
  userId: string,
  type: Job['type'],
  data: any,
  scheduledFor?: Date
) {
  try {
    const job = {
      user_id: userId,
      type,
      status: 'pending',
      data,
      scheduled_for: scheduledFor?.toISOString()
    };

    const { data: createdJob, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) throw error;

    return createdJob as Job;
  } catch (error) {
    console.error('Error creating job:', error);
    toast.error('Failed to create job');
    throw error;
  }
}

export async function getJobs(userId: string, options?: {
  type?: Job['type'];
  status?: Job['status'];
  limit?: number;
}) {
  try {
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options?.type) {
      query = query.eq('type', options.type);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as Job[];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    toast.error('Failed to fetch jobs');
    throw error;
  }
}

export async function cancelJob(id: string) {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .eq('status', 'pending'); // Only allow canceling pending jobs

    if (error) throw error;

    toast.success('Job canceled successfully');
  } catch (error) {
    console.error('Error canceling job:', error);
    toast.error('Failed to cancel job');
    throw error;
  }
}

export async function retryJob(id: string) {
  try {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'pending', error: null })
      .eq('id', id)
      .eq('status', 'failed'); // Only allow retrying failed jobs

    if (error) throw error;

    toast.success('Job queued for retry');
  } catch (error) {
    console.error('Error retrying job:', error);
    toast.error('Failed to retry job');
    throw error;
  }
}