import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CreateSubscriptionOptions {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function createSubscription({ 
  priceId, 
  successUrl = `${window.location.origin}/dashboard`,
  cancelUrl = `${window.location.origin}/pricing`
}: CreateSubscriptionOptions) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    // Create Stripe Checkout Session
    const { data: { id: sessionId }, error } = await supabase
      .functions.invoke('create-checkout-session', {
        body: { 
          priceId,
          successUrl,
          cancelUrl
        }
      });

    if (error) throw error;

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
    if (stripeError) throw stripeError;

  } catch (error) {
    console.error('Subscription error:', error);
    toast.error('Failed to create subscription');
    throw error;
  }
}

export async function updateSubscription(priceId: string) {
  try {
    const { error } = await supabase
      .functions.invoke('update-subscription', {
        body: { priceId }
      });

    if (error) throw error;
    toast.success('Subscription updated successfully');
  } catch (error) {
    console.error('Update error:', error);
    toast.error('Failed to update subscription');
    throw error;
  }
}

export async function cancelSubscription() {
  try {
    const { error } = await supabase
      .functions.invoke('cancel-subscription');

    if (error) throw error;
    toast.success('Subscription cancelled successfully');
  } catch (error) {
    console.error('Cancellation error:', error);
    toast.error('Failed to cancel subscription');
    throw error;
  }
}

export async function getInvoices() {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    throw error;
  }
}

export async function getSubscriptionStatus() {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, pricing_plans(*)')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch subscription status:', error);
    throw error;
  }
}

export async function getPaymentMethods() {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch payment methods:', error);
    throw error;
  }
}

export async function setDefaultPaymentMethod(paymentMethodId: string) {
  try {
    const { error } = await supabase
      .functions.invoke('set-default-payment-method', {
        body: { paymentMethodId }
      });

    if (error) throw error;
    toast.success('Default payment method updated');
  } catch (error) {
    console.error('Failed to set default payment method:', error);
    toast.error('Failed to update default payment method');
    throw error;
  }
}

export async function removePaymentMethod(paymentMethodId: string) {
  try {
    const { error } = await supabase
      .functions.invoke('remove-payment-method', {
        body: { paymentMethodId }
      });

    if (error) throw error;
    toast.success('Payment method removed');
  } catch (error) {
    console.error('Failed to remove payment method:', error);
    toast.error('Failed to remove payment method');
    throw error;
  }
}