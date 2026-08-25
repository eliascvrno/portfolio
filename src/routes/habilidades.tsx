import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site-layout";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { TechLogo } from "@/components/tech-badges";

export const Route = createFileRoute("/habilidades")({
  head: () => ({ meta: [{ title: "Habilidades — Elias Severino" }, { name: "description", content: "Habilidades técnicas." }] }),
  component: Habilidades,
});

const CAT_META: Record<string, { es: string; en: string; tag: string }> = {
  frontend: { es: "Frontend", en: "Frontend", tag: "ui" },
  backend: { es: "Backend", en: "Backend", tag: "srv" },
  devops: { es: "DevOps / Cloud", en: "DevOps / Cloud", tag: "ops" },
  design: { es: "Diseño", en: "Design", tag: "dsg" },
  tools: { es: "Herramientas", en: "Tools", tag: "tool" },
};

function Habilidades() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => (await supabase.from("skills").select("*").order("display_order")).data ?? [],
  });
  const grouped = (data ?? []).reduce<Record<string, typeof data>>((acc, s) => {
    if (!s) return acc;
    (acc[s.category] ||= [] as any).push(s);
    return acc;
  }, {});

  return (
    <SiteLayout>
      <div className="px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t.nav.skills}</div>
          <h1 className="mt-3 font-display font-bold uppercase tracking-tight leading-[0.95] text-[clamp(2.5rem,7vw,5.5rem)]">
            {lang === "es" ? "Habilidades" : "Skills"}
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground">
            {lang === "es" ? "// agrupado automáticamente por categoría" : "// auto-grouped by category"}
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {Object.entries(grouped).map(([cat, items], idx) => {
            const meta = CAT_META[cat] ?? { es: cat, en: cat, tag: cat.slice(0, 3) };
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors duration-300"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-primary tracking-widest">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="font-display font-bold uppercase tracking-tight text-lg group-hover:text-primary transition-colors duration-300">
                      {lang === "es" ? meta.es : meta.en}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    ~/{meta.tag} · {(items ?? []).length}
                  </span>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {(items ?? []).map((s: any) => (
                    <div
                      key={s.id}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-background hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <TechLogo name={s.name} size={16} />
                      <span className="font-mono text-xs">{s.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SiteLayout>
  );
}
