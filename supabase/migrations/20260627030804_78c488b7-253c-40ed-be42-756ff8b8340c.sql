DROP POLICY IF EXISTS "Admin upload portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin update portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete portfolio-assets" ON storage.objects;

CREATE POLICY "Public upload portfolio-assets" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Public update portfolio-assets" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'portfolio-assets')
  WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Public delete portfolio-assets" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'portfolio-assets');