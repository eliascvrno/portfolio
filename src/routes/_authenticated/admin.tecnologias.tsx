import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { AdminCrud } from "@/components/admin-crud";
import { TechLogo } from "@/components/tech-badges";
import { TECHS, techIconUrl, resolveTech } from "@/lib/tech-icons";
import { supabase } from "@/integrations/supabase/client";

const techIcon = (label: string) => {
  const t = resolveTech(label);
  return t ? techIconUrl(t) : null;
};

export const Route = createFileRoute("/_authenticated/admin/tecnologias")({ component: Page });

function Page() {
  const { data: usedInSkills = [] } = useQuery({
    queryKey: ["skills", "names"],
    queryFn: async () => {
      const { data } = await supabase.from("skills").select("name");
      return (data ?? []).map((r: any) => String(r.name).toLowerCase());
    },
  });
  const techOptions = TECHS.map((t) => ({
    value: t.label,
    label: t.label,
    disabled: usedInSkills.includes(t.label.toLowerCase()),
    disabledReason: "Ya está en Habilidades",
  }));

  return (
    <AdminLayout title="Tecnologías">
      <AdminCrud
        table="technologies"
        title="Tecnologías"
        beforeSave={(row) => {
          const t = resolveTech(row.name);
          return {
            ...row,
            icon_url: row.icon_url || (t ? techIconUrl(t) : null),
            color: row.color || (t ? `#${t.color}` : null),
          };
        }}
        display={(r) => (
          <span className="inline-flex items-center gap-2">
            <TechLogo name={r.name} src={r.icon_url || techIcon(r.name) || undefined} size={16} />
            <span>{r.name}</span>
          </span>
        )}
        fields={[
          {
            name: "name",
            label: "Tecnología",
            type: "tech",
            options: techOptions,
            iconUrl: techIcon,
            required: true,
          },
          { name: "display_order", label: "Orden", type: "number" },
        ]} />
    </AdminLayout>
  );
}