import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { AdminCrud } from "@/components/admin-crud";
import { TECHS, techIconUrl, resolveTech, inferTechCategory } from "@/lib/tech-icons";
import { TechBadges } from "@/components/tech-badges";
import { supabase } from "@/integrations/supabase/client";

const techIcon = (label: string) => {
  const t = resolveTech(label);
  return t ? techIconUrl(t) : null;
};
const CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  tools: "Herramientas",
  design: "Diseño",
  ai: "IA",
};

export const Route = createFileRoute("/_authenticated/admin/habilidades")({ component: Page });

function Page() {
  const { data: usedInTech = [] } = useQuery({
    queryKey: ["technologies", "names"],
    queryFn: async () => {
      const { data } = await supabase.from("technologies").select("name");
      return (data ?? []).map((r: any) => String(r.name).toLowerCase());
    },
  });
  const techOptions = TECHS.map((t) => ({
    value: t.label,
    label: t.label,
    disabled: usedInTech.includes(t.label.toLowerCase()),
    disabledReason: "Ya está en Tecnologías",
  }));

  return (
    <AdminLayout title="Habilidades">
      <AdminCrud
        table="skills"
        title="Habilidades"
        multiInsertField="name"
        beforeSave={(row) => ({ ...row, category: inferTechCategory(row.name) })}
        display={(r) => (
          <span className="inline-flex items-center gap-2">
            <TechBadges stack={[r.name]} size={16} />
            <span>{r.name}</span>
            <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              {CATEGORY_LABELS[r.category] ?? r.category}
            </span>
          </span>
        )}
        fields={[
          {
            name: "name",
            label: "Tecnologías / Herramientas (podés elegir varias)",
            type: "multi",
            options: techOptions,
            iconUrl: techIcon,
            required: true,
          },
          { name: "level", label: "Nivel (0-100)", type: "number" },
          { name: "display_order", label: "Orden", type: "number" },
        ]} />
    </AdminLayout>
  );
}