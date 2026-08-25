import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const ease = [0.22, 1, 0.36, 1] as const;

export const Route = createFileRoute("/proyectos")({
  head: () => ({
    meta: [
      { title: "Proyectos — Elias Severino" },
      { name: "description", content: "Portfolio de proyectos full stack." },
    ],
  }),
  component: Proyectos,
});

function CardMedia({ project, hovered }: { project: any; hovered: boolean }) {
  if (project.video_url) {
    return (
      <motion.video
        src={project.video_url}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.8, ease }}
      />
    );
  }
  if (project.cover_url) {
    return (
      <motion.img
        src={project.cover_url}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.8, ease }}
      />
    );
  }
  return <div className="absolute inset-0 bg-secondary" />;
}

function BentoCard({ project, index, catLabel, hero }: { project: any; index: number; catLabel: string; hero: boolean }) {
  const [hovered, setHovered] = useState(false);
  const initials = (project.title ?? "").replace(/[^a-zA-Z0-9 ]/g, "").trim().slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.08, ease }}
      className={hero ? "col-span-full" : ""}
    >
      <Link
        to="/proyectos/$slug"
        params={{ slug: project.slug }}
        className={`group relative block overflow-hidden rounded-[28px] bg-secondary ${
          hero ? "aspect-[16/8] sm:aspect-[16/7]" : "aspect-[4/3.4] sm:aspect-[4/3]"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CardMedia project={project} hovered={hovered} />

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          animate={{ opacity: hovered ? 0.12 : 0 }}
          transition={{ duration: 0.4 }}
        />

        <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 flex items-center gap-3">
          {initials && (
            <div className="size-10 sm:size-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-white text-xs sm:text-sm">{initials}</span>
            </div>
          )}
          <div className="leading-tight">
            {project.title && (
              <div className="text-white font-semibold text-sm sm:text-base drop-shadow">{project.title}</div>
            )}
            {catLabel && (
              <motion.div
                className="text-white/60 text-xs sm:text-sm"
                animate={{ y: hovered ? 0 : 2, opacity: hovered ? 1 : 0.75 }}
                transition={{ duration: 0.35 }}
              >
                {catLabel}
              </motion.div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 12, y: -12, scale: 0.7 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, y: -12, scale: 0.7 }}
              transition={{ duration: 0.35, ease }}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 size-11 sm:size-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
            >
              <ArrowUpRight className="size-5" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hovered && Array.isArray(project.stack) && project.stack.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease }}
              className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 hidden sm:flex flex-wrap justify-end gap-1.5 max-w-[45%]"
            >
              {(project.stack as string[]).slice(0, 4).map((s) => (
                <span key={s} className="font-mono text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white/90">
                  {s}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {project.demo_url && (
          <div className="absolute top-5 left-5 sm:top-6 sm:left-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur border border-white/15 px-3 py-1.5 text-xs font-mono text-white">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Live
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

function Proyectos() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<string>("all");
  const { data: projects } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: async () => (await supabase.from("projects").select("*").order("display_order")).data ?? [],
  });
  const filters = [
    { id: "all", label: t.sections.all },
    { id: "web", label: t.sections.web },
    { id: "mobile", label: t.sections.mobile },
    { id: "ecommerce", label: t.sections.ecommerce },
    { id: "dashboard", label: t.sections.dashboard },
    { id: "api", label: t.sections.api },
  ];
  const catLabel = (id: string) => filters.find((f) => f.id === id)?.label ?? id;
  const list = (projects ?? []).filter((p) => filter === "all" || p.category === filter);

  return (
    <SiteLayout>
      <div className="px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t.nav.projects}</div>
          <h1 className="mt-3 font-display font-bold uppercase tracking-tight leading-[0.95] text-[clamp(2.5rem,8vw,6.5rem)]">
            {lang === "es" ? "Mira mi último trabajo" : "Take a look at my latest work"}
          </h1>
          <div className="mt-2 font-mono text-sm text-muted-foreground">({list.length})</div>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wide transition-colors duration-300 ${
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {list.map((p, i) => (
            <BentoCard key={p.id} project={p} index={i} catLabel={catLabel(p.category)} hero={i === 0} />
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
