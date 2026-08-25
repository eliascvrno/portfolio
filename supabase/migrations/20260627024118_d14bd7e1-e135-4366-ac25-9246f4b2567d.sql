

CREATE POLICY "Public manage profile" ON public.profiles FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public insert profile" ON public.profiles FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public delete profile" ON public.profiles FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Public manage projects" ON public.projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage experiences" ON public.experiences FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage education" ON public.education FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage skills" ON public.skills FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage tech" ON public.technologies FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public manage messages" ON public.contact_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public delete messages" ON public.contact_messages FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Public read messages" ON public.contact_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read page_views" ON public.page_views FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experiences TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.technologies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO anon;
GRANT SELECT ON public.page_views TO anon;


ALTER TABLE public.page_views RENAME COLUMN referer TO referrer;
