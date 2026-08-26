import { createFileRoute } from "@tanstack/react-router";
import Groq from "groq-sdk";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { messages: { role: "user" | "assistant"; content: string }[]; lang?: "es" | "en" };
          const lang = body.lang ?? "es";

          // ── Diagnóstico de env vars ──
          const groqKey = process.env.GROQ_API_KEY;
          const supaUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
          const supaKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

          if (!groqKey) {
            console.error("[chat] GROQ_API_KEY no está definida en .env");
            return new Response(JSON.stringify({ error: "GROQ_API_KEY missing" }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
          if (!supaUrl || !supaKey) {
            console.error("[chat] Supabase env vars no definidas", { supaUrl: !!supaUrl, supaKey: !!supaKey });
            return new Response(JSON.stringify({ error: "Supabase env vars missing" }), { status: 500, headers: { "Content-Type": "application/json" } });
          }

          const groq = new Groq({ apiKey: groqKey });

          const { createClient } = await import("@supabase/supabase-js");
          const supa = createClient(supaUrl, supaKey, {
            auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
          });

          const [
            { data: profile, error: profileErr },
            { data: projects, error: projectsErr },
            { data: exp, error: expErr },
            { data: skills, error: skillsErr },
          ] = await Promise.all([
            supa.from("profiles").select("*").limit(1).maybeSingle(),
            supa.from("projects").select("title,description_es,description_en,category,stack,demo_url"),
            supa.from("experiences").select("company,role_es,role_en,description_es,description_en,start_date,end_date"),
            supa.from("skills").select("name,category,level"),
          ]);

          // Log errores de Supabase pero no abortar — el chat puede funcionar sin datos
          if (profileErr) console.warn("[chat] profiles error:", profileErr.message);
          if (projectsErr) console.warn("[chat] projects error:", projectsErr.message);
          if (expErr) console.warn("[chat] experiences error:", expErr.message);
          if (skillsErr) console.warn("[chat] skills error:", skillsErr.message);

          const formatRules = lang === "es"
            ? `\n\nREGLAS DE FORMATO IMPORTANTES:\n- NUNCA uses markdown. Escribe el email y teléfono como texto plano, sin asteriscos.\n- Email: eliasseverinok@gmail.com\n- Teléfono/WhatsApp: +593 96 338 2336`
            : `\n\nIMPORTANT FORMATTING RULES:\n- NEVER use markdown. Write email and phone as plain text.\n- Email: eliasseverinok@gmail.com\n- Phone/WhatsApp: +593 96 338 2336`;

          const system = lang === "es"
            ? `Eres un asistente IA del portfolio de ${profile?.name ?? "Elias Severino"}. Responde SIEMPRE en español, en primera persona como si fueras Elias. Sé conciso, amable y profesional. Usa SOLO la siguiente información:\n\nPERFIL:\n${JSON.stringify(profile)}\n\nPROYECTOS:\n${JSON.stringify(projects)}\n\nEXPERIENCIA:\n${JSON.stringify(exp)}\n\nHABILIDADES:\n${JSON.stringify(skills)}\n\nSi te preguntan algo que no está en estos datos, di amablemente que no tienes esa información y sugiere contactar por el formulario.${formatRules}`
            : `You are an AI assistant for ${profile?.name ?? "Elias Severino"}'s portfolio. Always answer in English, in first person as if you were Elias. Be concise, friendly and professional. Use ONLY the following information:\n\nPROFILE:\n${JSON.stringify(profile)}\n\nPROJECTS:\n${JSON.stringify(projects)}\n\nEXPERIENCE:\n${JSON.stringify(exp)}\n\nSKILLS:\n${JSON.stringify(skills)}\n\nIf asked about something not in this data, kindly say you don't have that info and suggest using the contact form.${formatRules}`;

          const messages = [
            { role: "system" as const, content: system },
            ...body.messages.map((m) => ({ role: m.role === "assistant" ? "assistant" as const : "user" as const, content: m.content })),
          ];

          console.log("[chat] Llamando a Groq con modelo qwen/qwen3.8-27b...");
          const stream = await groq.chat.completions.create({
            model: "qwen/qwen3.8-27b",
            messages,
            stream: true,
          });

          const encoder = new TextEncoder();
          const readable = new ReadableStream({
            async start(controller) {
              try {
                for await (const chunk of stream) {
                  const text = chunk.choices?.[0]?.delta?.content || "";
                  if (text) controller.enqueue(encoder.encode(text));
                }
              } catch (err) {
                console.error("[chat] Groq stream error:", err);
              } finally {
                controller.close();
              }
            },
          });

          return new Response(readable, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        } catch (err) {
          console.error("[chat] Unhandled error:", err);
          const message = err instanceof Error ? err.message : String(err);
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
