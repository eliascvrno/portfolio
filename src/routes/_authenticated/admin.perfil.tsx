import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload";
import { TECHS, techIconUrl, resolveTech } from "@/lib/tech-icons";
import { X } from "lucide-react";
import { TechLogo } from "@/components/tech-badges";

export const Route = createFileRoute("/_authenticated/admin/perfil")({ component: Page });

function AdminTechIcon({ src, size = "sm" }: { src: string; size?: "xs" | "sm" }) {
  return <TechLogo name="Tecnología" src={src} size={size === "xs" ? 14 : 16} />;
}

function Page() {
  const qc = useQueryClient();
  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const { data: profile, error } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
        if (error) {
          console.error("Error fetching profile from Supabase:", error);
          throw error;
        }
        if (!profile) {
          // Insert a default profile if none exists
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({
              name: "Elias Severino",
              title_es: "Desarrollador Full Stack",
              title_en: "Full Stack Developer",
              bio_es: "Apasionado por crear aplicaciones web modernas.",
              bio_en: "Passionate about building modern web applications.",
              available: true,
              years_experience: 1,
              projects_count: 0,
              technologies_count: 0,
            })
            .select()
            .single();
          if (insertError) {
            console.error("Error inserting default profile into Supabase:", insertError);
            throw insertError;
          }
          return newProfile;
        }
        return profile;
      } catch (err) {
        console.error("Profile query catch block:", err);
        throw err;
      }
    },
  });
  const [form, setForm] = useState<any>(null);
  useEffect(() => { if (data) setForm(data); }, [data]);

  if (queryError) {
    return (
      <AdminLayout title="Perfil">
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          <p className="font-semibold">Error al cargar o crear el perfil:</p>
          <p className="text-sm font-mono mt-1">{(queryError as Error)?.message || String(queryError)}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Revisa la consola del navegador (F12) o las políticas de seguridad (RLS) en Supabase.
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading || !form) return <AdminLayout title="Perfil"><div>Cargando...</div></AdminLayout>;

  const save = async () => {
    const { error } = await supabase.from("profiles").update({
      name: form.name, title_es: form.title_es, title_en: form.title_en,
      bio_es: form.bio_es, bio_en: form.bio_en,
      email: form.email, phone: form.phone, location: form.location,
      github_url: form.github_url, linkedin_url: form.linkedin_url,
      avatar_url: form.avatar_url, cv_url: form.cv_url, available: form.available,
      years_experience: form.years_experience, projects_count: form.projects_count, technologies_count: form.technologies_count,
      featured_technologies: form.featured_technologies ?? [],
    }).eq("id", form.id);
    if (error) toast.error(error.message);
    else { toast.success("Guardado"); qc.invalidateQueries({ queryKey: ["profile"] }); }
  };

  const cls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20";
  const inp = (k: string, label: string, type: string = "text") => (
    <div><label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <input type={type} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: type === "number" ? Number(e.target.value) : e.target.value })} className={cls} /></div>
  );
  const ta = (k: string, label: string) => (
    <div><label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <textarea rows={3} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={cls} /></div>
  );

  return (
    <AdminLayout title="Perfil">
      <div className="max-w-3xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {inp("name", "Nombre")}
          {inp("email", "Email")}
          {inp("phone", "Teléfono")}
          {inp("location", "Ubicación")}
          {inp("title_es", "Título (ES)")}
          {inp("title_en", "Title (EN)")}
        </div>
        {ta("bio_es", "Bio (ES)")}
        {ta("bio_en", "Bio (EN)")}
        <div className="grid sm:grid-cols-2 gap-4">
          {inp("github_url", "GitHub URL")}
          {inp("linkedin_url", "LinkedIn URL")}
          {inp("cv_url", "CV URL (opcional)")}
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {inp("years_experience", "Años exp.", "number")}
          {inp("projects_count", "Proyectos", "number")}
          {inp("technologies_count", "Tecnologías", "number")}
        </div>
        <ImageUpload value={form.avatar_url} onChange={(url) => setForm({ ...form, avatar_url: url })} label="Avatar" />
        <FeaturedTechPicker
          value={Array.isArray(form.featured_technologies) ? form.featured_technologies : []}
          onChange={(v) => setForm({ ...form, featured_technologies: v })}
        />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Disponible para trabajar</label>
        <Button onClick={save} className="gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
          <Save className="size-4" /> Guardar perfil
        </Button>
      </div>
    </AdminLayout>
  );
}

function FeaturedTechPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState("");
  const opts = TECHS.map((t) => ({ value: t.label, label: t.label }));
  const filtered = opts.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };
  const iconFor = (label: string) => {
    const t = resolveTech(label);
    return t ? techIconUrl(t) : null;
  };
  return (
    <div className="space-y-2">
      <label className="block text-xs text-muted-foreground">Tecnologías destacadas (se muestran con logos en la home)</label>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-background border border-border">
          {value.map((v) => {
            const icon = iconFor(v);
            return (
              <button type="button" key={v} onClick={() => toggle(v)}
                className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-green-600/20 text-green-300 border border-green-600/40 hover:bg-green-600/30">
                {icon && <AdminTechIcon src={icon} size="xs" />}
                {v}
                <X className="size-3" />
              </button>
            );
          })}
        </div>
      )}
      <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar tecnología..."
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20" />
      <div className="max-h-64 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-2 rounded-lg bg-background border border-border">
        {filtered.map((o) => {
          const selected = value.includes(o.value);
          const icon = iconFor(o.value);
          return (
            <button type="button" key={o.value} onClick={() => toggle(o.value)}
              className={`inline-flex items-center gap-2 text-xs px-2 py-1.5 rounded-md border transition ${selected ? "bg-green-600/20 text-green-300 border-green-600/40" : "bg-card text-foreground border-border hover:bg-accent"}`}>
              {icon && <AdminTechIcon src={icon} />}
              <span className="truncate">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}