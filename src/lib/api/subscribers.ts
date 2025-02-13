import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';

interface Subscriber {
  id: string;
  creator_id: string;
  platform: string;
  platform_user_id: string;
  username: string;
  email?: string;
  subscribed_at: string;
  expires_at?: string;
  status: 'active' | 'expired';
  total_spent: number;
  metadata: any;
}

export async function getSubscribers(userId: string, options?: {
  page?: number;
  limit?: number;
  status?: 'active' | 'expired' | 'all';
  search?: string;
  sort?: {
    field: keyof Subscriber;
    order: 'asc' | 'desc';
  };
}) {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'all',
      search = '',
      sort = { field: 'subscribed_at', order: 'desc' }
    } = options || {};

    let query = supabase
      .from('subscribers')
      .select('*')
      .eq('creator_id', userId);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
    }

    query = query.order(sort.field, { ascending: sort.order === 'asc' });

    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      subscribers: data as Subscriber[],
      total: count || 0,
      hasMore: (count || 0) > page * limit
    };
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    toast.error('Failed to fetch subscribers');
    throw error;
  }
}

export async function getSubscriberStats(userId: string) {
  try {
    const { data, error } = await supabase.rpc('get_subscriber_stats', {
      p_creator_id: userId
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching subscriber stats:', error);
    toast.error('Failed to fetch subscriber statistics');
    throw error;
  }
}

export async function getSubscriberDetails(userId: string, subscriberId: string) {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select(`
        *,
        transactions:subscriber_transactions(*)
      `)
      .eq('creator_id', userId)
      .eq('id', subscriberId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching subscriber details:', error);
    toast.error('Failed to fetch subscriber details');
    throw error;
  }
}