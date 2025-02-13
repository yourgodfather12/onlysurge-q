import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import type { 
  CreatorProfile, 
  ContentItem, 
  ScheduledPost, 
  MessageTemplate,
  Link,
  Promotion 
} from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Creator Profile Functions
export async function getCreatorProfile(userId: string) {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as CreatorProfile;
}

// Content Functions
export async function getContentItems(userId: string) {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as ContentItem[];
}

export async function createContentItem(contentItem: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('content_items')
    .insert(contentItem)
    .select()
    .single();
  
  if (error) throw error;
  return data as ContentItem;
}

// Scheduled Posts Functions
export async function getScheduledPosts(userId: string) {
  const { data, error } = await supabase
    .from('scheduled_posts')
    .select(`
      *,
      content_items (*)
    `)
    .eq('creator_id', userId)
    .order('scheduled_time', { ascending: true });
  
  if (error) throw error;
  return data as (ScheduledPost & { content_items: ContentItem })[];
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
    console.error('Error creating scheduled post:', error);
    toast.error('Failed to schedule post');
    throw error;
  }
}

// Media Functions
export async function uploadMedia(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('content')
    .upload(path, file);

  if (error) throw error;
  return data;
}

export function getMediaUrl(path: string) {
  const { data } = supabase.storage
    .from('content')
    .getPublicUrl(path);

  return data.publicUrl;
}

// Error Handling
export function handleSupabaseError(error: any) {
  console.error('Supabase error:', error);
  
  let message = 'An unexpected error occurred';
  
  if (error.code === '22P02') {
    message = 'Invalid input format';
  } else if (error.code === '23505') {
    message = 'This record already exists';
  } else if (error.code === '42P01') {
    message = 'Database table not found';
  }
  
  toast.error(message);
  throw error;
}