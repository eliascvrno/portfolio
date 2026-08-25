import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  FolderGit2, Briefcase, GraduationCap, Wrench, Code2, Mail,
  BarChart3, UserCog, LogOut, ArrowLeft, Menu, Zap,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { to: "/admin/proyectos",   label: "Proyectos",    icon: FolderGit2 },
  { to: "/admin/experiencia", label: "Experiencia",   icon: Briefcase },
  { to: "/admin/educacion",   label: "Educación",     icon: GraduationCap },
  { to: "/admin/habilidades", label: "Habilidades",   icon: Wrench },
  { to: "/admin/tecnologias", label: "Tecnologías",   icon: Code2 },
  { to: "/admin/mensajes",    label: "Mensajes",      icon: Mail },
  { to: "/admin/analiticas", label: "Analíticas",    icon: BarChart3 },
  { to: "/admin/perfil",      label: "Perfil",        icon: UserCog },
  { to: "/admin/menu",        label: "Menú del sitio", icon: Menu },
];

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const loc = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    window.localStorage.removeItem("admin_bypass");
    navigate({ to: "/", replace: true });
  };

  const NavList = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex-1 space-y-0.5">
      {NAV_ITEMS.map((it) => {
        const active = loc.pathname.startsWith(it.to);
        const Icon = it.icon;
        return (
          <Link
            key={it.to}
            to={it.to}
            onClick={onClick}
            className={[
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              active
                ? "bg-[oklch(0.88_0.2_128)/0.12] text-[oklch(0.88_0.2_128)] border border-[oklch(0.88_0.2_128)/0.2]"
                : "text-white/50 hover:text-white/90 hover:bg-white/5",
            ].join(" ")}
          >
            <Icon className="size-4 shrink-0" />
            <span>{it.label}</span>
            {active && <span className="ml-auto size-1.5 rounded-full bg-[oklch(0.88_0.2_128)]" />}
          </Link>
        );
      })}
    </nav>
  );

  const NavFooter = ({ onClick }: { onClick?: () => void }) => (
    <div className="pt-3 mt-3 border-t border-white/8 space-y-0.5">
      <Link
        to="/"
        onClick={onClick}
        className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
      >
        <ArrowLeft className="size-4" />
        Volver al sitio
      </Link>
      <button
        onClick={() => { onClick?.(); signOut(); }}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200"
      >
        <LogOut className="size-4" />
        Cerrar sesión
      </button>
    </div>
  );

  return (
    <div
      className="min-h-screen flex text-white"
      style={{ background: "oklch(0.13 0.002 260)", fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 p-4" style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        {}
        <div className="flex items-center gap-3 px-1 mb-6">
          <div
            className="size-9 rounded-xl flex items-center justify-center font-black text-sm"
            style={{ background: "oklch(0.88 0.2 128)", color: "oklch(0.13 0.002 260)" }}
          >
            ES
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">Portfolio</div>
            <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Admin</div>
          </div>
          <Zap className="ml-auto size-3.5" style={{ color: "oklch(0.88 0.2 128)" }} />
        </div>

        <NavList />
        <NavFooter />
      </aside>

      {}
      <div className="flex-1 min-w-0 flex flex-col">
        {}
        <header
          className="sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center gap-4 backdrop-blur-xl"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "oklch(0.13 0.002 260 / 0.85)" }}
        >
          {}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Menú"
                className="md:hidden p-2 rounded-xl transition-colors hover:bg-white/8"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 p-4 flex flex-col text-white"
              style={{ background: "oklch(0.13 0.002 260)", border: "none", borderRight: "1px solid rgba(255,255,255,0.07)" }}
            >
              <SheetTitle className="text-left text-white font-bold mb-4">Admin</SheetTitle>
              <div className="flex-1 flex flex-col">
                <NavList onClick={() => setOpen(false)} />
                <NavFooter onClick={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          {}
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-sm font-mono">Admin</span>
            <span className="text-white/20 text-xs">/</span>
            <h1 className="text-base font-bold tracking-tight">{title}</h1>
          </div>

          {}
          <div
            className="ml-auto hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
            style={{ background: "oklch(0.88 0.2 128 / 0.12)", border: "1px solid oklch(0.88 0.2 128 / 0.25)", color: "oklch(0.88 0.2 128)" }}
          >
            <span className="size-1.5 rounded-full animate-pulse" style={{ background: "oklch(0.88 0.2 128)" }} />
            Live
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
