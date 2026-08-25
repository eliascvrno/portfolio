import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export function PageTracker() {
  const loc = useLocation();
  useEffect(() => {
    if (loc.pathname.startsWith("/admin") || loc.pathname.startsWith("/auth") || loc.pathname.startsWith("/api")) return;
    const referrer = typeof document !== "undefined" ? document.referrer : null;
    void supabase.from("page_views").insert([{ path: loc.pathname, referrer: referrer || null } as any]).then(() => {});
  }, [loc.pathname]);
  return null;
}