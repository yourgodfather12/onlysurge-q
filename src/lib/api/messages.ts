import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  creator_id: string;
  subscriber_id: string;
  content: string;
  attachments?: string[];
  is_read: boolean;
  created_at: string;
}

export async function getMessages(userId: string, subscriberId: string, options?: {
  limit?: number;
  before?: string;
}) {
  try {
    const { limit = 50, before } = options || {};

    let query = supabase
      .from('messages')
      .select('*')
      .eq('creator_id', userId)
      .eq('subscriber_id', subscriberId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as Message[];
  } catch (error) {
    console.error('Error fetching messages:', error);
    toast.error('Failed to fetch messages');
    throw error;
  }
}

export async function sendMessage(message: Omit<Message, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;

    return data as Message;
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
    throw error;
  }
}

export async function markMessagesAsRead(userId: string, subscriberId: string) {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('creator_id', userId)
      .eq('subscriber_id', subscriberId)
      .eq('is_read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    // Don't show toast for this error
  }
}

export async function getUnreadCount(userId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('subscriber_id', { count: 'exact' })
      .eq('creator_id', userId)
      .eq('is_read', false);

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}