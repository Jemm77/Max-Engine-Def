-- Enable public read access to sergiobarajas table
CREATE POLICY "Allow public read access to sergiobarajas articles"
ON public."sergiobarajas"
FOR SELECT
USING (true);