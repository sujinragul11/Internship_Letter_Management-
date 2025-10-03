/*
  # Create Interns and Letter History Tables

  ## Overview
  This migration creates the core tables for managing interns and letter generation history
  in the application, along with proper security policies.

  ## New Tables

  ### 1. `interns` Table
  Stores intern information and details
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `name` (text) - Intern's full name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone number
  - `position` (text) - Job position/role
  - `start_date` (date) - Internship start date
  - `duration` (text) - Duration of internship
  - `location` (text) - Work location
  - `stipend` (text) - Stipend amount
  - `status` (text) - Current status (active/inactive/completed)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `letter_history` Table
  Tracks all generated letters
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `intern_id` (uuid, foreign key) - Links to interns table
  - `letter_type` (text) - Type of letter (offer/completion)
  - `pdf_url` (text) - URL to stored PDF
  - `sent_at` (timestamptz) - When letter was generated/sent
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Users can only access their own data
  - Separate policies for SELECT, INSERT, UPDATE, DELETE operations
  - All policies check auth.uid() to ensure user ownership
*/

-- Create interns table
CREATE TABLE IF NOT EXISTS interns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  position text NOT NULL,
  start_date date NOT NULL,
  duration text NOT NULL,
  location text,
  stipend text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create letter_history table
CREATE TABLE IF NOT EXISTS letter_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  intern_id uuid REFERENCES interns(id) ON DELETE CASCADE NOT NULL,
  letter_type text NOT NULL,
  pdf_url text,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_interns_user_id ON interns(user_id);
CREATE INDEX IF NOT EXISTS idx_interns_status ON interns(status);
CREATE INDEX IF NOT EXISTS idx_interns_created_at ON interns(created_at);
CREATE INDEX IF NOT EXISTS idx_letter_history_user_id ON letter_history(user_id);
CREATE INDEX IF NOT EXISTS idx_letter_history_intern_id ON letter_history(intern_id);

-- Enable Row Level Security
ALTER TABLE interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE letter_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interns table
CREATE POLICY "Users can view own interns"
  ON interns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interns"
  ON interns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interns"
  ON interns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interns"
  ON interns FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for letter_history table
CREATE POLICY "Users can view own letters"
  ON letter_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own letters"
  ON letter_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own letters"
  ON letter_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own letters"
  ON letter_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);