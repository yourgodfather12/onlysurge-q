import { supabase } from '../supabase';
import { OnlyFansAPI } from '../api/platforms/onlyfans';
import { FanslyAPI } from '../api/platforms/fansly';
import { createJob } from '../api/jobs';
import { trackEvent } from '../api/analytics';
import { toast } from 'react-hot-toast';

interface SyncOptions {
  platforms?: string[];
  contentTypes?: ('image' | 'video')[];
  dryRun?: boolean;
}

export async function syncContent(userId: string, options: SyncOptions = {}) {
  try {
    // Get platform connections
    const { data: connections } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('creator_id', userId);

    if (!connections?.length) {
      throw new Error('No platform connections found');
    }

    // Create sync job
    const job = await createJob(userId, 'sync', {
      platforms: options.platforms || connections.map(c => c.platform),
      contentTypes: options.contentTypes || ['image', 'video'],
      dryRun: options.dryRun || false
    });

    // Track sync start
    await trackEvent(userId, 'content_sync_started', {
      jobId: job.id,
      options
    });

    // Return job ID for tracking progress
    return job.id;
  } catch (error) {
    console.error('Content sync error:', error);
    toast.error('Failed to start content sync');
    throw error;
  }
}

export async function getSyncStatus(jobId: string) {
  try {
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    return job;
  } catch (error) {
    console.error('Failed to get sync status:', error);
    throw error;
  }
}

export async function cancelSync(jobId: string) {
  try {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'cancelled' })
      .eq('id', jobId)
      .eq('status', 'pending');

    if (error) throw error;
    toast.success('Sync cancelled successfully');
  } catch (error) {
    console.error('Failed to cancel sync:', error);
    toast.error('Failed to cancel sync');
    throw error;
  }
}