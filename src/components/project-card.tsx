"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Maximize2, BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { TechBadges } from "@/components/tech-badges";

interface Project {
  id: string;
  slug: string;
  title: string;
  description_es: string | null;
  description_en: string | null;
  long_description_es: string | null;
  long_description_en: string | null;
  cover_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  readme_es?: string | null;
  readme_en?: string | null;
  has_readme?: boolean | null;
  stack: unknown;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  variant?: "compact" | "default";
}

export function ProjectCard({ project, index, variant = "default" }: ProjectCardProps) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);

  const description = lang === "es" ? project.description_es : project.description_en;
  const longDescription = lang === "es" ? project.long_description_es : project.long_description_en;
  const stack = Array.isArray(project.stack) ? (project.stack as string[]) : [];
  const hasReadme = Boolean(project.has_readme);

  const initials = project.title
    .split(" ")
    .filter((s) => s.length > 0)
    .map((s) => s[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-white/20 transition"
    >
      <div className="aspect-video bg-gradient-to-br from-white/5 to-white/5 relative overflow-hidden">
        {project.cover_url ? (
          <img
            src={project.cover_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-muted-foreground/40">
            {initials}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={t.sections.expand}
              className="absolute top-2 right-2 z-10 size-8 rounded-lg bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-black/80 transition cursor-pointer"
            >
              <Maximize2 className="size-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{project.title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="mt-2">
              {project.cover_url && (
                <img
                  src={project.cover_url}
                  alt={project.title}
                  className="w-full rounded-lg border border-border"
                />
              )}
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {longDescription || description}
              </p>
              {stack.length > 0 && (
                <div className="mt-4">
                  <TechBadges stack={stack} size={22} />
                </div>
              )}
              <div className="mt-6 flex gap-2">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1 text-xs px-3 py-2 rounded border border-border hover:bg-accent"
                  >
                    <ExternalLink className="size-3" /> {t.sections.visit}
                  </a>
                )}
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1 text-xs px-3 py-2 rounded border border-border hover:bg-accent"
                  >
                    <Github className="size-3" /> {t.sections.repo}
                  </a>
                )}
                {hasReadme && (
                  <Link
                    to="/proyectos/$slug/readme"
                    params={{ slug: project.slug }}
                    className="flex-1 inline-flex items-center justify-center gap-1 text-xs px-3 py-2 rounded border border-border hover:bg-accent"
                  >
                    <BookOpen className="size-3" /> README
                  </Link>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className={variant === "compact" ? "p-4" : "p-5"}>
        <div className={variant === "compact" ? "font-semibold" : "font-semibold text-lg"}>
          {project.title}
        </div>
        <p
          className={`mt-1 text-muted-foreground ${
            variant === "compact" ? "text-xs line-clamp-2" : "text-sm line-clamp-3"
          }`}
        >
          {description}
        </p>
        {variant === "default" && stack.length > 0 && (
          <div className="mt-3">
            <TechBadges stack={stack} size={18} max={6} />
          </div>
        )}
        <div className="mt-4 flex gap-2">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded border border-border hover:bg-accent"
            >
              <ExternalLink className="size-3" /> {t.sections.visit}
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 text-xs px-2 py-1.5 rounded border border-border hover:bg-accent"
            >
              <Github className="size-3" /> {t.sections.repo}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
