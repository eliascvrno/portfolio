import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site-layout";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { TechLogo } from "@/components/tech-badges";
import { inferTechCategory } from "@/lib/tech-icons";
import { useState } from "react";

export const Route = createFileRoute("/tecnologias")({
  head: () => ({ meta: [{ title: "Tecnologías — Elias Severino" }, { name: "description", content: "Tecnologías dominadas." }] }),
  component: Tecnologias,
});

const CAT_LABELS_ES: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps / Cloud",
  design: "Diseño",
  tools: "Herramientas",
  ai: "IA",
};
const CAT_LABELS_EN: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps / Cloud",
  design: "Design",
  tools: "Tools",
  ai: "AI",
};

function Tecnologias() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["tech"],
    queryFn: async () => (await supabase.from("technologies").select("*").order("display_order")).data ?? [],
  });
  const [filter, setFilter] = useState<string>("all");
  const list = data ?? [];
  const labels = lang === "es" ? CAT_LABELS_ES : CAT_LABELS_EN;
  const grouped = list.reduce<Record<string, any[]>>((acc, tech) => {
    const c = inferTechCategory(tech.name);
    (acc[c] ||= []).push(tech);
    return acc;
  }, {});
  const cats = Object.keys(grouped);
  const filtered = filter === "all" ? list : grouped[filter] ?? [];

  return (
    <SiteLayout>
      <div className="px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t.nav.tech}</div>
          <h1 className="mt-3 font-display font-bold uppercase tracking-tight leading-[0.95] text-[clamp(2.5rem,7vw,5.5rem)]">
            {lang === "es" ? "Tecnologías" : "Technologies"}
          </h1>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            ({list.length} {lang === "es" ? "tecnologías" : "technologies"})
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wide transition-colors duration-300 ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
            }`}
          >
            {lang === "es" ? "Todos" : "All"} <span className="opacity-60">({list.length})</span>
          </button>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wide transition-colors duration-300 ${
                filter === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
              }`}
            >
              {labels[c] ?? c} <span className="opacity-60">({grouped[c].length})</span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {filtered.map((tech, i) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 10) * 0.03 }}
              className="group relative rounded-2xl border border-border bg-card p-5 flex flex-col items-center gap-3 hover:border-primary/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                <TechLogo name={tech.name} src={tech.icon_url} size={40} />
              </div>
              <div className="font-mono text-xs text-center truncate w-full group-hover:text-primary transition-colors duration-300">{tech.name}</div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-12">
              {lang === "es" ? "Sin resultados" : "No results"}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
