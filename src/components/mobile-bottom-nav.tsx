import { Link, useLocation } from "@tanstack/react-router";
import { Home, FolderGit2, Briefcase, Mail, User } from "lucide-react";
import { useHiddenNav } from "@/lib/nav-settings";

export function MobileBottomNav() {
  const loc = useLocation();
  const { data: hidden = [] } = useHiddenNav();
  const all = [
    { to: "/", icon: Home },
    { to: "/sobre-mi", icon: User },
    { to: "/proyectos", icon: FolderGit2 },
    { to: "/experiencia", icon: Briefcase },
    { to: "/contacto", icon: Mail },
  ];
  const items = all.filter((it) => !hidden.includes(it.to));
  return (
    <div className="lg:hidden fixed bottom-4 inset-x-4 z-40 rounded-full border border-border bg-background/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex justify-around py-1.5">
      {items.map(({ to, icon: Icon }) => {
        const active = loc.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`p-3 rounded-full transition ${
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-5" />
          </Link>
        );
      })}
    </div>
  );
}
