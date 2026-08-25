import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Github, Linkedin, Mail, Settings } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useProfile, normalizeUrl } from "@/lib/use-profile";
import { AdminLoginDialog } from "@/components/admin-login-dialog";
import { CvDownload } from "@/components/cv-download";
import { Marquee } from "@/components/marquee";
import { useNavItems } from "@/components/site-header";

export function SiteFooter() {
  const { t, lang } = useI18n();
  const { data: profile } = useProfile();
  const items = useNavItems();

  return (
    <footer className="mt-24">
      <Link to="/contacto" className="block group border-y border-border bg-primary text-primary-foreground">
        <Marquee duration={20} repeat={3} className="py-5 sm:py-7">
          <span className="inline-flex items-center font-display font-bold uppercase tracking-tight text-3xl sm:text-5xl">
            <span>{lang === "es" ? "Trabajemos juntos" : "Let’s work together"}</span>
            <ArrowUpRight className="size-8 sm:size-12 mx-6 transition-transform duration-300 group-hover:rotate-45" />
            <span className="text-outline" style={{ WebkitTextStroke: "1.5px currentColor" }}>
              {lang === "es" ? "Trabajemos juntos" : "Let’s work together"}
            </span>
            <ArrowUpRight className="size-8 sm:size-12 mx-6 transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </Marquee>
      </Link>

      <div className="px-4 sm:px-8 pt-14 pb-28 lg:pb-10 max-w-7xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display font-bold tracking-tight text-3xl sm:text-4xl leading-none">
              Elias Severino<span className="text-primary">.</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Full Stack Developer
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs text-primary">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              {t.hero.availableNew}
            </div>
            <div className="mt-6 max-w-[220px]">
              <CvDownload variant="sidebar" />
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Sections</div>
            <nav className="flex flex-col gap-2">
              {items.map((it) => (
                <Link key={it.to} to={it.to} className="hover-underline w-fit text-sm text-foreground/85 hover:text-foreground">
                  {it.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
              {lang === "es" ? "Conectar" : "Connect"}
            </div>
            <div className="flex flex-col gap-2 text-sm">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="hover-underline w-fit inline-flex items-center gap-2 text-foreground/85 hover:text-foreground">
                  <Mail className="size-4 text-primary" /> {profile.email}
                </a>
              )}
              {profile?.github_url && (
                <a href={normalizeUrl(profile.github_url)} target="_blank" rel="noopener noreferrer" className="hover-underline w-fit inline-flex items-center gap-2 text-foreground/85 hover:text-foreground">
                  <Github className="size-4 text-primary" /> GitHub
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={normalizeUrl(profile.linkedin_url)} target="_blank" rel="noopener noreferrer" className="hover-underline w-fit inline-flex items-center gap-2 text-foreground/85 hover:text-foreground">
                  <Linkedin className="size-4 text-primary" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Elias Severino. {lang === "es" ? "Todos los derechos reservados." : "All rights reserved."}</div>
          <AdminLoginDialog
            trigger={
              <button type="button" aria-label="Admin" className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 hover:bg-accent hover:text-foreground transition">
                <Settings className="size-3.5" /> Admin
              </button>
            }
          />
        </div>
      </div>
    </footer>
  );
}
