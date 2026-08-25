import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { Marquee, MarqueeWords } from "@/components/marquee";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const Route = createFileRoute("/sobre-mi")({
  head: () => ({
    meta: [
      { title: "Sobre mí — Elias Severino" },
      { name: "description", content: "Conoce a Elias Severino, desarrollador full stack." },
    ],
  }),
  component: SobreMi,
});

function SobreMi() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await supabase.from("profiles").select("*").limit(1).maybeSingle()).data,
  });
  return (
    <SiteLayout>
      <div className="px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t.nav.about}</div>
          <h1 className="mt-3 font-display font-bold uppercase tracking-tight leading-[0.95] text-[clamp(2.5rem,8vw,6.5rem)]">
            {data?.name ?? "Elias Severino"}
          </h1>
          <p className="mt-4 font-display text-xl sm:text-2xl text-primary font-semibold">
            {lang === "es" ? data?.title_es : data?.title_en}
          </p>
        </motion.div>
      </div>

      <div className="mt-12 border-y border-border py-3">
        <Marquee duration={24} repeat={4}>
          <MarqueeWords
            words={lang === "es" ? ["Diseño cuidado", "Código limpio", "Experiencias excepcionales"] : ["Careful design", "Clean code", "Exceptional experiences"]}
            className="font-display font-bold uppercase tracking-tight text-xl sm:text-2xl text-muted-foreground"
          />
        </Marquee>
      </div>

      <div className="px-4 sm:px-8 max-w-7xl mx-auto mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-lg leading-relaxed text-foreground/90 max-w-2xl"
        >
          <p>{lang === "es" ? data?.bio_es : data?.bio_en}</p>
          <p className="mt-6 text-muted-foreground">
            {lang === "es"
              ? "Mi pasión es construir productos digitales que combinan diseño cuidado, código limpio y experiencias excepcionales. Trabajo con stacks modernos enfocados en escalabilidad y mantenibilidad."
              : "My passion is building digital products that combine careful design, clean code and exceptional experiences. I work with modern stacks focused on scalability and maintainability."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors duration-300">
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Email</div>
            <div className="mt-2 font-display text-lg font-semibold break-all group-hover:text-primary transition-colors">{data?.email ?? "—"}</div>
          </div>
          <div className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors duration-300">
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{lang === "es" ? "Ubicación" : "Location"}</div>
            <div className="mt-2 font-display text-lg font-semibold group-hover:text-primary transition-colors">{data?.location ?? "—"}</div>
          </div>
        </motion.div>
      </div>
    </SiteLayout>
  );
}
