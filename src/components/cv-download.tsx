import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type Variant = "sidebar" | "hero" | "mobile";

export function CvDownload({ variant = "sidebar" }: { variant?: Variant }) {
  const { lang } = useI18n();
  const label = lang === "es" ? "Descargar CV" : "Download CV";

  const trigger =
    variant === "mobile" ? (
      <button className="text-xs px-2 py-1 rounded bg-gradient-to-r from-green-600 to-green-700 text-white">
        CV
      </button>
    ) : variant === "hero" ? (
      <Button variant="outline" size="sm" className="gap-2 text-foreground">
        <Download className="size-4 text-primary" />
        <span className="text-foreground">{label}</span>
      </Button>
    ) : (
      <button className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm border border-border hover:bg-sidebar-accent text-sidebar-foreground transition">
        <Download className="size-4 text-primary" /> {label}
      </button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <a href="/cv/Elias_Severino_FullStack_CV.pdf" download="Elias_Severino_FullStack_CV.pdf">
            CV Español
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/cv/Elias_Severino_FullStack_CV_ENG.pdf" download="Elias_Severino_FullStack_CV_ENG.pdf">
            CV English
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}