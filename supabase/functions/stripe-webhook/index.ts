import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Stripe } from 'https://esm.sh/stripe@11.1.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user from customer ID
        const { data: customerData } = await supabase
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!customerData) break;

        // Update subscription in database
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: customerData.user_id,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });

        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Get user from customer ID
        const { data: customerData } = await supabase
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!customerData) break;

        // Create transaction record
        const { data: transaction } = await supabase
          .from('transactions')
          .insert({
            user_id: customerData.user_id,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency,
            status: 'succeeded',
            stripe_invoice_id: invoice.id,
          })
          .select()
          .single();

        if (!transaction) break;

        // Create invoice record
        await supabase
          .from('invoices')
          .insert({
            user_id: customerData.user_id,
            transaction_id: transaction.id,
            number: invoice.number,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency,
            status: 'paid',
            paid_at: new Date(invoice.status_transitions.paid_at! * 1000).toISOString(),
            pdf_url: invoice.invoice_pdf,
          });

        break;
      }

      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        const customerId = paymentMethod.customer as string;

        // Get user from customer ID
        const { data: customerData } = await supabase
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!customerData) break;

        // Add payment method to database
        await supabase
          .from('payment_methods')
          .insert({
            user_id: customerData.user_id,
            stripe_payment_method_id: paymentMethod.id,
            type: paymentMethod.type,
            last_four: paymentMethod.card?.last4,
            expiry_month: paymentMethod.card?.exp_month,
            expiry_year: paymentMethod.card?.exp_year,
            brand: paymentMethod.card?.brand,
          });

        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    );
  }
});