import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { NAV_KEYS, useHiddenNav, saveHiddenNav } from "@/lib/nav-settings";

const LABELS: Record<string, string> = {
  "/": "Inicio",
  "/sobre-mi": "Sobre mí",
  "/proyectos": "Proyectos",
  "/experiencia": "Experiencia",
  "/habilidades": "Habilidades",
  "/tecnologias": "Tecnologías",
  "/educacion": "Educación",
  "/contacto": "Contacto",
};

export const Route = createFileRoute("/_authenticated/admin/menu")({
  component: AdminMenu,
});

function AdminMenu() {
  const { data: hidden = [], isLoading } = useHiddenNav();
  const [local, setLocal] = useState<string[]>([]);
  const qc = useQueryClient();

  useEffect(() => {
    setLocal(hidden);
  }, [hidden.join("|")]);

  const mut = useMutation({
    mutationFn: (h: string[]) => saveHiddenNav(h),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_settings", "nav"] });
      toast.success("Menú actualizado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = (key: string, visible: boolean) => {
    setLocal((prev) =>
      visible ? prev.filter((k) => k !== key) : Array.from(new Set([...prev, key])),
    );
  };

  return (
    <AdminLayout title="Menú del sitio">
      <div className="max-w-2xl space-y-4">
        <p className="text-sm text-muted-foreground">
          Ocultá secciones del menú lateral. Los cambios se guardan y aplican a todos los visitantes.
        </p>
        <div className="rounded-xl border border-border divide-y divide-border bg-card">
          {NAV_KEYS.map((key) => {
            const visible = !local.includes(key);
            return (
              <div key={key} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="font-medium">{LABELS[key]}</div>
                  <div className="text-xs text-muted-foreground">{key}</div>
                </div>
                <Switch
                  checked={visible}
                  disabled={key === "/"}
                  onCheckedChange={(v) => toggle(key, v)}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => mut.mutate(local)}
            disabled={mut.isPending || isLoading}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0"
          >
            {mut.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Button variant="outline" onClick={() => setLocal(hidden)} disabled={mut.isPending}>
            Descartar
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}