import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { SiteLayout } from "@/components/site-layout";
import { Marquee, MarqueeWords } from "@/components/marquee";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, normalizeUrl } from "@/lib/use-profile";

export const Route = createFileRoute("/contacto")({
  head: () => ({ meta: [{ title: "Contacto — Elias Severino" }, { name: "description", content: "Escríbeme para colaborar." }] }),
  component: Contacto,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5).max(2000),
});

const inputCls =
  "w-full bg-transparent border-0 border-b border-border rounded-none px-0 py-4 text-lg placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors duration-300";

function Contacto() {
  const { t, lang } = useI18n();
  const { data: profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(t.contact.error);
    } else {
      toast.success(t.contact.sent);
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <SiteLayout>
      <div className="px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="font-mono text-xs uppercase tracking-widest text-primary">{t.nav.contact}</div>
          <h1 className="mt-3 font-display font-bold uppercase tracking-tight leading-[0.95] text-[clamp(2.5rem,9vw,7.5rem)]">
            {t.contact.title}
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">{t.contact.subtitle}</p>
        </motion.div>
      </div>

      <div className="mt-10 border-y border-border py-3">
        <Marquee duration={22} repeat={4}>
          <MarqueeWords
            words={lang === "es" ? ["Hablemos", "Escribeme", "Trabajemos juntos"] : ["Let’s talk", "Write me", "Let’s work together"]}
            className="font-display font-bold uppercase tracking-tight text-xl sm:text-2xl text-muted-foreground"
          />
        </Marquee>
      </div>

      <div className="px-4 sm:px-8 max-w-7xl mx-auto mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <div className="grid sm:grid-cols-2 gap-x-8">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.contact.name} className={inputCls} />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.contact.email} className={inputCls} />
          </div>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t.contact.subject} className={inputCls} />
          <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.contact.message} className={`${inputCls} resize-none`} />
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4 text-sm font-medium hover:bg-foreground hover:text-background transition-colors duration-300 disabled:opacity-60"
            >
              <Send className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              {t.contact.send}
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition-colors duration-300"
            >
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                <div className="mt-1 font-display font-semibold break-all group-hover:text-primary transition-colors">{profile.email}</div>
              </div>
              <ArrowUpRight className="size-5 shrink-0 text-primary transition-transform duration-300 group-hover:rotate-45" />
            </a>
          )}
          {profile?.github_url && (
            <a
              href={normalizeUrl(profile.github_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition-colors duration-300"
            >
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">GitHub</div>
                <div className="mt-1 font-display font-semibold group-hover:text-primary transition-colors">@eliasseverinok</div>
              </div>
              <ArrowUpRight className="size-5 shrink-0 text-primary transition-transform duration-300 group-hover:rotate-45" />
            </a>
          )}
          {profile?.linkedin_url && (
            <a
              href={normalizeUrl(profile.linkedin_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition-colors duration-300"
            >
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Linkedin</div>
                <div className="mt-1 font-display font-semibold group-hover:text-primary transition-colors">@eliasseverinok</div>
              </div>
              <ArrowUpRight className="size-5 shrink-0 text-primary transition-transform duration-300 group-hover:rotate-45" />
            </a>
          )}
        </motion.div>
      </div>
    </SiteLayout>
  );
}
