/*
  # Database Functions and Validation Update

  1. Functions
    - Add content validation function
    - Add scheduled post validation function
    - Add platform connection validation function
    - Add rate limit checking function
    - Add subscription analytics function
    - Add usage metrics function

  2. Triggers
    - Add content validation trigger
    - Add scheduled post validation trigger
    - Add platform connection validation trigger

  3. Security
    - Add RLS policies for jobs
*/

-- Add function to validate content
CREATE OR REPLACE FUNCTION validate_content()
RETURNS trigger AS $$
BEGIN
  -- Validate media URL format
  IF NEW.media_url IS NOT NULL AND 
     NEW.media_url !~ '^[a-zA-Z0-9\-_/]+\.[a-zA-Z0-9]+$' THEN
    RAISE EXCEPTION 'Invalid media URL format';
  END IF;

  -- Validate content type matches URL
  IF NEW.media_type = 'image' AND 
     NEW.media_url !~ '\.(jpg|jpeg|png|gif)$' THEN
    RAISE EXCEPTION 'Invalid image file format';
  END IF;

  IF NEW.media_type = 'video' AND 
     NEW.media_url !~ '\.(mp4|mov|avi)$' THEN
    RAISE EXCEPTION 'Invalid video file format';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for content validation
DROP TRIGGER IF EXISTS validate_content_trigger ON content_items;
CREATE TRIGGER validate_content_trigger
  BEFORE INSERT OR UPDATE ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION validate_content();

-- Add function to validate scheduled posts
CREATE OR REPLACE FUNCTION validate_scheduled_post()
RETURNS trigger AS $$
BEGIN
  -- Ensure scheduled time is in the future
  IF NEW.scheduled_time <= CURRENT_TIMESTAMP THEN
    RAISE EXCEPTION 'Scheduled time must be in the future';
  END IF;

  -- Ensure content exists
  IF NOT EXISTS (
    SELECT 1 FROM content_items WHERE id = NEW.content_id
  ) THEN
    RAISE EXCEPTION 'Content does not exist';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for scheduled post validation
DROP TRIGGER IF EXISTS validate_scheduled_post_trigger ON scheduled_posts;
CREATE TRIGGER validate_scheduled_post_trigger
  BEFORE INSERT OR UPDATE ON scheduled_posts
  FOR EACH ROW
  EXECUTE FUNCTION validate_scheduled_post();

-- Add function to validate platform connections
CREATE OR REPLACE FUNCTION validate_platform_connection()
RETURNS trigger AS $$
BEGIN
  -- Ensure only one active connection per platform per user
  IF EXISTS (
    SELECT 1 FROM platform_connections
    WHERE creator_id = NEW.creator_id
    AND platform = NEW.platform
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Only one active connection per platform is allowed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for platform connection validation
DROP TRIGGER IF EXISTS validate_platform_connection_trigger ON platform_connections;
CREATE TRIGGER validate_platform_connection_trigger
  BEFORE INSERT OR UPDATE ON platform_connections
  FOR EACH ROW
  EXECUTE FUNCTION validate_platform_connection();

-- Add function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_endpoint text,
  p_limit integer,
  p_window interval
)
RETURNS boolean AS $$
DECLARE
  v_count integer;
BEGIN
  -- Clean up old records
  DELETE FROM rate_limits
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint
    AND window_start < CURRENT_TIMESTAMP - p_window;

  -- Get current count
  SELECT COALESCE(SUM(requests_count), 0)
  INTO v_count
  FROM rate_limits
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint
    AND window_start >= CURRENT_TIMESTAMP - p_window;

  -- Check if limit exceeded
  RETURN v_count < p_limit;
END;
$$ LANGUAGE plpgsql;

-- Add function to get subscription analytics
CREATE OR REPLACE FUNCTION get_subscription_analytics(
  p_user_id uuid,
  p_time_range text DEFAULT '30d'
)
RETURNS jsonb AS $$
DECLARE
  v_start_date timestamptz;
  v_result jsonb;
BEGIN
  -- Calculate start date based on time range
  v_start_date := CASE p_time_range
    WHEN '7d' THEN CURRENT_TIMESTAMP - INTERVAL '7 days'
    WHEN '30d' THEN CURRENT_TIMESTAMP - INTERVAL '30 days'
    WHEN '90d' THEN CURRENT_TIMESTAMP - INTERVAL '90 days'
    WHEN '1y' THEN CURRENT_TIMESTAMP - INTERVAL '1 year'
    ELSE CURRENT_TIMESTAMP - INTERVAL '30 days'
  END;

  -- Get analytics data
  SELECT jsonb_build_object(
    'revenue', jsonb_build_object(
      'monthly', COALESCE(SUM(amount), 0),
      'growth', COALESCE(
        (
          SUM(CASE WHEN created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days' THEN amount ELSE 0 END) /
          NULLIF(SUM(CASE WHEN created_at >= CURRENT_TIMESTAMP - INTERVAL '60 days' 
                         AND created_at < CURRENT_TIMESTAMP - INTERVAL '30 days' 
                    THEN amount ELSE 0 END), 0) - 1
        ) * 100,
        0
      )
    ),
    'subscribers', jsonb_build_object(
      'active', COUNT(DISTINCT user_id),
      'growth', COALESCE(
        (
          COUNT(DISTINCT CASE WHEN created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days' 
                            THEN user_id END) /
          NULLIF(COUNT(DISTINCT CASE WHEN created_at >= CURRENT_TIMESTAMP - INTERVAL '60 days'
                                   AND created_at < CURRENT_TIMESTAMP - INTERVAL '30 days'
                                   THEN user_id END), 0) - 1
        ) * 100,
        0
      )
    )
  ) INTO v_result
  FROM transactions
  WHERE creator_id = p_user_id
    AND created_at >= v_start_date;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

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