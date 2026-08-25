
CREATE POLICY "Public read portfolio-assets" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin upload portfolio-assets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update portfolio-assets" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete portfolio-assets" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'));
