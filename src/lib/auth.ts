import { supabase } from './supabase';
import { generateDynamicRules } from './dynamicRules';

interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export async function authenticateWithProvider(provider: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Auth error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function generateAuthToken(userId: string) {
  try {
    const rules = await generateDynamicRules();
    const { data, error } = await supabase.functions.invoke('generate-auth-token', {
      body: { userId, rules }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Token generation error:', error);
    return { success: false, error: 'Failed to generate auth token' };
  }
}

export async function validateContentAccess(contentId: string, token: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('validate-content-access', {
      body: { contentId, token }
    });

    if (error) throw error;
    return data.hasAccess;
  } catch (error) {
    console.error('Content access validation error:', error);
    return false;
  }
}