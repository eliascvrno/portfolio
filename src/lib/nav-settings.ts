import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const NAV_KEYS = [
  "/",
  "/sobre-mi",
  "/proyectos",
  "/experiencia",
  "/habilidades",
  "/tecnologias",
  "/educacion",
  "/contacto",
] as const;
export type NavKey = (typeof NAV_KEYS)[number];

export async function fetchHiddenNav(): Promise<string[]> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "nav")
    .maybeSingle();
  const v = (data?.value as { hidden?: string[] } | null) ?? null;
  return Array.isArray(v?.hidden) ? (v!.hidden as string[]) : [];
}

export async function saveHiddenNav(hidden: string[]) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "nav", value: { hidden }, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export function useHiddenNav() {
  return useQuery({
    queryKey: ["site_settings", "nav"],
    queryFn: fetchHiddenNav,
    staleTime: 30_000,
  });
}