import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { TechBadges } from "@/components/tech-badges";

export const Route = createFileRoute("/proyectos/$slug")({
  component: ProjectDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Proyecto no encontrado</h1>
        <Link to="/proyectos" className="text-foreground mt-4 inline-block">← Volver a proyectos</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ reset }) => (
    <SiteLayout>
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <button onClick={reset} className="text-foreground mt-4">Reintentar</button>
      </div>
    </SiteLayout>
  ),
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { lang } = useI18n();
  const { data: project } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
      if (!data) throw notFound();
      return data;
    },
  });

  if (!project) return <SiteLayout><div /></SiteLayout>;

  return (
    <SiteLayout>
      <Link to="/proyectos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="size-4" /> {lang === "es" ? "Volver" : "Back"}
      </Link>
      <h1 className="text-4xl sm:text-5xl font-bold">{project.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
        {lang === "es" ? project.description_es : project.description_en}
      </p>
      <div className="mt-6 flex gap-3">
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white text-sm">
            <ExternalLink className="size-4" /> {lang === "es" ? "Ver demo" : "View demo"}
          </a>
        )}
        {project.repo_url && (
          <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm">
            <Github className="size-4" /> {lang === "es" ? "Repositorio" : "Repository"}
          </a>
        )}
      </div>

      {project.cover_url && (
        <div className="mt-10 rounded-3xl overflow-hidden border border-border">
          <img src={project.cover_url} alt={project.title} className="w-full" />
        </div>
      )}

      {Array.isArray(project.stack) && project.stack.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3">Stack</h2>
          <TechBadges stack={project.stack as string[]} size={22} />
        </div>
      )}

      {(project.long_description_es || project.long_description_en) && (
        <div className="mt-10 prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap">
            {lang === "es" ? project.long_description_es : project.long_description_en}
          </p>
        </div>
      )}
    </SiteLayout>
  );
}