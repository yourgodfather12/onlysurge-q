/*
  # Complete Backend Setup

  1. Core Tables
    - platform_connections: Store platform integration details
    - automation_logs: Track automation tasks and their results
    - analytics_data: Store aggregated analytics
    - content_vault: Enhanced content storage with metadata
    - user_roles: Role-based access control

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Add audit logging

  3. Performance
    - Add indexes for frequently queried columns
    - Add foreign key constraints
*/

-- Platform Connections
CREATE TABLE IF NOT EXISTS platform_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  username text,
  profile_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(creator_id, platform)
);

CREATE INDEX idx_platform_connections_creator ON platform_connections(creator_id);

-- Automation Logs
CREATE TABLE IF NOT EXISTS automation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  status text NOT NULL,
  result jsonb,
  error text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  metadata jsonb
);

CREATE INDEX idx_automation_logs_creator ON automation_logs(creator_id);
CREATE INDEX idx_automation_logs_status ON automation_logs(status);

-- Analytics Data
CREATE TABLE IF NOT EXISTS analytics_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  metric_type text NOT NULL,
  value numeric NOT NULL,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb
);

CREATE INDEX idx_analytics_data_creator ON analytics_data(creator_id);
CREATE INDEX idx_analytics_data_platform ON analytics_data(platform);
CREATE INDEX idx_analytics_data_timestamp ON analytics_data(timestamp);

-- Enhanced Content Vault
ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS metadata jsonb,
ADD COLUMN IF NOT EXISTS platform_ids jsonb,
ADD COLUMN IF NOT EXISTS content_hash text,
ADD COLUMN IF NOT EXISTS moderation_status text,
ADD COLUMN IF NOT EXISTS moderation_result jsonb;

CREATE INDEX idx_content_items_creator ON content_items(creator_id);
CREATE INDEX idx_content_items_type ON content_items(media_type);
CREATE INDEX idx_content_items_status ON content_items(moderation_status);

-- User Roles
CREATE TYPE user_role AS ENUM ('admin', 'creator', 'moderator', 'support');

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);

-- Audit Logging
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Enable RLS
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Platform Connections
CREATE POLICY "Users can view own platform connections"
  ON platform_connections FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Users can manage own platform connections"
  ON platform_connections FOR ALL
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Automation Logs
CREATE POLICY "Users can view own automation logs"
  ON automation_logs FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "System can manage automation logs"
  ON automation_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Analytics Data
CREATE POLICY "Users can view own analytics"
  ON analytics_data FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "System can insert analytics"
  ON analytics_data FOR INSERT
  TO service_role
  WITH CHECK (true);

-- User Roles
CREATE POLICY "Admins can manage roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Audit Logs
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Functions

-- Function to handle user role assignment
CREATE OR REPLACE FUNCTION handle_new_user_role()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'creator');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS trigger AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address
  )
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    CASE
      WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
      WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)
      ELSE NULL
    END,
    CASE
      WHEN TG_OP = 'DELETE' THEN NULL
      ELSE row_to_json(NEW)
    END,
    current_setting('request.headers', true)::json->>'x-forwarded-for'
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers

-- Assign default role to new users
CREATE OR REPLACE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_role();

-- Audit logging triggers
CREATE TRIGGER audit_content_items
  AFTER INSERT OR UPDATE OR DELETE ON content_items
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_platform_connections
  AFTER INSERT OR UPDATE OR DELETE ON platform_connections
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_user_roles
  AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();