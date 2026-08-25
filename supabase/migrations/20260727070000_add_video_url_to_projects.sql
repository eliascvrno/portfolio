-- Animaciones/videos de proyectos gestionados desde /admin (Supabase Storage), no en public/videos
alter table public.projects add column if not exists video_url text;
