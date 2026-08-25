import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import { AdminLayout } from "@/components/admin-layout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/analiticas")({ component: Page });

function Page() {
  const { data } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data: views } = await supabase.from("page_views").select("*").gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()).order("created_at");
      return views ?? [];
    },
  });

  const byDay = (data ?? []).reduce<Record<string, number>>((acc, v: any) => {
    const d = new Date(v.created_at).toISOString().slice(0, 10);
    acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});
  const byPath = (data ?? []).reduce<Record<string, number>>((acc, v: any) => {
    acc[v.path] = (acc[v.path] ?? 0) + 1;
    return acc;
  }, {});
  const lineData = Object.entries(byDay).map(([date, count]) => ({ date: date.slice(5), count }));
  const pathData = Object.entries(byPath).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <AdminLayout title="Analíticas">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Visitas por día (30d)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333" }} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Top páginas</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={pathData} layout="vertical">
                <XAxis type="number" stroke="#888" fontSize={12} />
                <YAxis dataKey="path" type="category" stroke="#888" fontSize={12} width={120} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333" }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="mt-6 text-sm text-muted-foreground">Total de visitas (30d): <strong className="text-foreground">{(data ?? []).length}</strong></div>
    </AdminLayout>
  );
}