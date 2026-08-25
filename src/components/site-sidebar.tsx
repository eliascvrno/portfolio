import { Link, useLocation } from "@tanstack/react-router";
import { Home, User, FolderGit2, Briefcase, Wrench, Code2, GraduationCap, Mail, Github, Linkedin, Languages, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { AdminLoginDialog } from "@/components/admin-login-dialog";
import { useHiddenNav } from "@/lib/nav-settings";
import { CvDownload } from "@/components/cv-download";
import { useProfile, normalizeUrl } from "@/lib/use-profile";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { OsThemeSwitcher } from "@/components/os-theme-switcher";

export function SiteSidebar() {
  const { t, lang, setLang } = useI18n();
  const loc = useLocation();
  const { data: hidden = [] } = useHiddenNav();
  const { data: profile } = useProfile();

  const allItems = [
    { to: "/", label: t.nav.home, icon: Home },
    { to: "/sobre-mi", label: t.nav.about, icon: User },
    { to: "/proyectos", label: t.nav.projects, icon: FolderGit2 },
    { to: "/experiencia", label: t.nav.experience, icon: Briefcase },
    { to: "/habilidades", label: t.nav.skills, icon: Wrench },
    { to: "/tecnologias", label: t.nav.tech, icon: Code2 },
    { to: "/educacion", label: t.nav.education, icon: GraduationCap },
    { to: "/contacto", label: t.nav.contact, icon: Mail },
  ];
  const items = allItems.filter((it) => !hidden.includes(it.to));

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-sidebar text-sidebar-foreground p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="size-12 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-bold text-lg">
          MG
        </div>
        <div>
          <div className="font-semibold tracking-tight text-sidebar-foreground">Elias Severino</div>
          <div className="text-xs text-sidebar-foreground/95">Full Stack Developer</div>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {items.map((it) => {
          const active = loc.pathname === it.to || (it.to !== "/" && loc.pathname.startsWith(it.to));
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-gradient-to-r from-white/5 to-white/5 text-foreground border border-border"
                  : "text-sidebar-foreground/95 hover:text-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="size-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border pt-4 space-y-3">
        <CvDownload variant="sidebar" />
        <div className="text-xs text-sidebar-foreground/95">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_6px_#22c55e]" />
            {t.hero.availableNew}
          </div>
        </div>
        <Link to="/contacto">
          <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white border-0">
            {t.hero.contact}
          </Button>
        </Link>
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2 text-sidebar-foreground/95">
            {profile?.github_url && (
              <a href={normalizeUrl(profile.github_url)} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><Github className="size-4" /></a>
            )}
            {profile?.linkedin_url && (
              <a href={normalizeUrl(profile.linkedin_url)} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><Linkedin className="size-4" /></a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-foreground"><Mail className="size-4" /></a>
            )}
            <AdminLoginDialog
              trigger={
                <button type="button" aria-label="Admin" className="hover:text-foreground">
                  <Settings className="size-4" />
                </button>
              }
            />
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setLang(lang === "es" ? "en" : "es")} className="px-2 py-1 text-xs rounded hover:bg-sidebar-accent flex items-center gap-1">
              <Languages className="size-3.5" /> {lang.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileTopBar() {
  const { t, lang, setLang } = useI18n();
  const loc = useLocation();
  const { data: hidden = [] } = useHiddenNav();
  const { data: profile } = useProfile();
  const [open, setOpen] = useState(false);

  const allItems = [
    { to: "/", label: t.nav.home, icon: Home },
    { to: "/sobre-mi", label: t.nav.about, icon: User },
    { to: "/proyectos", label: t.nav.projects, icon: FolderGit2 },
    { to: "/experiencia", label: t.nav.experience, icon: Briefcase },
    { to: "/habilidades", label: t.nav.skills, icon: Wrench },
    { to: "/tecnologias", label: t.nav.tech, icon: Code2 },
    { to: "/educacion", label: t.nav.education, icon: GraduationCap },
    { to: "/contacto", label: t.nav.contact, icon: Mail },
  ];
  const items = allItems.filter((it) => !hidden.includes(it.to));

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-sidebar/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-bold text-sm">MG</div>
        <span className="font-semibold text-sidebar-foreground">Elias Severino</span>
      </Link>
      <div className="flex items-center gap-2">
        <CvDownload variant="mobile" />
        <OsThemeSwitcher floating={false} />
        <button onClick={() => setLang(lang === "es" ? "en" : "es")} className="px-2 py-1 text-xs rounded hover:bg-sidebar-accent">{lang.toUpperCase()}</button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button type="button" aria-label="Menu" className="p-1.5 rounded hover:bg-sidebar-accent">
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-sidebar text-sidebar-foreground p-6 flex flex-col">
            <SheetTitle className="text-left">Menú</SheetTitle>
            <nav className="mt-4 flex-1 space-y-1 overflow-y-auto">
              {items.map((it) => {
                const active = loc.pathname === it.to || (it.to !== "/" && loc.pathname.startsWith(it.to));
                const Icon = it.icon;
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                      active ? "bg-white/5 text-foreground border border-border" : "text-sidebar-foreground/85 hover:text-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon className="size-4" />
                    {it.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div className="flex gap-3 text-sidebar-foreground/80">
                {profile?.github_url && (
                  <a href={normalizeUrl(profile.github_url)} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><Github className="size-4" /></a>
                )}
                {profile?.linkedin_url && (
                  <a href={normalizeUrl(profile.linkedin_url)} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><Linkedin className="size-4" /></a>
                )}
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="hover:text-foreground"><Mail className="size-4" /></a>
                )}
              </div>
              <AdminLoginDialog
                trigger={
                  <button type="button" aria-label="Admin" className="flex items-center gap-2 px-3 py-1.5 rounded border border-border text-xs hover:bg-sidebar-accent">
                    <Settings className="size-4" /> Admin
                  </button>
                }
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}