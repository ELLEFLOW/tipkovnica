/*
  # Create Dictionary Table

  1. New Tables
    - `dictionary`
      - `id` (uuid, primary key, auto-generated)
      - `word` (text, the word itself)
      - `language` (text, 'hrvatski', 'kajkavski', 'english')
      - `definition` (text, optional definition)
      - `frequency` (integer, word usage frequency for autocomplete ranking)
      - `category` (text, optional categorization)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `dictionary` table
    - Add policy for all users (authenticated and anon) to read dictionary
    - Only authenticated users can suggest new words (insert)

  3. Indexes
    - Unique index on (word, language) combination
    - Index on language for filtering
    - Index on word for autocomplete
    - Index on frequency for ranking
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
    CREATE EXTENSION pg_trgm;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS dictionary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  language text NOT NULL,
  definition text,
  frequency integer DEFAULT 1 NOT NULL,
  category text,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT dictionary_word_language_unique UNIQUE (word, language)
);

ALTER TABLE dictionary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read dictionary"
  ON dictionary
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert words"
  ON dictionary
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS dictionary_language_idx ON dictionary(language);
CREATE INDEX IF NOT EXISTS dictionary_frequency_idx ON dictionary(frequency DESC);
CREATE INDEX IF NOT EXISTS dictionary_word_idx ON dictionary(word);
CREATE INDEX IF NOT EXISTS dictionary_word_lower_idx ON dictionary(lower(word));