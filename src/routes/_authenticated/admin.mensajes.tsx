import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/mensajes")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const { data: messages = [] } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const toggleRead = async (id: string, read: boolean) => {
    await supabase.from("contact_messages").update({ read: !read }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["contact_messages"] });
  };
  const remove = async (id: string) => {
    if (!confirm("¿Eliminar mensaje?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["contact_messages"] });
    toast.success("Eliminado");
  };

  return (
    <AdminLayout title="Mensajes">
      <div className="space-y-3">
        {messages.length === 0 && <div className="text-center text-muted-foreground py-12">No hay mensajes</div>}
        {messages.map((m: any) => (
          <div key={m.id} className={`rounded-2xl border bg-card p-5 ${m.read ? "border-border" : "border-border"}`}>
            <div className="flex justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{m.name}</span>
                  <span className="text-sm text-muted-foreground">&lt;{m.email}&gt;</span>
                  {!m.read && <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-foreground">Nuevo</span>}
                </div>
                {m.subject && <div className="text-sm font-medium mt-1">{m.subject}</div>}
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
                <div className="text-xs text-muted-foreground mt-3">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => toggleRead(m.id, m.read)} className="p-2 rounded hover:bg-accent text-muted-foreground hover:text-foreground" title={m.read ? "Marcar no leído" : "Marcar leído"}>
                  {m.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                </button>
                <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Tu mensaje")}`} className="p-2 rounded hover:bg-accent text-muted-foreground hover:text-foreground" title="Responder">
                  <Mail className="size-4" />
                </a>
                <button onClick={() => remove(m.id)} className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}