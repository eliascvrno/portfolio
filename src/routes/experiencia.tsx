import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { formatDateRange } from "@/lib/utils-format";
import { motion } from "framer-motion";

export const Route = createFileRoute("/experiencia")({
  head: () => ({ meta: [{ title: "Experiencia — Elias Severino" }, { name: "description", content: "Trayectoria profesional." }] }),
  component: Experiencia,
});

function Experiencia() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => (await supabase.from("experiences").select("*").order("display_order")).data ?? [],
  });
  return (
    <SiteLayout>
      <div className="px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t.nav.experience}</div>
          <h1 className="mt-3 font-display font-bold uppercase tracking-tight leading-[0.95] text-[clamp(2.5rem,7vw,5.5rem)]">
            {lang === "es" ? "Trayectoria profesional" : "Professional journey"}
          </h1>
        </motion.div>

        <div className="mt-14">
          {(data ?? []).map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group border-t border-border last:border-b py-8 grid gap-4 md:grid-cols-[110px_1fr_auto] md:items-start hover:bg-card/60 transition-colors duration-300 px-2 sm:px-4 -mx-2 sm:-mx-4"
            >
              <div className="font-mono text-xs text-muted-foreground pt-2 tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="size-3.5 text-primary" /> {e.company}
                  {e.location && <span>· {e.location}</span>}
                </div>
                <div className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                  {lang === "es" ? e.role_es : e.role_en}
                </div>
                <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {lang === "es" ? e.description_es : e.description_en}
                </p>
              </div>
              <div className="font-mono text-xs text-muted-foreground md:text-right pt-2">
                {formatDateRange(e.start_date, e.end_date, lang)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
