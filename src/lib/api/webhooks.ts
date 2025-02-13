import { supabase } from '../supabase';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface Webhook {
  id: string;
  user_id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  last_triggered_at?: string;
  created_at: string;
  updated_at: string;
}

export async function createWebhook(userId: string, url: string, events: string[]) {
  try {
    const webhook = {
      user_id: userId,
      url,
      events,
      secret: uuidv4(),
      active: true
    };

    const { data, error } = await supabase
      .from('webhooks')
      .insert(webhook)
      .select()
      .single();

    if (error) throw error;

    toast.success('Webhook created successfully');
    return data as Webhook;
  } catch (error) {
    console.error('Error creating webhook:', error);
    toast.error('Failed to create webhook');
    throw error;
  }
}

export async function getWebhooks(userId: string) {
  try {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as Webhook[];
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    toast.error('Failed to fetch webhooks');
    throw error;
  }
}

export async function updateWebhook(id: string, updates: Partial<Webhook>) {
  try {
    const { data, error } = await supabase
      .from('webhooks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    toast.success('Webhook updated successfully');
    return data as Webhook;
  } catch (error) {
    console.error('Error updating webhook:', error);
    toast.error('Failed to update webhook');
    throw error;
  }
}

export async function deleteWebhook(id: string) {
  try {
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    toast.success('Webhook deleted successfully');
  } catch (error) {
    console.error('Error deleting webhook:', error);
    toast.error('Failed to delete webhook');
    throw error;
  }
}

export async function testWebhook(webhook: Webhook) {
  try {
    const { error } = await supabase.functions.invoke('test-webhook', {
      body: { webhookId: webhook.id }
    });

    if (error) throw error;

    toast.success('Test event sent successfully');
  } catch (error) {
    console.error('Error testing webhook:', error);
    toast.error('Failed to test webhook');
    throw error;
  }
}