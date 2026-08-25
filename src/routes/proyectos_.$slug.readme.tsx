import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/proyectos_/$slug/readme")({
  component: ReadmePage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">README no encontrado</h1>
        <Link to="/proyectos" className="text-foreground mt-4 inline-block">
          ← Volver a proyectos
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ reset }) => (
    <SiteLayout>
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <button onClick={reset} className="text-foreground mt-4">
          Reintentar
        </button>
      </div>
    </SiteLayout>
  ),
});

function ReadmePage() {
  const { slug } = Route.useParams();
  const { lang } = useI18n();
  const { data: project } = useQuery({
    queryKey: ["project-readme", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!data) throw notFound();
      return data;
    },
  });

  if (!project) return <SiteLayout><div /></SiteLayout>;

  const readme =
    (lang === "es" ? project.readme_es : project.readme_en) ||
    project.readme_es ||
    project.readme_en;

  return (
    <SiteLayout>
      <Link
        to="/proyectos/$slug"
        params={{ slug }}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" /> {lang === "es" ? "Volver al proyecto" : "Back to project"}
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="size-6 text-primary" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">README.md</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold">{project.title}</h1>

      <article className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-10">
        {readme ? (
          <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-foreground">
            {readme}
          </pre>
        ) : (
          <p className="text-muted-foreground text-sm">
            {lang === "es"
              ? "Este proyecto aún no tiene README."
              : "This project does not have a README yet."}
          </p>
        )}
      </article>
    </SiteLayout>
  );
}
