import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { ChatWidget } from "./chat-widget";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 w-full pt-24 sm:pt-28">
        {children}
      </main>
      <SiteFooter />
      <MobileBottomNav />
      <ChatWidget />
    </div>
  );
}
