import { supabase } from '../supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type SubscriptionCallback = (payload: any) => void;
type Channel = 'messages' | 'content' | 'subscribers' | 'analytics';

class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private subscriptions: Map<string, Set<SubscriptionCallback>> = new Map();

  constructor(private userId: string) {}

  subscribe(channel: Channel, event: string, callback: SubscriptionCallback) {
    const channelId = `${channel}:${this.userId}`;
    
    if (!this.channels.has(channelId)) {
      const realtimeChannel = supabase.channel(channelId)
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence sync for channel:', channelId);
        })
        .on('postgres_changes', { 
          event: '*',
          schema: 'public',
          table: channel,
          filter: `creator_id=eq.${this.userId}`
        }, (payload) => {
          const callbacks = this.subscriptions.get(channelId) || new Set();
          callbacks.forEach(cb => cb(payload));
        })
        .subscribe();

      this.channels.set(channelId, realtimeChannel);
      this.subscriptions.set(channelId, new Set());
    }

    this.subscriptions.get(channelId)?.add(callback);

    return () => {
      const callbacks = this.subscriptions.get(channelId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          const channel = this.channels.get(channelId);
          channel?.unsubscribe();
          this.channels.delete(channelId);
          this.subscriptions.delete(channelId);
        }
      }
    };
  }

  async trackPresence(status: 'online' | 'away') {
    const updates = this.Array.from(this.channels.values()).map(channel =>
      channel.track({
        user_id: this.userId,
        online_at: new Date().toISOString(),
        status
      })
    );

    await Promise.all(updates);
  }

  async getPresence(channel: Channel): Promise<any[]> {
    const channelId = `${channel}:${this.userId}`;
    const realtimeChannel = this.channels.get(channelId);
    if (!realtimeChannel) return [];

    const presence = await realtimeChannel.presenceState();
    return Object.values(presence).flat();
  }

  disconnect() {
    this.channels.forEach(channel => channel.unsubscribe());
    this.channels.clear();
    this.subscriptions.clear();
  }
}

export function createRealtimeManager(userId: string) {
  return new RealtimeManager(userId);
}