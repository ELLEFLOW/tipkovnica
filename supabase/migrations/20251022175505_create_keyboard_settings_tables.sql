/*
  # Keyboard Settings and User Preferences Tables

  ## Tables Created
  
  1. **user_keyboard_settings**
     - `id` (uuid, primary key)
     - `user_id` (uuid, references auth.users)
     - `language` (text) - Current active language (croatian, english, kajkavski)
     - `theme` (text) - Color theme (light, dark)
     - `vibration_enabled` (boolean) - Haptic feedback toggle
     - `keyboard_height` (text) - Keyboard size (small, medium, large)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  2. **user_favorite_emojis**
     - `id` (uuid, primary key)
     - `user_id` (uuid, references auth.users)
     - `emoji` (text) - The emoji character
     - `position` (integer) - Display order
     - `category` (text) - Emoji category
     - `created_at` (timestamptz)
  
  3. **calculator_history**
     - `id` (uuid, primary key)
     - `user_id` (uuid, references auth.users)
     - `expression` (text) - The calculation expression
     - `result` (text) - The calculation result
     - `created_at` (timestamptz)
  
  4. **keyboard_themes**
     - `id` (uuid, primary key)
     - `name` (text) - Theme name
     - `colors` (jsonb) - Color configuration
     - `is_default` (boolean)
     - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
*/

-- Create user_keyboard_settings table
CREATE TABLE IF NOT EXISTS user_keyboard_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  language text DEFAULT 'croatian' NOT NULL,
  theme text DEFAULT 'light' NOT NULL,
  vibration_enabled boolean DEFAULT true NOT NULL,
  keyboard_height text DEFAULT 'medium' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE user_keyboard_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own keyboard settings"
  ON user_keyboard_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keyboard settings"
  ON user_keyboard_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keyboard settings"
  ON user_keyboard_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own keyboard settings"
  ON user_keyboard_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_favorite_emojis table
CREATE TABLE IF NOT EXISTS user_favorite_emojis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emoji text NOT NULL,
  position integer NOT NULL,
  category text DEFAULT 'smileys' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, position)
);

ALTER TABLE user_favorite_emojis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorite emojis"
  ON user_favorite_emojis FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorite emojis"
  ON user_favorite_emojis FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorite emojis"
  ON user_favorite_emojis FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorite emojis"
  ON user_favorite_emojis FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create calculator_history table
CREATE TABLE IF NOT EXISTS calculator_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  expression text NOT NULL,
  result text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE calculator_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calculator history"
  ON calculator_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculator history"
  ON calculator_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculator history"
  ON calculator_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create keyboard_themes table
CREATE TABLE IF NOT EXISTS keyboard_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  colors jsonb NOT NULL,
  is_default boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE keyboard_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view keyboard themes"
  ON keyboard_themes FOR SELECT
  TO authenticated
  USING (true);

-- Insert default themes
INSERT INTO keyboard_themes (name, colors, is_default) 
VALUES 
  ('light', '{"background": "#f3f4f6", "keyBackground": "#ffffff", "keyText": "#1f2937", "accentColor": "#3b82f6"}', true),
  ('dark', '{"background": "#1f2937", "keyBackground": "#374151", "keyText": "#f9fafb", "accentColor": "#60a5fa"}', false)
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger for user_keyboard_settings
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_keyboard_settings_updated_at
  BEFORE UPDATE ON user_keyboard_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_keyboard_settings_user_id ON user_keyboard_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_emojis_user_id ON user_favorite_emojis(user_id);
CREATE INDEX IF NOT EXISTS idx_calculator_history_user_id ON calculator_history(user_id);
CREATE INDEX IF NOT EXISTS idx_calculator_history_created_at ON calculator_history(created_at DESC);