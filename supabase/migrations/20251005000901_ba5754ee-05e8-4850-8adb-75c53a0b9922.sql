-- Create new table for processed publications
CREATE TABLE public."sergiobarajas2" (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT,
  autores_originales TEXT,
  autores_procesados TEXT[], -- Array of extracted author names
  resumen_original TEXT,
  resumen_sintetizado TEXT, -- AI-synthesized summary
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public."sergiobarajas2" ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to processed articles"
ON public."sergiobarajas2"
FOR SELECT
USING (true);

-- Allow insert for processing (you can restrict this later)
CREATE POLICY "Allow insert for processing"
ON public."sergiobarajas2"
FOR INSERT
WITH CHECK (true);