import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site-layout";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { formatDateRange } from "@/lib/utils-format";

export const Route = createFileRoute("/educacion")({
  head: () => ({ meta: [{ title: "Educación — Elias Severino" }, { name: "description", content: "Formación académica." }] }),
  component: Educacion,
});

function Educacion() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["education"],
    queryFn: async () => (await supabase.from("education").select("*").order("display_order")).data ?? [],
  });
  return (
    <SiteLayout>
      <div className="px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t.nav.education}</div>
          <h1 className="mt-3 font-display font-bold uppercase tracking-tight leading-[0.95] text-[clamp(2.5rem,7vw,5.5rem)]">
            {lang === "es" ? "Formación académica" : "Academic background"}
          </h1>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {(data ?? []).map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card p-7 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <GraduationCap className="size-4 text-primary" /> {e.institution}
              </div>
              <div className="mt-3 font-display text-xl sm:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                {lang === "es" ? e.degree_es : e.degree_en}
              </div>
              <div className="capitalize font-mono text-xs text-muted-foreground mt-2">{formatDateRange(e.start_date, e.end_date, lang)}</div>
              {(e.description_es || e.description_en) && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{lang === "es" ? e.description_es : e.description_en}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
