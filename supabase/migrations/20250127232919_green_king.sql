/*
  # Payment System Updates

  This migration safely adds or updates payment-related tables and policies,
  checking for existing objects to prevent conflicts.
*/

-- Function to safely create indexes
CREATE OR REPLACE FUNCTION create_index_if_not_exists(
  p_table text,
  p_index text,
  p_column text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE tablename = p_table
    AND indexname = p_index
  ) THEN
    EXECUTE format('CREATE INDEX %I ON %I(%I)', p_index, p_table, p_column);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Safely create tables and indexes
DO $$ 
BEGIN
  -- Add any missing tables
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'pricing_plans') THEN
    CREATE TABLE pricing_plans (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text,
      price numeric NOT NULL,
      interval text NOT NULL,
      features jsonb,
      active boolean DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'payment_methods') THEN
    CREATE TABLE payment_methods (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users ON DELETE CASCADE,
      provider text NOT NULL,
      token text NOT NULL,
      last_four text,
      card_type text,
      expiry_month integer,
      expiry_year integer,
      is_default boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'subscriptions') THEN
    CREATE TABLE subscriptions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users ON DELETE CASCADE,
      plan_id uuid REFERENCES pricing_plans(id),
      status text NOT NULL,
      current_period_start timestamptz NOT NULL,
      current_period_end timestamptz NOT NULL,
      cancel_at_period_end boolean DEFAULT false,
      payment_method_id uuid REFERENCES payment_methods(id),
      metadata jsonb,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'transactions') THEN
    CREATE TABLE transactions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users ON DELETE CASCADE,
      subscription_id uuid REFERENCES subscriptions(id),
      amount numeric NOT NULL,
      currency text NOT NULL DEFAULT 'USD',
      status text NOT NULL,
      payment_method_id uuid REFERENCES payment_methods(id),
      metadata jsonb,
      created_at timestamptz DEFAULT now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'invoices') THEN
    CREATE TABLE invoices (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users ON DELETE CASCADE,
      transaction_id uuid REFERENCES transactions(id),
      number text NOT NULL,
      amount numeric NOT NULL,
      currency text NOT NULL DEFAULT 'USD',
      status text NOT NULL,
      due_date timestamptz,
      paid_at timestamptz,
      pdf_url text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  -- Create indexes safely
  PERFORM create_index_if_not_exists('payment_methods', 'idx_payment_methods_user', 'user_id');
  PERFORM create_index_if_not_exists('subscriptions', 'idx_subscriptions_user', 'user_id');
  PERFORM create_index_if_not_exists('transactions', 'idx_transactions_user', 'user_id');
  PERFORM create_index_if_not_exists('invoices', 'idx_invoices_user', 'user_id');
  PERFORM create_index_if_not_exists('subscriptions', 'idx_subscriptions_status', 'status');
  PERFORM create_index_if_not_exists('transactions', 'idx_transactions_status', 'status');

END $$;

-- Enable RLS on tables if not already enabled
DO $$ 
BEGIN
  EXECUTE 'ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE transactions ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE invoices ENABLE ROW LEVEL SECURITY';
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Drop existing policies if any
DO $$ 
BEGIN
  -- Pricing Plans policies
  DROP POLICY IF EXISTS "Anyone can view active pricing plans" ON pricing_plans;
  DROP POLICY IF EXISTS "Admins can manage pricing plans" ON pricing_plans;
  
  -- Payment Methods policies
  DROP POLICY IF EXISTS "Users can view own payment methods" ON payment_methods;
  DROP POLICY IF EXISTS "Users can manage own payment methods" ON payment_methods;
  
  -- Subscriptions policies
  DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
  DROP POLICY IF EXISTS "System can manage subscriptions" ON subscriptions;
  
  -- Transactions policies
  DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
  DROP POLICY IF EXISTS "System can manage transactions" ON transactions;
  
  -- Invoices policies
  DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
  DROP POLICY IF EXISTS "System can manage invoices" ON invoices;
END $$;

-- Create fresh policies
CREATE POLICY "Anyone can view active pricing plans"
  ON pricing_plans FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage pricing plans"
  ON pricing_plans FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can view own payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own payment methods"
  ON payment_methods FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can manage subscriptions"
  ON subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can manage transactions"
  ON transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can manage invoices"
  ON invoices FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert default pricing plans if they don't exist
INSERT INTO pricing_plans (name, description, price, interval, features)
SELECT 'Starter', 'Perfect for creators just getting started', 29, 'month', 
  '{"features": ["Basic content management", "Up to 100 scheduled posts", "Basic analytics", "Email support", "Single platform integration"]}'
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE name = 'Starter');

INSERT INTO pricing_plans (name, description, price, interval, features)
SELECT 'Professional', 'For growing creators who need more power', 79, 'month',
  '{"features": ["Advanced content management", "Unlimited scheduled posts", "Advanced analytics", "Priority email support", "Multi-platform integration", "Basic AI automation", "Custom branding"]}'
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE name = 'Professional');

INSERT INTO pricing_plans (name, description, price, interval, features)
SELECT 'Enterprise', 'Custom solutions for established creators', 299, 'month',
  '{"features": ["Custom content management", "Unlimited everything", "Real-time analytics", "24/7 priority support", "All platform integrations", "Advanced AI automation", "Custom branding", "Dedicated account manager", "Custom AI training", "API access"]}'
WHERE NOT EXISTS (SELECT 1 FROM pricing_plans WHERE name = 'Enterprise');