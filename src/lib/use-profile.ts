import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
      return data;
    },
    staleTime: 60_000,
  });
}

export function normalizeUrl(url: string | null | undefined, fallback = "#") {
  if (!url) return fallback;
  const u = url.trim();
  if (!u) return fallback;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("mailto:") || u.startsWith("tel:")) return u;
  return `https://${u}`;
}