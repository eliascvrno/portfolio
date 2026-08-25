import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { AdminCrud } from "@/components/admin-crud";

export const Route = createFileRoute("/_authenticated/admin/educacion")({ component: Page });

function Page() {
  return (
    <AdminLayout title="Educación">
      <AdminCrud table="education" title="Educación" display={(r) => `${r.degree_es} · ${r.institution}`}
        fields={[
          { name: "institution", label: "Institución", required: true },
          { name: "degree_es", label: "Título (ES)", required: true },
          { name: "degree_en", label: "Degree (EN)", required: true },
          { name: "description_es", label: "Descripción (ES)", type: "textarea" },
          { name: "description_en", label: "Description (EN)", type: "textarea" },
          { name: "start_date", label: "Fecha inicio", type: "date", required: true },
          { name: "end_date", label: "Fecha fin", type: "date" },
          { name: "logo_url", label: "Logo", type: "image" },
          { name: "display_order", label: "Orden", type: "number" },
        ]} />
    </AdminLayout>
  );
}