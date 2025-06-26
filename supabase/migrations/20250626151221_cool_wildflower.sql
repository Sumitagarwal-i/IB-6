/*
  # Create briefs table for IntelliBrief app

  1. New Tables
    - `briefs`
      - `id` (uuid, primary key)
      - `companyName` (text, required)
      - `website` (text, optional)
      - `userIntent` (text, required)
      - `summary` (text, AI-generated executive summary)
      - `news` (json, array of news items)
      - `techStack` (text[], array of technologies)
      - `pitchAngle` (text, AI-generated pitch strategy)
      - `subjectLine` (text, suggested email subject)
      - `whatNotToPitch` (text, AI-generated warnings)
      - `signalTag` (text, brief signal description)
      - `createdAt` (timestamp, auto-generated)

  2. Security
    - Enable RLS on `briefs` table
    - Add policy for public access (since this is a demo app)
*/

CREATE TABLE IF NOT EXISTS briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  companyName text NOT NULL,
  website text,
  userIntent text NOT NULL,
  summary text NOT NULL DEFAULT '',
  news json DEFAULT '[]'::json,
  techStack text[] DEFAULT '{}',
  pitchAngle text NOT NULL DEFAULT '',
  subjectLine text NOT NULL DEFAULT '',
  whatNotToPitch text NOT NULL DEFAULT '',
  signalTag text NOT NULL DEFAULT '',
  createdAt timestamptz DEFAULT now()
);

ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

-- Allow public access for demo purposes
CREATE POLICY "Public access to briefs"
  ON briefs
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);