-- Add AI-synthesized summary column to OpeDataScienceExtraction
ALTER TABLE public."OpeDataScienceExtraction"
ADD COLUMN IF NOT EXISTS resumen_sintetizado text;

-- Allow public read access (if needed)
ALTER TABLE public."OpeDataScienceExtraction" ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow public read access to OpeDataScienceExtraction"
ON public."OpeDataScienceExtraction"
FOR SELECT
USING (true);
