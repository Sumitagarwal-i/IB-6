/*
  # Add BuiltWith API support and enhanced intelligence fields

  1. Schema Updates
    - Add jobSignals field for hiring intelligence
    - Add techStackData field for detailed tech analysis
    - Add intelligenceSources field for API attribution
    - Add companyLogo field for Clearbit integration

  2. Enhanced Intelligence
    - Support for BuiltWith API tech stack detection
    - JSearch hiring signals integration
    - NewsData.io enhanced news with source attribution
    - Clearbit logo and metadata integration

  3. Performance
    - Add indexes for better query performance
    - Optimize for production usage
*/

-- Add new columns for enhanced intelligence
DO $$
BEGIN
  -- Add jobSignals column for hiring intelligence
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'jobSignals'
  ) THEN
    ALTER TABLE briefs ADD COLUMN "jobSignals" json DEFAULT '[]'::json;
  END IF;

  -- Add techStackData column for detailed tech analysis
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'techStackData'
  ) THEN
    ALTER TABLE briefs ADD COLUMN "techStackData" json DEFAULT '[]'::json;
  END IF;

  -- Add intelligenceSources column for API attribution
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'intelligenceSources'
  ) THEN
    ALTER TABLE briefs ADD COLUMN "intelligenceSources" json DEFAULT '{}'::json;
  END IF;

  -- Add companyLogo column for Clearbit integration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'companyLogo'
  ) THEN
    ALTER TABLE briefs ADD COLUMN "companyLogo" text;
  END IF;

  -- Add hiringTrends column for hiring analysis
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'hiringTrends'
  ) THEN
    ALTER TABLE briefs ADD COLUMN "hiringTrends" text DEFAULT '';
  END IF;

  -- Add newsTrends column for news sentiment analysis
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'briefs' AND column_name = 'newsTrends'
  ) THEN
    ALTER TABLE briefs ADD COLUMN "newsTrends" text DEFAULT '';
  END IF;
END $$;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_briefs_website ON briefs(website);
CREATE INDEX IF NOT EXISTS idx_briefs_signal_tag_text ON briefs USING gin(to_tsvector('english', "signalTag"));

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Public access to briefs" ON briefs;
CREATE POLICY "Public access to briefs"
  ON briefs
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);