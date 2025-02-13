import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

// API rate limiting
const rateLimits = {
  'content:create': { limit: 100, window: '1h' },
  'messages:send': { limit: 500, window: '1h' },
  'analytics:fetch': { limit: 1000, window: '1h' }
};

// Error handling with retry logic
async function handleRequest<T>(
  key: keyof typeof rateLimits,
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    // Check rate limit
    const { data: allowed, error: limitError } = await supabase.rpc(
      'check_rate_limit',
      {
        p_endpoint: key,
        p_limit: rateLimits[key].limit,
        p_window: rateLimits[key].window
      }
    );

    if (limitError) throw limitError;
    if (!allowed) {
      throw new Error('Rate limit exceeded');
    }

    return await fn();
  } catch (error) {
    if (retries > 0 && error instanceof Error && error.message.includes('network')) {
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, 4 - retries) * 1000));
      return handleRequest(key, fn, retries - 1);
    }
    throw error;
  }
}

// API endpoints with rate limiting and error handling
export const api = {
  content: {
    create: async (data: any) => {
      return handleRequest('content:create', async () => {
        const { data: result, error } = await supabase
          .from('content_items')
          .insert(data)
          .select()
          .single();

        if (error) throw error;
        return result;
      });
    }
  },
  messages: {
    send: async (data: any) => {
      return handleRequest('messages:send', async () => {
        const { data: result, error } = await supabase
          .from('messages')
          .insert(data)
          .select()
          .single();

        if (error) throw error;
        return result;
      });
    }
  },
  analytics: {
    fetch: async (params: any) => {
      return handleRequest('analytics:fetch', async () => {
        const { data: result, error } = await supabase
          .from('analytics_data')
          .select('*')
          .match(params);

        if (error) throw error;
        return result;
      });
    }
  }
};

// Webhook management
export const webhooks = {
  create: async (url: string, events: string[]) => {
    const { data, error } = await supabase
      .from('webhooks')
      .insert({
        url,
        events,
        secret: crypto.randomUUID()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  list: async () => {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// API key management
export const apiKeys = {
  create: async (name: string, scopes: string[]) => {
    const key = crypto.randomUUID();
    const keyHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(key)
    ).then(buf => Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''));

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        name,
        key_hash: keyHash,
        scopes
      })
      .select()
      .single();

    if (error) throw error;
    return { ...data, key };
  },
  list: async () => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
  revoke: async (id: string) => {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Security logging
export const security = {
  logEvent: async (eventType: string, metadata: any = {}) => {
    const { error } = await supabase.rpc('log_security_event', {
      p_event_type: eventType,
      p_metadata: metadata
    });

    if (error) throw error;
  },
  getEvents: async (limit = 100) => {
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};