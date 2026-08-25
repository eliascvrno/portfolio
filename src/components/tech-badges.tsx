import { useState } from "react";
import { resolveTech, techIconUrl, type Tech } from "@/lib/tech-icons";

function initials(label: string) {
  const cleaned = label.replace(/[^a-zA-Z0-9 .+#]/g, "").trim();
  const parts = cleaned.split(/[\s.+]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return cleaned.slice(0, 2).toUpperCase() || "??";
}

function InitialsBadge({ label, size }: { label: string; size: number }) {
  return (
    <span
      title={label}
      className="inline-flex items-center justify-center rounded-md bg-green-500/10 border border-green-400/30 text-green-300 font-mono font-semibold"
      style={{ width: size + 12, height: size + 12, fontSize: Math.max(10, size * 0.55) }}
    >
      {initials(label)}
    </span>
  );
}

function TechImage({ src, label, size }: { src: string; label: string; size: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <InitialsBadge label={label} size={size} />;

  const needsDarkSurface = src.includes("/FFFFFF");
  return (
    <span
      title={label}
      className="inline-flex items-center justify-center rounded-md border border-border p-1.5 shadow-sm"
      style={{ width: size + 12, height: size + 12, backgroundColor: needsDarkSurface ? "#050505" : "transparent" }}
    >
      <img
        src={src}
        alt={label}
        width={size}
        height={size}
        loading="lazy"
        className="object-contain"
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export function TechIcon({ tech, size }: { tech: Tech; size: number }) {
  return <TechImage src={techIconUrl(tech)} label={tech.label} size={size} />;
}

export function TechLogo({ name, src, size }: { name: string; src?: string | null; size: number }) {
  if (src) return <TechImage src={src} label={name} size={size} />;
  const tech = resolveTech(name);
  if (tech) return <TechIcon tech={tech} size={size} />;
  return <InitialsBadge label={name} size={size} />;
}

export function TechBadges({
  stack,
  size = 20,
  max,
}: {
  stack: string[];
  size?: number;
  max?: number;
}) {
  const items = max ? stack.slice(0, max) : stack;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => {
        const tech = resolveTech(s);
        if (tech) {
          return <TechIcon key={s} tech={tech} size={size} />;
        }
        return <InitialsBadge key={s} label={s} size={size} />;
      })}
    </div>
  );
}