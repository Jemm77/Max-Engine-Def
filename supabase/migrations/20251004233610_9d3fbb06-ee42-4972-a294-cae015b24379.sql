-- Enable public read access to research publications
-- This is a public-facing research dashboard, so data should be readable by everyone

-- Add RLS policy for OpeDataScienceExtraction table
CREATE POLICY "Allow public read access to publications"
ON public."OpeDataScienceExtraction"
FOR SELECT
USING (true);

-- Add RLS policy for Extractor 2 table
CREATE POLICY "Allow public read access to extractions"
ON public."Extractor 2"
FOR SELECT
USING (true);
