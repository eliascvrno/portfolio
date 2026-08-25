import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Admin" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") navigate({ to: "/admin" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) toast.error(error.message);
      else toast.success("Revisa tu email para confirmar la cuenta");
    }
    setLoading(false);
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(String(res.error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-bold">ES</div>
          <div>
            <div className="font-semibold">{t.auth.signin}</div>
            <div className="text-xs text-muted-foreground">Elias Severino</div>
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <input type="email" required placeholder={t.auth.email} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20" />
          <input type="password" required minLength={6} placeholder={t.auth.password} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20" />
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
            {mode === "signin" ? t.auth.signinBtn : t.auth.signup}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> o <div className="flex-1 h-px bg-border" />
        </div>

        <Button onClick={google} variant="outline" className="w-full gap-2">
          <Sparkles className="size-4 text-foreground" /> {t.auth.google}
        </Button>

        <button onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))} className="mt-6 text-xs text-muted-foreground hover:text-foreground w-full text-center">
          {mode === "signin" ? `${t.auth.noAccount} ${t.auth.signup}` : `${t.auth.haveAccount} ${t.auth.signinBtn}`}
        </button>

        <p className="mt-4 text-[11px] text-muted-foreground text-center leading-relaxed">{t.auth.firstAdmin}</p>
      </div>
    </div>
  );
}