/*
  # Create User Words and Typing Stats Tables

  1. New Tables
    
    **user_words**
    - Stores custom words added by users (kajkavski or personal dictionary)
    - `id` (uuid, primary key, auto-generated)
    - `user_id` (uuid, references auth.users)
    - `word` (text, the custom word)
    - `language` (text, typically 'kajkavski' or 'custom')
    - `usage_count` (integer, how many times the user typed this word)
    - `created_at` (timestamptz, default now())
    - `last_used_at` (timestamptz, default now())
    
    **typing_stats**
    - Tracks user typing statistics for analytics
    - `id` (uuid, primary key, auto-generated)
    - `user_id` (uuid, references auth.users)
    - `session_date` (date, the day of typing session)
    - `chars_typed` (integer, total characters typed)
    - `words_typed` (integer, total words typed)
    - `session_duration` (integer, duration in seconds)
    - `language_used` (text, which language was primarily used)
    - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on both tables
    - Users can only read, insert, update, and delete their own data

  3. Indexes
    - Index on user_id for both tables
    - Index on session_date for stats
    - Index on usage_count for ranking popular words
*/

CREATE TABLE IF NOT EXISTS user_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word text NOT NULL,
  language text DEFAULT 'kajkavski' NOT NULL,
  usage_count integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  last_used_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT user_words_unique UNIQUE (user_id, word, language)
);

ALTER TABLE user_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own words"
  ON user_words
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own words"
  ON user_words
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own words"
  ON user_words
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own words"
  ON user_words
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS user_words_user_id_idx ON user_words(user_id);
CREATE INDEX IF NOT EXISTS user_words_usage_count_idx ON user_words(usage_count DESC);
CREATE INDEX IF NOT EXISTS user_words_word_idx ON user_words(word);

CREATE TABLE IF NOT EXISTS typing_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date date DEFAULT CURRENT_DATE NOT NULL,
  chars_typed integer DEFAULT 0 NOT NULL,
  words_typed integer DEFAULT 0 NOT NULL,
  session_duration integer DEFAULT 0 NOT NULL,
  language_used text DEFAULT 'hrvatski' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE typing_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own stats"
  ON typing_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON typing_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON typing_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS typing_stats_user_id_idx ON typing_stats(user_id);
CREATE INDEX IF NOT EXISTS typing_stats_session_date_idx ON typing_stats(session_date DESC);