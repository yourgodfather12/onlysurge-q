/*
  # Fix Database Constraints

  1. Schema Changes
    - Add missing tables
    - Fix constraint conflicts
    - Add validation functions
*/

-- Create jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  data jsonb,
  result jsonb,
  error text,
  scheduled_for timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Function to safely add constraints
CREATE OR REPLACE FUNCTION add_constraint_if_not_exists(
  p_table text,
  p_constraint text,
  p_definition text
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.constraint_column_usage
    WHERE table_name = p_table
    AND constraint_name = p_constraint
  ) THEN
    EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I %s',
      p_table,
      p_constraint,
      p_definition
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Safely add constraints
DO $$ 
BEGIN
  -- Jobs table constraints
  PERFORM add_constraint_if_not_exists(
    'jobs',
    'valid_job_type',
    'CHECK (type IN (''post'', ''message'', ''sync''))'
  );

  PERFORM add_constraint_if_not_exists(
    'jobs',
    'valid_job_status',
    'CHECK (status IN (''pending'', ''processing'', ''completed'', ''failed'', ''cancelled''))'
  );

  -- Webhooks table constraints
  PERFORM add_constraint_if_not_exists(
    'webhooks',
    'valid_events',
    'CHECK (events IS NULL OR array_length(events, 1) > 0)'
  );

  -- API keys table constraints
  PERFORM add_constraint_if_not_exists(
    'api_keys',
    'valid_scopes',
    'CHECK (scopes IS NULL OR array_length(scopes, 1) > 0)'
  );

  PERFORM add_constraint_if_not_exists(
    'api_keys',
    'valid_expires_at',
    'CHECK (expires_at > CURRENT_TIMESTAMP)'
  );

  -- Rate limits table constraints
  PERFORM add_constraint_if_not_exists(
    'rate_limits',
    'valid_requests_count',
    'CHECK (requests_count >= 0)'
  );
END $$;

-- Enable RLS on jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for jobs
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'users_view_own_jobs'
  ) THEN
    CREATE POLICY "users_view_own_jobs"
      ON jobs FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'users_manage_own_jobs'
  ) THEN
    CREATE POLICY "users_manage_own_jobs"
      ON jobs FOR ALL
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Add function to get usage metrics
CREATE OR REPLACE FUNCTION get_usage_metrics(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'storage', jsonb_build_object(
      'used', COALESCE(SUM(LENGTH(media_url)), 0),
      'limit', 10737418240 -- 10GB in bytes
    ),
    'posts', jsonb_build_object(
      'count', COUNT(*),
      'limit', 1000
    ),
    'automations', jsonb_build_object(
      'active', COUNT(*) FILTER (WHERE status = 'active'),
      'limit', 50
    ),
    'apiCalls', jsonb_build_object(
      'count', COALESCE(SUM(requests_count), 0),
      'limit', 10000
    )
  ) INTO v_result
  FROM (
    SELECT media_url FROM content_items WHERE creator_id = p_user_id
    UNION ALL
    SELECT NULL FROM jobs WHERE user_id = p_user_id
    UNION ALL
    SELECT NULL FROM rate_limits WHERE user_id = p_user_id
  ) t;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;