import { supabase } from '../supabase';
import { ContentItem } from '../../types/database';
import { toast } from 'react-hot-toast';

export async function getContentItems(userId: string, options?: {
  page?: number;
  limit?: number;
  type?: 'image' | 'video' | 'all';
  search?: string;
  sort?: {
    field: keyof ContentItem;
    order: 'asc' | 'desc';
  };
}) {
  try {
    const {
      page = 1,
      limit = 10,
      type = 'all',
      search = '',
      sort = { field: 'created_at', order: 'desc' }
    } = options || {};

    let query = supabase
      .from('content_items')
      .select('*')
      .eq('creator_id', userId)
      .order(sort.field, { ascending: sort.order === 'asc' });

    if (type !== 'all') {
      query = query.eq('media_type', type);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      items: data as ContentItem[],
      total: count || 0,
      hasMore: (count || 0) > page * limit
    };
  } catch (error) {
    console.error('Error fetching content:', error);
    toast.error('Failed to fetch content');
    throw error;
  }
}

export async function createContentItem(
  contentItem: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>
) {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .insert(contentItem)
      .select()
      .single();

    if (error) throw error;

    toast.success('Content created successfully');
    return data as ContentItem;
  } catch (error) {
    console.error('Error creating content:', error);
    toast.error('Failed to create content');
    throw error;
  }
}

export async function updateContentItem(
  id: string,
  updates: Partial<ContentItem>
) {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    toast.success('Content updated successfully');
    return data as ContentItem;
  } catch (error) {
    console.error('Error updating content:', error);
    toast.error('Failed to update content');
    throw error;
  }
}

export async function deleteContentItem(id: string) {
  try {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast.success('Content deleted successfully');
  } catch (error) {
    console.error('Error deleting content:', error);
    toast.error('Failed to delete content');
    throw error;
  }
}

export async function uploadMedia(file: File, path: string, onProgress?: (progress: number) => void) {
  try {
    const { data, error } = await supabase.storage
      .from('content')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: ({ loaded, total }) => {
          const progress = (loaded / total) * 100;
          onProgress?.(progress);
        }
      });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error uploading media:', error);
    toast.error('Failed to upload media');
    throw error;
  }
}

export function getMediaUrl(path: string) {
  return supabase.storage
    .from('content')
    .getPublicUrl(path)
    .data.publicUrl;
}