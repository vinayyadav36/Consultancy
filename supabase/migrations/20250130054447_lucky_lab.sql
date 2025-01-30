/*
  # Create inquiries and admin tables

  1. New Tables
    - `inquiries`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `status` (text) - can be 'new', 'in_progress', 'completed'
      - `created_at` (timestamp)
      - `admin_notes` (text)

  2. Security
    - Enable RLS on `inquiries` table
    - Add policies for admin access
*/

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  admin_notes text
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admins full access to inquiries"
  ON inquiries
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%@digigrowth.com');