/*
  # Create Saved Texts Table

  1. New Tables
    - `saved_texts`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references auth.users, nullable for guest mode)
      - `title` (text, default 'Untitled')
      - `content` (text, the saved text content)
      - `language` (text, 'hrvatski', 'kajkavski', 'english')
      - `char_count` (integer, calculated character count)
      - `word_count` (integer, calculated word count)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `saved_texts` table
    - Add policy for authenticated users to read their own texts
    - Add policy for authenticated users to insert their own texts
    - Add policy for authenticated users to update their own texts
    - Add policy for authenticated users to delete their own texts
    - Add policy for guests to read texts without user_id (public)

  3. Indexes
    - Index on user_id for faster queries
    - Index on created_at for sorting
    - Full-text search index on content
*/

CREATE TABLE IF NOT EXISTS saved_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text DEFAULT 'Bez naslova' NOT NULL,
  content text NOT NULL,
  language text DEFAULT 'hrvatski' NOT NULL,
  char_count integer DEFAULT 0 NOT NULL,
  word_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE saved_texts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own texts"
  ON saved_texts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Guests can read public texts"
  ON saved_texts
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

CREATE POLICY "Users can insert own texts"
  ON saved_texts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own texts"
  ON saved_texts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own texts"
  ON saved_texts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS saved_texts_user_id_idx ON saved_texts(user_id);
CREATE INDEX IF NOT EXISTS saved_texts_created_at_idx ON saved_texts(created_at DESC);
CREATE INDEX IF NOT EXISTS saved_texts_language_idx ON saved_texts(language);

CREATE OR REPLACE FUNCTION update_saved_texts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.char_count = length(NEW.content);
  NEW.word_count = array_length(regexp_split_to_array(trim(NEW.content), '\s+'), 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_saved_texts_updated_at
  BEFORE UPDATE ON saved_texts
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_texts_updated_at();

CREATE TRIGGER set_saved_texts_counts
  BEFORE INSERT ON saved_texts
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_texts_updated_at();