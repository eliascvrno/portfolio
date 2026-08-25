import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { AdminCrud } from "@/components/admin-crud";

export const Route = createFileRoute("/_authenticated/admin/experiencia")({ component: Page });

function Page() {
  return (
    <AdminLayout title="Experiencia">
      <AdminCrud table="experiences" title="Experiencia laboral" display={(r) => `${r.role_es} · ${r.company}`}
        fields={[
          { name: "company", label: "Empresa", required: true },
          { name: "role_es", label: "Cargo (ES)", required: true },
          { name: "role_en", label: "Role (EN)", required: true },
          { name: "description_es", label: "Descripción (ES)", type: "textarea" },
          { name: "description_en", label: "Description (EN)", type: "textarea" },
          { name: "location", label: "Ubicación" },
          { name: "start_date", label: "Fecha inicio", type: "date", required: true },
          { name: "end_date", label: "Fecha fin (vacío = actual)", type: "date" },
          { name: "logo_url", label: "Logo", type: "image" },
          { name: "display_order", label: "Orden", type: "number" },
        ]} />
    </AdminLayout>
  );
}