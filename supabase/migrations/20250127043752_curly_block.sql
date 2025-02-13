/*
  # OnlySurge Database Schema

  1. New Tables
    - `creator_profiles`
      - Extended profile info for OnlyFans creators
      - Includes platform stats and settings
    
    - `content_items`
      - Stores metadata for uploaded content
      - Includes AI analysis results
    
    - `scheduled_posts`
      - Manages post scheduling
      - Links to content items
    
    - `message_templates`
      - Stores AI chat templates
      - Links to creator profiles

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated creators
*/

-- Create creator_profiles table
CREATE TABLE IF NOT EXISTS creator_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  onlyfans_username text,
  display_name text,
  bio text,
  avatar_url text,
  banner_url text,
  subscription_price decimal DEFAULT 0,
  total_earnings decimal DEFAULT 0,
  total_subscribers integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content_items table
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  media_url text,
  media_type text NOT NULL,
  ai_caption text,
  ai_hashtags text[],
  ai_best_time timestamptz,
  ai_engagement_score decimal DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scheduled_posts table
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE,
  content_id uuid REFERENCES content_items(id) ON DELETE CASCADE,
  scheduled_time timestamptz NOT NULL,
  caption text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create message_templates table
CREATE TABLE IF NOT EXISTS message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  template text NOT NULL,
  keywords text[],
  is_auto_reply boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- Policies for creator_profiles
CREATE POLICY "Creators can view own profile"
  ON creator_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Creators can update own profile"
  ON creator_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies for content_items
CREATE POLICY "Creators can view own content"
  ON content_items FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can insert own content"
  ON content_items FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update own content"
  ON content_items FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can delete own content"
  ON content_items FOR DELETE
  TO authenticated
  USING (creator_id = auth.uid());

-- Policies for scheduled_posts
CREATE POLICY "Creators can view own scheduled posts"
  ON scheduled_posts FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can manage own scheduled posts"
  ON scheduled_posts FOR ALL
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Policies for message_templates
CREATE POLICY "Creators can view own templates"
  ON message_templates FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can manage own templates"
  ON message_templates FOR ALL
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_creator()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.creator_profiles (id, onlyfans_username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_creator();