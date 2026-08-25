import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { useI18n } from "@/lib/i18n";
import { useHiddenNav } from "@/lib/nav-settings";
import { useProfile, normalizeUrl } from "@/lib/use-profile";
import { CvDownload } from "@/components/cv-download";

export function useNavItems() {
  const { t } = useI18n();
  const { data: hidden = [] } = useHiddenNav();
  const allItems = [
    { to: "/", label: t.nav.home },
    { to: "/sobre-mi", label: t.nav.about },
    { to: "/proyectos", label: t.nav.projects },
    { to: "/experiencia", label: t.nav.experience },
    { to: "/habilidades", label: t.nav.skills },
    { to: "/tecnologias", label: t.nav.tech },
    { to: "/educacion", label: t.nav.education },
    { to: "/contacto", label: t.nav.contact },
  ];
  return allItems.filter((it) => !hidden.includes(it.to));
}

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const loc = useLocation();
  const items = useNavItems();
  const { data: profile } = useProfile();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[70]">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-4 py-2"
          >
            <span className="font-display font-bold tracking-tight text-sm sm:text-base">
              Elias Severino
            </span>
            <span className="text-primary transition-transform duration-300 group-hover:rotate-45">®</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <CvDownload variant="hero" />
            </div>
<button
              type="button"
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="rounded-full border border-border bg-background/80 backdrop-blur px-3 py-2 text-xs font-mono uppercase hover:bg-accent transition"
              aria-label="Language"
            >
              <span className={lang === "es" ? "text-foreground" : "text-muted-foreground"}>es</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span className={lang === "en" ? "text-foreground" : "text-muted-foreground"}>en</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Menu"
              className={`group inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                open
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              <span className="hidden sm:inline uppercase tracking-wide text-xs font-mono">
                {open ? (lang === "es" ? "Cerrar" : "Close") : "Menú"}
              </span>
              <span className="relative block w-5 h-3">
                <span
                  className={`absolute left-0 top-0 h-[2px] w-5 bg-current transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute left-0 bottom-0 h-[2px] w-5 bg-current transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[65] bg-background flex flex-col"
          >
            <div className="flex-1 overflow-y-auto pt-24 pb-8 px-4 sm:px-8 grid lg:grid-cols-[1fr_minmax(260px,360px)] gap-10">
              <nav className="flex flex-col justify-center">
                {items.map((it, i) => {
                  const active = loc.pathname === it.to || (it.to !== "/" && loc.pathname.startsWith(it.to));
                  return (
                    <motion.div
                      key={it.to}
                      initial={{ y: 48, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 24, opacity: 0 }}
                      transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="border-b border-border"
                    >
                      <Link
                        to={it.to}
                        onClick={() => setOpen(false)}
                        className="menu-giant group flex items-baseline gap-4 py-2 sm:py-3 text-[clamp(1.5rem,4.5vh,3rem)]"
                      >
                        <span className="font-mono text-xs sm:text-sm text-muted-foreground tracking-widest">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={active ? "text-primary" : ""}>{it.label}</span>
                        <ArrowUpRight className="size-6 sm:size-9 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="hidden lg:flex flex-col justify-center gap-8 border-l border-border pl-10"
              >
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Status</div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary">
                    <span className="size-2 rounded-full bg-primary animate-pulse" />
                    {t.hero.availableNew}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Contacto</div>
                  <div className="flex flex-col gap-2 text-sm">
                    {profile?.email && (
                      <a href={`mailto:${profile.email}`} className="hover-underline w-fit inline-flex items-center gap-2">
                        <Mail className="size-4 text-primary" /> {profile.email}
                      </a>
                    )}
                    {profile?.github_url && (
                      <a href={normalizeUrl(profile.github_url)} target="_blank" rel="noopener noreferrer" className="hover-underline w-fit inline-flex items-center gap-2">
                        <Github className="size-4 text-primary" /> GitHub
                      </a>
                    )}
                    {profile?.linkedin_url && (
                      <a href={normalizeUrl(profile.linkedin_url)} target="_blank" rel="noopener noreferrer" className="hover-underline w-fit inline-flex items-center gap-2">
                        <Linkedin className="size-4 text-primary" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">CV</div>
                  <CvDownload variant="sidebar" />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45 }}
              className="border-t border-border py-3 bg-primary text-primary-foreground"
            >
              <div className="marquee">
                <div className="marquee-track" style={{ "--marquee-duration": "42s" } as CSSProperties}>
                  {[0, 1].map((k) => (
                    <span key={k} className="inline-flex items-center font-display font-bold uppercase tracking-tight text-lg">
                      {(lang === "es"
                        ? [
                            "Full Stack Developer",
                            "Disponible para proyectos",
                            "React · Node.js · TypeScript",
                            "Guayaquil, Ecuador",
                            "Diseño + Código",
                            "Abierto a colaborar",
                            "Interfaces rápidas y escalables",
                            "Backend robusto con Node & Postgres",
                          ]
                        : [
                            "Full Stack Developer",
                            "Available for projects",
                            "React · Node.js · TypeScript",
                            "Guayaquil, Ecuador",
                            "Design + Code",
                            "Open to collaborate",
                            "Fast & scalable interfaces",
                            "Robust backend with Node & Postgres",
                          ]
                      ).map((phrase, i) => (
                        <span key={i} className="inline-flex items-center">
                          <span>{phrase}</span>
                          <span className="ticker-dot" />
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
