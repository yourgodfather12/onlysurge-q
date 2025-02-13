import { supabase } from '../supabase';
import { createHmac } from 'crypto';
import { z } from 'zod';

// Webhook payload schemas
const contentWebhookSchema = z.object({
  type: z.enum(['content.created', 'content.updated', 'content.deleted']),
  data: z.object({
    id: z.string(),
    platform: z.string(),
    contentType: z.string(),
    url: z.string().optional(),
    metadata: z.record(z.any()).optional()
  })
});

const messageWebhookSchema = z.object({
  type: z.enum(['message.received', 'message.sent']),
  data: z.object({
    id: z.string(),
    platform: z.string(),
    userId: z.string(),
    content: z.string(),
    metadata: z.record(z.any()).optional()
  })
});

export async function verifyWebhookSignature(
  payload: any,
  signature: string,
  secret: string
) {
  const hmac = createHmac('sha256', secret);
  const calculatedSignature = hmac
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === calculatedSignature;
}

export async function processWebhook(
  payload: any,
  signature: string,
  webhookId: string
) {
  try {
    // Get webhook config
    const { data: webhook } = await supabase
      .from('webhooks')
      .select('*')
      .eq('id', webhookId)
      .single();

    if (!webhook) {
      throw new Error('Webhook not found');
    }

    // Verify signature
    const isValid = await verifyWebhookSignature(
      payload,
      signature,
      webhook.secret
    );

    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    // Process based on webhook type
    if (webhook.events.includes(payload.type)) {
      switch (payload.type) {
        case 'content.created':
        case 'content.updated':
        case 'content.deleted': {
          const data = contentWebhookSchema.parse(payload);
          await handleContentWebhook(data);
          break;
        }
        case 'message.received':
        case 'message.sent': {
          const data = messageWebhookSchema.parse(payload);
          await handleMessageWebhook(data);
          break;
        }
      }
    }

    // Update webhook last triggered
    await supabase
      .from('webhooks')
      .update({
        last_triggered_at: new Date().toISOString()
      })
      .eq('id', webhookId);

  } catch (error) {
    console.error('Webhook processing error:', error);
    throw error;
  }
}

async function handleContentWebhook(data: z.infer<typeof contentWebhookSchema>) {
  // Handle content webhook
  const { type, data: content } = data;

  switch (type) {
    case 'content.created':
      // Create content item
      break;
    case 'content.updated':
      // Update content item
      break;
    case 'content.deleted':
      // Delete content item
      break;
  }
}

async function handleMessageWebhook(data: z.infer<typeof messageWebhookSchema>) {
  // Handle message webhook
  const { type, data: message } = data;

  switch (type) {
    case 'message.received':
      // Process received message
      break;
    case 'message.sent':
      // Process sent message
      break;
  }
}