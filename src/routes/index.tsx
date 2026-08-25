import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, ExternalLink, Github, Play, BookOpen, Maximize2 } from "lucide-react";
import { CvDownload } from "@/components/cv-download";
import { SiteLayout } from "@/components/site-layout";
import { Marquee, MarqueeWords } from "@/components/marquee";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TechBadges } from "@/components/tech-badges";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mat\u00edas Guti\u00e9rrez \u2014 Full Stack Developer" },
      { name: "description", content: "Portfolio de Mat\u00edas Guti\u00e9rrez. Aplicaciones web modernas, escalables y de alto rendimiento." },
    ],
  }),
  component: Index,
});

const ease = [0.22, 1, 0.36, 1] as const;

function AnimatedText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: delay + i * 0.025, ease }}
          className="inline-block"
          style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function HeroFloatCard({ project, className, depth, duration, mx, my }: { project: any; className: string; depth: number; duration: number; mx: any; my: any }) {
  const x = useSpring(useTransform(mx, (v: number) => v * depth), { stiffness: 50, damping: 20 });
  const y = useSpring(useTransform(my, (v: number) => v * depth), { stiffness: 50, damping: 20 });
  return (
    <motion.div style={{ x, y }} className={`absolute hidden lg:block z-[1] ${className}`}>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      >
        <Link
          to="/proyectos/$slug"
          params={{ slug: project.slug }}
          className="block overflow-hidden rounded-2xl border border-border bg-secondary shadow-2xl hover:border-primary/60 transition-colors duration-300"
        >
          <div className="relative aspect-video">
            {project.video_url ? (
              <video src={project.video_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <img src={project.cover_url} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-background/80 backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary shrink-0" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">{project.title}</span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function ProjectRow({ project, index, lang }: { project: any; index: number; lang: string }) {
  const [hovered, setHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const description = lang === "es" ? project.description_es : project.description_en;
  const longDescription = lang === "es" ? project.long_description_es : project.long_description_en;
  const stack = Array.isArray(project.stack) ? (project.stack as string[]) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
      className="group border-t border-border last:border-b"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-baseline justify-between gap-4 pt-6 px-2 sm:px-0">
        <div className="flex items-baseline gap-4 sm:gap-6 flex-1 min-w-0">
          <span className="font-mono text-xs text-primary tracking-widest shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className={`font-display font-bold uppercase tracking-tight leading-none transition-colors duration-300 text-[clamp(1.6rem,4.5vw,3.8rem)] ${
              hovered ? "text-primary" : "text-foreground"
            }`}
          >
            {project.title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: hovered ? 45 : 0 }}
          transition={{ duration: 0.35 }}
          className="shrink-0"
        >
          <ArrowUpRight className="size-6 sm:size-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        </motion.div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl aspect-[16/7] bg-secondary">
        {(() => {
          if (project.video_url) {
            return (
              <video
                src={project.video_url}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            );
          }
          if (project.cover_url) {
            return (
              <motion.img
                src={project.cover_url}
                alt={project.title}
                className="w-full h-full object-cover"
                animate={{ scale: hovered ? 1.04 : 1 }}
                transition={{ duration: 0.7, ease }}
              />
            );
          }
          return <div className="absolute inset-0 bg-secondary" />;
        })()}

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="size-16 sm:size-20 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors duration-300"
                  >
                    <Maximize2 className="size-6" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl tracking-tight">{project.title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                  </DialogHeader>
                  <div className="mt-2 space-y-4">
                    {project.cover_url && (
                      <img src={project.cover_url} alt={project.title} className="w-full rounded-xl border border-border" />
                    )}
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {longDescription || description}
                    </p>
                    {stack.length > 0 && <TechBadges stack={stack} size={22} />}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-mono uppercase tracking-wide hover:bg-foreground hover:text-background transition-colors duration-300">
                          <ExternalLink className="size-3.5" /> Live
                        </a>
                      )}
                      {project.repo_url && (
                        <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-mono uppercase tracking-wide hover:bg-accent transition-colors duration-300">
                          <Github className="size-3.5" /> Code
                        </a>
                      )}
                      {project.has_readme && (
                        <Link to="/proyectos/$slug/readme" params={{ slug: project.slug }}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-mono uppercase tracking-wide hover:bg-accent transition-colors duration-300">
                          <BookOpen className="size-3.5" /> README
                        </Link>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>

        {project.demo_url && (
          <div className="absolute top-4 left-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur border border-border px-3 py-1.5 text-xs font-mono">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Live
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pb-6 flex flex-wrap items-center justify-between gap-4 px-2 sm:px-0">
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{description}</p>
        <div className="flex flex-wrap items-center gap-2">
          {stack.slice(0, 5).map((s) => (
            <span key={s} className="font-mono text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">{s}</span>
          ))}
          {stack.length > 5 && (
            <span className="font-mono text-xs text-muted-foreground">+{stack.length - 5}</span>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-primary hover:text-foreground transition-colors duration-300">
              <ExternalLink className="size-3" /> Visit
            </a>
          )}
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300">
              <Github className="size-3" /> Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ServiceItem({ number, title, description, delay }: { number: string; title: string; description: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="border-t border-border last:border-b"
    >
      <button
        type="button"
        className="group w-full flex items-center justify-between py-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span className="font-mono text-xs text-primary tracking-widest">{number}</span>
          <span className="font-display font-bold uppercase tracking-tight text-xl sm:text-2xl group-hover:text-primary transition-colors duration-300">{title}</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-thin text-muted-foreground"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <p className="pl-10 sm:pl-16 pb-5 text-sm text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Index() {
  const { t, lang } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroMx = useMotionValue(0);
  const heroMy = useMotionValue(0);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await supabase.from("profiles").select("*").limit(1).maybeSingle()).data,
  });

  const { data: projects } = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: async () =>
      (await supabase.from("projects").select("*").eq("featured", true).order("display_order")).data ?? [],
  });

  const heroCards = ((projects ?? []) as any[]).filter((p) => p.video_url || p.cover_url).slice(0, 3);

  const techWords: string[] =
    ((profile as any)?.featured_technologies as string[] | undefined)?.length
      ? ((profile as any).featured_technologies as string[])
      : ["React", "Node.js", "TypeScript", "PostgreSQL", "Tailwind", "Supabase"];

  const name = (profile?.name ?? "Mat\u00edas Guti\u00e9rrez").split(" ");
  const firstName = name[0] ?? "Mat\u00edas";
  const lastName = name.slice(1).join(" ") || "Guti\u00e9rrez";

  const stats = [
    { value: `+${profile?.years_experience ?? 2}`, label: lang === "es" ? "A\u00f1os de\nexperiencia" : "Years of\nexperience" },
    { value: `+${profile?.projects_count ?? 20}`, label: lang === "es" ? "Proyectos\nentregados" : "Projects\ndelivered" },
    { value: `+${profile?.technologies_count ?? 15}`, label: lang === "es" ? "Tecnolog\u00edas\ndominadas" : "Technologies\nmastered" },
    { value: "100%", label: lang === "es" ? "Compromiso\ntotal" : "Total\ncommitment" },
  ];

  const services = lang === "es"
    ? [
        {
          n: "01",
          title: "Full Stack Applications",
          desc: "Desarrollo productos completos de punta a punta: desde la arquitectura de base de datos hasta la interfaz de usuario, pasando por la lógica de negocio, autenticación, pagos e integración con terceros. Stack: React, Next.js 14+, Remix, Astro (frontend) — Node.js, Express, Hono, Fastify, NestJS, AdonisJS (backend) — PostgreSQL, MySQL, MongoDB, Supabase, Redis (bases de datos) — Prisma, Drizzle ORM, TypeORM (ORM). Arquitecturas REST, GraphQL y tRPC. Autenticación con JWT, OAuth 2.0 y Supabase Auth. Pagos con Stripe y MercadoPago. Colas con BullMQ. Deploy en Vercel, Render, Railway o VPS con Docker y CI/CD. TypeScript end-to-end, código limpio, escalable y bien documentado.",
        },
        {
          n: "02",
          title: "Backend & APIs",
          desc: "Diseño e implemento APIs robustas, seguras y escalables con Node.js, Bun o Deno. Frameworks: Express, Hono, Fastify, NestJS, AdonisJS. Bases de datos relacionales (PostgreSQL, MySQL, SQLite) y NoSQL (MongoDB, Redis) con Prisma ORM, Drizzle ORM o Knex. REST, GraphQL (Apollo, Yoga), tRPC y WebSockets en tiempo real. Autenticación con JWT, OAuth 2.0, Passport.js y Supabase Auth. Testing con Vitest, Jest y Supertest. Integraciones: Stripe, MercadoPago, PayPal, Twilio, SendGrid, Cloudinary. Colas asíncronas con BullMQ, rate limiting, caché con Redis, Docker Compose y deploy productivo con migraciones automatizadas y monitoreo.",
        },
        {
          n: "03",
          title: "Frontend Development",
          desc: "Construyo interfaces modernas, rápidas y accesibles con React 18+, Next.js 14+ (App Router), Remix, Astro y Vue 3. TypeScript estricto, JavaScript ES2023+. Estilos con Tailwind CSS, SCSS, CSS Modules y Styled Components. Animaciones con Framer Motion, GSAP y React Spring. Estado global con Zustand, Redux Toolkit, Jotai y TanStack Query v5. Formularios con React Hook Form + Zod. Componentes con Shadcn/ui, Radix UI y Headless UI. Routing con TanStack Router y React Router v6. Bundling con Vite y Turbopack. Responsive mobile-first, Core Web Vitals, code splitting, lazy loading, accesibilidad WCAG 2.1 y SEO técnico. Testing con Vitest + Testing Library.",
        },
        {
          n: "04",
          title: "UI/UX & Diseño de Sistemas",
          desc: "Diseño sistemas visuales coherentes y de alto impacto con Figma: componentes reutilizables, tokens de diseño, guías tipográficas y paletas de color. Aplico jerarquía visual, teoría del color, composición editorial y micro-interacciones que añaden vida sin sacrificar usabilidad. Estilos: glassmorphism, neumorphism, bento grids, diseño tipo agencia editorial y dark UI premium. Siempre mobile-first y pixel-perfect, con transiciones suaves, arquitectura de componentes limpia y experiencias que se sienten naturales y de clase mundial.",
        },
      ]
    : [
        {
          n: "01",
          title: "Full Stack Applications",
          desc: "I build complete end-to-end products: from database architecture to UI, covering business logic, auth, payments and third-party integrations. Stack: React, Next.js 14+, Remix, Astro (frontend) — Node.js, Express, Hono, Fastify, NestJS, AdonisJS (backend) — PostgreSQL, MySQL, MongoDB, Supabase, Redis (databases) — Prisma, Drizzle ORM, TypeORM (ORM). REST, GraphQL and tRPC architectures. Auth with JWT, OAuth 2.0, Supabase Auth. Payments with Stripe and MercadoPago. Queues with BullMQ. Deployed on Vercel, Render, Railway or VPS with Docker and CI/CD. End-to-end TypeScript, clean and well-documented code.",
        },
        {
          n: "02",
          title: "Backend & APIs",
          desc: "I design and implement robust, secure and scalable APIs with Node.js, Bun or Deno. Frameworks: Express, Hono, Fastify, NestJS, AdonisJS. Relational (PostgreSQL, MySQL, SQLite) and NoSQL (MongoDB, Redis) databases with Prisma ORM, Drizzle ORM or Knex. REST, GraphQL (Apollo, Yoga), tRPC and real-time WebSockets. Auth with JWT, OAuth 2.0, Passport.js and Supabase Auth. Testing with Vitest, Jest and Supertest. Integrations: Stripe, MercadoPago, PayPal, Twilio, SendGrid, Cloudinary. Async queues with BullMQ, rate limiting, Redis caching, Docker Compose and production deploy with automated migrations and monitoring.",
        },
        {
          n: "03",
          title: "Frontend Development",
          desc: "I build modern, fast and accessible interfaces with React 18+, Next.js 14+ (App Router), Remix, Astro and Vue 3. Strict TypeScript, JavaScript ES2023+. Styling with Tailwind CSS, SCSS, CSS Modules and Styled Components. Animations with Framer Motion, GSAP and React Spring. State with Zustand, Redux Toolkit, Jotai and TanStack Query v5. Forms with React Hook Form + Zod. Components with Shadcn/ui, Radix UI and Headless UI. Routing with TanStack Router and React Router v6. Bundling with Vite and Turbopack. Responsive mobile-first, Core Web Vitals, code splitting, lazy loading, WCAG 2.1 accessibility and technical SEO. Testing with Vitest + Testing Library.",
        },
        {
          n: "04",
          title: "UI/UX & Design Systems",
          desc: "I design coherent, high-impact visual systems with Figma: reusable components, design tokens, typographic guides and color palettes. I apply visual hierarchy, color theory, editorial composition and micro-interactions that add life without sacrificing usability. Styles: glassmorphism, neumorphism, bento grids, editorial agency-level design and premium dark UI. Always mobile-first and pixel-perfect, with smooth transitions, clean component architecture and world-class experiences.",
        },
      ];

  return (
    <SiteLayout>
      <section
        ref={heroRef}
        onMouseMove={(e) => {
          const r = heroRef.current?.getBoundingClientRect();
          if (!r) return;
          heroMx.set(e.clientX - r.left - r.width / 2);
          heroMy.set(e.clientY - r.top - r.height / 2);
        }}
        className="relative min-h-[92vh] flex flex-col justify-between px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-24 right-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
          />
        </div>

        {heroCards[0] && (
          <HeroFloatCard project={heroCards[0]} mx={heroMx} my={heroMy} depth={0.045} duration={5.5} className="right-[3%] top-[13%] w-64 -rotate-3" />
        )}
        {heroCards[1] && (
          <HeroFloatCard project={heroCards[1]} mx={heroMx} my={heroMy} depth={-0.03} duration={6.5} className="right-[15%] top-[48%] w-44 rotate-2" />
        )}
        {heroCards[2] && (
          <HeroFloatCard project={heroCards[2]} mx={heroMx} my={heroMy} depth={0.025} duration={7} className="left-[38%] top-[9%] w-40 rotate-1" />
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-wrap items-center gap-3 pt-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs text-primary">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            {t.hero.available}
          </div>
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{t.hero.hello}</span>
          <div className="ml-auto hidden sm:block">
            <CvDownload variant="hero" />
          </div>
        </motion.div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
          <div className="font-display font-black uppercase leading-[0.88] tracking-tight select-none">
            <div className="overflow-hidden">
              <AnimatedText text={firstName} delay={0.05} className="text-[clamp(3.5rem,12vw,11rem)] block" />
            </div>
            <div className="overflow-hidden">
              <AnimatedText
                text={lastName}
                delay={0.18}
                className="text-[clamp(3.5rem,12vw,11rem)] block"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="mt-2 font-mono text-sm sm:text-base text-primary tracking-widest uppercase"
            >
              {lang === "es" ? (profile?.title_es ?? "Full Stack Developer") : (profile?.title_en ?? "Full Stack Developer")}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
            className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end"
          >
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              {lang === "es" ? profile?.bio_es : profile?.bio_en}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/proyectos"
                className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                {t.hero.viewProjects}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contacto"
                className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent transition-colors duration-300"
              >
                {t.nav.contact}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
              <div className="sm:hidden">
                <CvDownload variant="hero" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-3 pb-6"
        >
          <div className="h-8 w-px bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="size-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </section>

      <div className="border-t border-border">
        <div className="py-4 sm:py-5">
          <Marquee duration={55} repeat={3}>
            <MarqueeWords
              words={techWords}
              className="font-display font-bold uppercase tracking-tight text-2xl sm:text-4xl text-foreground"
            />
          </Marquee>
        </div>
        <div className="border-t border-border" />
        <div className="py-4 sm:py-5">
          <Marquee duration={68} reverse repeat={3}>
            <MarqueeWords
              words={techWords.slice().reverse()}
              className="font-display font-bold uppercase tracking-tight text-2xl sm:text-4xl text-muted-foreground"
            />
          </Marquee>
        </div>
      </div>
      <div className="border-b border-border" />

      <section className="mt-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-xs text-primary tracking-widest">01</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">Stats</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border border border-border rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="group relative px-5 sm:px-8 py-8 sm:py-12 flex flex-col gap-1 hover:bg-primary/5 transition-colors duration-500 overflow-hidden"
            >
              <div className="font-display font-black text-[clamp(3rem,7vw,6rem)] leading-none tracking-tight text-primary transition-transform duration-500 group-hover:scale-105 origin-bottom-left">
                {s.value}
              </div>
              <div className="my-3 h-px w-8 bg-primary/40 transition-all duration-500 group-hover:w-full" />
              <div className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground whitespace-pre-line leading-loose">
                {s.label}
              </div>
              <div
                className="pointer-events-none absolute -right-2 -bottom-4 font-display font-black text-[8rem] leading-none opacity-[0.04] select-none"
                aria-hidden
              >
                {s.value}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-24 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-primary tracking-widest">02</span>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {lang === "es" ? "Trabajo seleccionado" : "Selected work"}
              </span>
            </div>
            <h2 className="mt-2 font-display font-bold uppercase tracking-tight leading-none text-[clamp(2rem,5.5vw,4rem)]">
              {t.sections.featuredTitle}
            </h2>
          </div>
          <Link
            to="/proyectos"
            className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-300"
          >
            {t.sections.viewAll}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>

        <div className="space-y-0">
          {(projects ?? []).map((p, i) => (
            <ProjectRow key={p.id} project={p} index={i} lang={lang} />
          ))}
          {(projects ?? []).length === 0 && (
            <div className="py-24 text-center font-mono text-sm text-muted-foreground">
              {lang === "es" ? "Cargando proyectos..." : "Loading projects..."}
            </div>
          )}
        </div>
      </section>

      <section className="mt-24 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-xs text-primary tracking-widest">03</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">
            {lang === "es" ? "Qu\u00e9 construyo" : "What I build"}
          </h2>
        </div>
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-20">
          <div>
            {services.map((s, i) => (
              <ServiceItem key={s.n} number={s.n} title={s.title} description={s.desc} delay={i * 0.06} />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="hidden lg:flex flex-col gap-6"
          >
            <div className="rounded-2xl border border-border bg-card p-7">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                {lang === "es" ? "Sobre m\u00ed" : "About me"}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                {lang === "es" ? profile?.bio_es : profile?.bio_en}
              </p>
              <Link
                to="/sobre-mi"
                className="mt-5 group inline-flex items-center gap-2 text-sm text-primary hover:text-foreground transition-colors duration-300"
              >
                {t.hero.aboutMe}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card p-7">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">CV</div>
              <CvDownload variant="sidebar" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-24 max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="rounded-3xl border border-border bg-card overflow-hidden"
        >
          <div className="grid lg:grid-cols-[1fr_1px_1fr]">
            <div className="p-8 sm:p-12">
              <div className="font-mono text-xs uppercase tracking-widest text-primary mb-4">04</div>
              <h2 className="font-display font-bold uppercase tracking-tight text-[clamp(2rem,4vw,3rem)] leading-none">
                {lang === "es" ? "Creemos algo" : "Let's build"}
                <br />
                <span style={{ WebkitTextStroke: "1.5px var(--primary)", color: "transparent" }}>
                  {lang === "es" ? "juntos" : "something"}
                </span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-sm">
                {lang === "es"
                  ? "Estoy disponible para proyectos freelance, colaboraciones y oportunidades full time."
                  : "Available for freelance projects, collaborations and full-time opportunities."}
              </p>
              <Link
                to="/contacto"
                className="mt-8 group inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                {lang === "es" ? "Escribime" : "Contact me"}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </div>
            <div className="hidden lg:block bg-border" />
            <div className="p-8 sm:p-12 flex flex-col justify-center gap-5">
              {[
                { label: lang === "es" ? "Ubicaci\u00f3n" : "Location", value: profile?.location ?? "Buenos Aires, Argentina" },
                { label: "Email", value: profile?.email ?? "matugutierrez7@gmail.com" },
                { label: lang === "es" ? "Disponibilidad" : "Availability", value: lang === "es" ? "Freelance / Full time" : "Freelance / Full time" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
