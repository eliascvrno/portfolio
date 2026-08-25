import { useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TechLogo } from "@/components/tech-badges";
import { inferTechCategory, resolveTech } from "@/lib/tech-icons";

const CAT_LABELS: Record<string, string> = {
  all: "Todos",
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  design: "Diseño",
  tools: "Herramientas",
  ai: "IA",
};
const CAT_ORDER = ["all", "frontend", "backend", "devops", "design", "tools", "ai"] as const;

function categoryOf(value: string): string {
  if (!resolveTech(value)) return "tools";
  return inferTechCategory(value);
}

function CategoryChips({
  active,
  onChange,
  counts,
}: {
  active: string;
  onChange: (c: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CAT_ORDER.filter((c) => c === "all" || (counts[c] ?? 0) > 0).map((c) => (
        <button
          type="button"
          key={c}
          onClick={() => onChange(c)}
          className={`text-[11px] px-2 py-1 rounded-md border transition ${
            active === c
              ? "bg-green-500/15 text-green-300 border-green-400/40"
              : "bg-card text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          {CAT_LABELS[c]}
          <span className="ml-1 opacity-60">{counts[c] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "date" | "select" | "image" | "video" | "json" | "multi" | "tech";
  options?: { value: string; label: string; disabled?: boolean; disabledReason?: string }[];
  iconUrl?: (value: string) => string | null;
  required?: boolean;
};

import { ImageUpload, VideoUpload } from "./image-upload";

function AdminIcon({ src, label, size = "sm" }: { src: string; label?: string; size?: "xs" | "sm" }) {
  return <TechLogo name={label ?? "Tecnología"} src={src} size={size === "xs" ? 14 : 16} />;
}

export function AdminCrud({
  table,
  title,
  fields,
  orderBy = "display_order",
  display,
  beforeSave,
  multiInsertField,
}: {
  table: string;
  title: string;
  fields: Field[];
  orderBy?: string;
  display: (row: any) => ReactNode;
  beforeSave?: (row: any) => any;
  multiInsertField?: string;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(null);

  const { data: rows = [] } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select("*").order(orderBy, { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const blank = () => Object.fromEntries(fields.map((f) => [f.name, f.type === "boolean" ? false : f.type === "number" ? 0 : f.type === "json" ? [] : ""])) as any;
  

  const save = useMutation({
    mutationFn: async (row: any) => {
      const normalize = (r: any) => {
        let p = { ...r };
        if (beforeSave) p = beforeSave(p);
        fields.forEach((f) => {
          if (f.type === "json" && typeof p[f.name] === "string") {
            try { p[f.name] = JSON.parse(p[f.name]); } catch { p[f.name] = []; }
          }
          
          if (f.type === "multi" && f.name !== multiInsertField && !Array.isArray(p[f.name])) {
            p[f.name] = [];
          }
        });
        return p;
      };
      
      if (multiInsertField && !row.id && Array.isArray(row[multiInsertField]) && row[multiInsertField].length > 0) {
        const values: string[] = row[multiInsertField];
        const rows = values.map((v) => {
          const base = { ...row, [multiInsertField]: v };
          const p = normalize(base);
          delete p.id;
          return p;
        });
        const { error } = await supabase.from(table as any).insert(rows);
        if (error) throw error;
        return;
      }
      const payload = normalize(row);
      
      if (multiInsertField && row.id && Array.isArray(payload[multiInsertField])) {
        payload[multiInsertField] = payload[multiInsertField][0] ?? "";
      }
      if (row.id) {
        const { error } = await supabase.from(table as any).update(payload).eq("id", row.id);
        if (error) throw error;
      } else {
        delete payload.id;
        const { error } = await supabase.from(table as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      toast.success("Guardado");
      setOpen(false);
      setForm(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      toast.success("Eliminado");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openCreate = () => {
    const b = blank();
    if (multiInsertField) b[multiInsertField] = [];
    setForm(b);
    setOpen(true);
  };
  const openEditNormalized = (row: any) => {
    const r = { ...row };
    if (multiInsertField && typeof r[multiInsertField] === "string") {
      r[multiInsertField] = r[multiInsertField] ? [r[multiInsertField]] : [];
    }
    setForm(r);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={openCreate} className="gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
          <Plus className="size-4" /> Nuevo
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {rows.length === 0 && <div className="p-6 text-sm text-muted-foreground text-center">No hay registros aún</div>}
        {rows.map((row: any) => (
          <div key={row.id} className="flex items-center justify-between p-4 hover:bg-accent/30">
            <div className="font-medium truncate">{display(row)}</div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEditNormalized(row)} className="p-2 rounded hover:bg-accent text-muted-foreground hover:text-foreground"><Pencil className="size-4" /></button>
              <button onClick={() => { if (confirm("¿Eliminar?")) del.mutate(row.id); }} className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {open && form && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="bg-card border border-border rounded-t-3xl sm:rounded-3xl w-full max-w-2xl p-6 max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{form.id ? "Editar" : "Nuevo"}</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-accent"><X className="size-4" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
              {fields.map((f) => (
                <FieldInput key={f.name} field={f} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
              ))}
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={save.isPending} className="gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
                  <Save className="size-4" /> Guardar
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
  const update = (v: any) => onChange(v);
  const cls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20";
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{field.label}{field.required && " *"}</label>
      {field.type === "textarea" ? (
        <textarea rows={4} value={value ?? ""} onChange={(e) => update(e.target.value)} className={cls} required={field.required} />
      ) : field.type === "boolean" ? (
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!value} onChange={(e) => update(e.target.checked)} /> {field.label}</label>
      ) : field.type === "select" ? (
        <select value={value ?? ""} onChange={(e) => update(e.target.value)} className={cls}>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : field.type === "number" ? (
        <input type="number" value={value ?? 0} onChange={(e) => update(Number(e.target.value))} className={cls} required={field.required} />
      ) : field.type === "date" ? (
        <input type="date" value={value ?? ""} onChange={(e) => update(e.target.value || null)} className={cls} required={field.required} />
      ) : field.type === "image" ? (
        <ImageUpload value={value ?? null} onChange={update} label="" />
      ) : field.type === "video" ? (
        <VideoUpload value={value ?? null} onChange={update} label="" />
      ) : field.type === "json" ? (
        <textarea rows={3} value={Array.isArray(value) ? JSON.stringify(value) : value ?? "[]"} onChange={(e) => update(e.target.value)} className={cls + " font-mono text-xs"} placeholder='["React","Node"]' />
      ) : field.type === "multi" ? (
        <MultiPicker field={field} value={Array.isArray(value) ? value : []} onChange={update} />
      ) : field.type === "tech" ? (
        <TechPicker field={field} value={value ?? ""} onChange={update} />
      ) : (
        <input type="text" value={value ?? ""} onChange={(e) => update(e.target.value)} className={cls} required={field.required} />
      )}
    </div>
  );
}

function MultiPicker({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const opts = field.options ?? [];
  const [cat, setCat] = useState<string>("all");
  const counts: Record<string, number> = { all: opts.length };
  opts.forEach((o) => {
    const c = categoryOf(o.value);
    counts[c] = (counts[c] ?? 0) + 1;
  });
  const uniqueOpts = opts.filter((o, idx) => opts.findIndex((x) => x.value === o.value) === idx);
  const filtered = uniqueOpts.filter((o) => {
    const matchQ = o.label.toLowerCase().includes(q.toLowerCase());
    const matchC = cat === "all" || categoryOf(o.value) === cat;
    return matchQ && matchC && !value.includes(o.value);
  });
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-background border border-border">
          {value.map((v) => {
            const opt = opts.find((o) => o.value === v);
            const icon = field.iconUrl?.(v);
            return (
              <button
                type="button"
                key={v}
                onClick={() => toggle(v)}
                className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-green-600/20 text-green-300 border border-green-600/40 hover:bg-green-600/30"
              >
                {icon && <AdminIcon src={icon} label={opt?.label ?? v} size="xs" />}
                {opt?.label ?? v}
                <X className="size-3" />
              </button>
            );
          })}
        </div>
      )}
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar..."
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
      />
      <CategoryChips active={cat} onChange={setCat} counts={counts} />
      <div className="max-h-64 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-2 rounded-lg bg-background border border-border">
        {filtered.map((o) => {
          const selected = value.includes(o.value);
          const icon = field.iconUrl?.(o.value);
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => toggle(o.value)}
              className={`inline-flex items-center gap-2 text-xs px-2 py-1.5 rounded-md border transition ${
                selected
                  ? "bg-green-600/20 text-green-300 border-green-600/40"
                  : "bg-card text-foreground border-border hover:bg-accent"
              }`}
            >
              {icon && <AdminIcon src={icon} label={o.label} />}
              <span className="truncate">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TechPicker({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  const [q, setQ] = useState("");
  const opts = field.options ?? [];
  const [cat, setCat] = useState<string>("all");
  const counts: Record<string, number> = { all: opts.length };
  opts.forEach((o) => {
    const c = categoryOf(o.value);
    counts[c] = (counts[c] ?? 0) + 1;
  });
  const filtered = opts.filter((o) => {
    const matchQ = o.label.toLowerCase().includes(q.toLowerCase());
    const matchC = cat === "all" || categoryOf(o.value) === cat;
    return matchQ && matchC;
  });
  const currentIcon = value ? field.iconUrl?.(value) : null;
  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border text-sm">
          {currentIcon && <AdminIcon src={currentIcon} label={value} />}
          <span className="flex-1">{value}</span>
          <button type="button" onClick={() => onChange("")} className="p-1 rounded hover:bg-accent text-muted-foreground">
            <X className="size-3.5" />
          </button>
        </div>
      )}
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar tecnología..."
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
      />
      <CategoryChips active={cat} onChange={setCat} counts={counts} />
      <div className="max-h-72 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-2 rounded-lg bg-background border border-border">
        {filtered.map((o) => {
          const selected = value === o.value;
          const icon = field.iconUrl?.(o.value);
          const isDisabled = !!o.disabled && !selected;
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => !isDisabled && onChange(o.value)}
              disabled={isDisabled}
              title={isDisabled ? o.disabledReason ?? "Ya está en uso en otra sección" : undefined}
              className={`inline-flex items-center gap-2 text-xs px-2 py-1.5 rounded-md border transition ${
                selected
                  ? "bg-green-600/20 text-green-300 border-green-600/40"
                  : isDisabled
                  ? "bg-card/40 text-muted-foreground/50 border-border/40 line-through cursor-not-allowed opacity-50"
                  : "bg-card text-foreground border-border hover:bg-accent"
              }`}
            >
              {icon && <AdminIcon src={icon} label={o.label} />}
              <span className="truncate">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}