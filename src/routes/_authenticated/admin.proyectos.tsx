import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";
import { AdminCrud } from "@/components/admin-crud";
import { TECHS, techIconUrl } from "@/lib/tech-icons";

const TECH_OPTIONS = TECHS.map((t) => ({ value: t.slug, label: t.label }));
const techIcon = (slug: string) => {
  const t = TECHS.find((x) => x.slug === slug);
  return t ? techIconUrl(t) : null;
};

export const Route = createFileRoute("/_authenticated/admin/proyectos")({ component: Page });

function Page() {
  return (
    <AdminLayout title="Proyectos">
      <AdminCrud
        table="projects"
        title="Proyectos"
        display={(r) => r.title}
        fields={[
          { name: "slug", label: "Slug", required: true },
          { name: "title", label: "Título", required: true },
          { name: "category", label: "Categoría", type: "select", options: [
            { value: "web", label: "Web Apps" },
            { value: "mobile", label: "Mobile Apps" },
            { value: "ecommerce", label: "E-commerce" },
            { value: "dashboard", label: "Dashboard" },
            { value: "api", label: "API's" },
          ]},
          { name: "description_es", label: "Descripción (ES)", type: "textarea" },
          { name: "description_en", label: "Description (EN)", type: "textarea" },
          { name: "long_description_es", label: "Descripción larga (ES)", type: "textarea" },
          { name: "long_description_en", label: "Long description (EN)", type: "textarea" },
          { name: "cover_url", label: "Imagen de portada", type: "image" },
          { name: "video_url", label: "Animación / Video MP4 (se sube a Supabase Storage y se muestra en el apartado Proyectos)", type: "video" },
          {
            name: "stack",
            label: "Tecnologías (elegí las que usa este proyecto)",
            type: "multi",
            options: TECH_OPTIONS,
            iconUrl: techIcon,
          },
          { name: "demo_url", label: "URL Demo" },
          { name: "repo_url", label: "URL Repo GitHub (opcional — si está vacío no aparece el botón)" },
          { name: "has_readme", label: "Mostrar botón README (marcá la casilla para crear la página dedicada)", type: "boolean" },
          { name: "readme_es", label: "Contenido README (ES)", type: "textarea" },
          { name: "readme_en", label: "README content (EN)", type: "textarea" },
          { name: "featured", label: "Destacado", type: "boolean" },
          { name: "display_order", label: "Orden", type: "number" },
        ]}
      />
    </AdminLayout>
  );
}