-- Add processed columns to sergiobarajas table
ALTER TABLE sergiobarajas 
ADD COLUMN IF NOT EXISTS autores_procesados text[],
ADD COLUMN IF NOT EXISTS resumen_sintetizado text;