/*
  # Fix briefs table schema

  1. Schema Updates
    - Fix column naming inconsistencies (companyName vs companyname)
    - Ensure all required columns exist with proper types
    - Add proper indexes for performance
    - Update RLS policies

  2. Data Migration
    - Safely rename columns if they exist
    - Add missing columns with defaults
    - Preserve existing data

  3. Security
    - Maintain RLS policies
    - Ensure proper access controls
*/

-- First, check if the table exists and create/update it
CREATE TABLE IF NOT EXISTS briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  companyname text NOT NULL,
  website text,
  userintent text NOT NULL,
  summary text DEFAULT '',
  news json DEFAULT '[]',
  techstack text[] DEFAULT '{}',
  pitchangle text DEFAULT '',
  subjectline text DEFAULT '',
  whatnottopitch text DEFAULT '',
  signaltag text DEFAULT '',
  createdat timestamptz DEFAULT now()
);

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Check and add companyName column (with capital N) if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'companyName'
  ) THEN
    -- If companyname exists, rename it to companyName
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'briefs' AND column_name = 'companyname'
    ) THEN
      ALTER TABLE briefs RENAME COLUMN companyname TO "companyName";
    ELSE
      ALTER TABLE briefs ADD COLUMN "companyName" text NOT NULL DEFAULT '';
    END IF;
  END IF;

  -- Check and add userIntent column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'userIntent'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'briefs' AND column_name = 'userintent'
    ) THEN
      ALTER TABLE briefs RENAME COLUMN userintent TO "userIntent";
    ELSE
      ALTER TABLE briefs ADD COLUMN "userIntent" text NOT NULL DEFAULT '';
    END IF;
  END IF;

  -- Check and add techStack column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'techStack'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'briefs' AND column_name = 'techstack'
    ) THEN
      ALTER TABLE briefs RENAME COLUMN techstack TO "techStack";
    ELSE
      ALTER TABLE briefs ADD COLUMN "techStack" text[] DEFAULT '{}';
    END IF;
  END IF;

  -- Check and add pitchAngle column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'pitchAngle'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'briefs' AND column_name = 'pitchangle'
    ) THEN
      ALTER TABLE briefs RENAME COLUMN pitchangle TO "pitchAngle";
    ELSE
      ALTER TABLE briefs ADD COLUMN "pitchAngle" text DEFAULT '';
    END IF;
  END IF;

  -- Check and add subjectLine column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'subjectLine'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'briefs' AND column_name = 'subjectline'
    ) THEN
      ALTER TABLE briefs RENAME COLUMN subjectline TO "subjectLine";
    ELSE
      ALTER TABLE briefs ADD COLUMN "subjectLine" text DEFAULT '';
    END IF;
  END IF;

  -- Check and add whatNotToPitch column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'whatNotToPitch'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'briefs' AND column_name = 'whatnottopitch'
    ) THEN
      ALTER TABLE briefs RENAME COLUMN whatnottopitch TO "whatNotToPitch";
    ELSE
      ALTER TABLE briefs ADD COLUMN "whatNotToPitch" text DEFAULT '';
    END IF;
  END IF;

  -- Check and add signalTag column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'signalTag'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'briefs' AND column_name = 'signaltag'
    ) THEN
      ALTER TABLE briefs RENAME COLUMN signaltag TO "signalTag";
    ELSE
      ALTER TABLE briefs ADD COLUMN "signalTag" text DEFAULT '';
    END IF;
  END IF;

  -- Check and add createdAt column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'createdAt'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'briefs' AND column_name = 'createdat'
    ) THEN
      ALTER TABLE briefs RENAME COLUMN createdat TO "createdAt";
    ELSE
      ALTER TABLE briefs ADD COLUMN "createdAt" timestamptz DEFAULT now();
    END IF;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

-- Create or replace RLS policies
DROP POLICY IF EXISTS "Public access to briefs" ON briefs;
CREATE POLICY "Public access to briefs"
  ON briefs
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_briefs_company_name ON briefs("companyName");
CREATE INDEX IF NOT EXISTS idx_briefs_signal_tag ON briefs("signalTag");