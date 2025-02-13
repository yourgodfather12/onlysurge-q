import { supabase } from './supabase';
import type { ContentItem } from '../types/database';

interface ContentMetadata {
  title: string;
  description: string;
  tags: string[];
  contentRating: 'sfw' | 'nsfw';
  price?: number;
}

export async function uploadContent(
  file: File,
  metadata: ContentMetadata,
  onProgress?: (progress: number) => void
): Promise<ContentItem> {
  try {
    // Upload to storage
    const path = `content/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('content')
      .upload(path, file, {
        onUploadProgress: ({ loaded, total }) => {
          onProgress?.(Math.round((loaded / total) * 100));
        }
      });

    if (uploadError) throw uploadError;

    // Create content record
    const { data: contentData, error: contentError } = await supabase
      .from('content_items')
      .insert({
        title: metadata.title,
        description: metadata.description,
        media_url: uploadData.path,
        media_type: file.type.startsWith('image/') ? 'image' : 'video',
        tags: metadata.tags,
        content_rating: metadata.contentRating,
        price: metadata.price || 0
      })
      .select()
      .single();

    if (contentError) throw contentError;
    return contentData;
  } catch (error) {
    console.error('Content upload error:', error);
    throw error;
  }
}

export async function getContentEmbedCode(contentId: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-embed-code', {
      body: { contentId }
    });

    if (error) throw error;
    return data.embedCode;
  } catch (error) {
    console.error('Embed code generation error:', error);
    throw error;
  }
}

export async function moderateContent(contentId: string): Promise<{
  approved: boolean;
  reason?: string;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('moderate-content', {
      body: { contentId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Content moderation error:', error);
    throw error;
  }
}