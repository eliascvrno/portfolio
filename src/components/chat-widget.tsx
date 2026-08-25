import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type Msg = { role: "user" | "assistant"; content: string };

const EMAIL = "eliasseverinok@gmail.com";
const PHONE_DISPLAY = "+593 96 338 2336";
const PHONE_WA = "593963382336";
const WHATSAPP_URL = `https://wa.me/${PHONE_WA}`;

function openWhatsApp(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  window.open(WHATSAPP_URL, "_top");
}

function renderRich(text: string): React.ReactNode[] {
  
  let clean = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/__(.+?)__/g, "$1").replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "$1");

  const parts: React.ReactNode[] = [];
  
  const phoneRe = /\+?54\s?9?\s?11\s?\d{4}[-\s]?\d{4}/g;
  const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const urlRe = /https?:\/\/[^\s)]+/g;

  type Hit = { start: number; end: number; node: React.ReactNode };
  const hits: Hit[] = [];
  let m: RegExpExecArray | null;
  while ((m = emailRe.exec(clean))) {
    const isOurs = m[0].toLowerCase() === EMAIL;
    const href = isOurs ? `mailto:${EMAIL}` : `mailto:${m[0]}`;
    hits.push({ start: m.index, end: m.index + m[0].length, node: <a key={`e${m.index}`} href={href} className="underline text-green-400 hover:text-green-300">{m[0]}</a> });
  }
  while ((m = phoneRe.exec(clean))) {
    hits.push({
      start: m.index,
      end: m.index + m[0].length,
      node: (
        <a
          key={`p${m.index}`}
          href={WHATSAPP_URL}
          onClick={openWhatsApp}
          className="underline text-green-400 hover:text-green-300"
        >
          {PHONE_DISPLAY}
        </a>
      ),
    });
  }
  while ((m = urlRe.exec(clean))) {
    
    if (hits.some((h) => m!.index < h.end && m!.index + m![0].length > h.start)) continue;
    hits.push({ start: m.index, end: m.index + m[0].length, node: <a key={`u${m.index}`} href={m[0]} target="_blank" rel="noreferrer" className="underline text-green-400 hover:text-green-300">{m[0]}</a> });
  }
  hits.sort((a, b) => a.start - b.start);

  let cursor = 0;
  hits.forEach((h, i) => {
    if (h.start < cursor) return;
    if (h.start > cursor) parts.push(clean.slice(cursor, h.start));
    parts.push(h.node);
    cursor = h.end;
  });
  if (cursor < clean.length) parts.push(clean.slice(cursor));
  return parts;
}

export function ChatWidget() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang }),
      });
      if (!res.ok) throw new Error("chat error");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: lang === "es" ? "Lo siento, hubo un error." : "Sorry, an error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-6 z-50 size-14 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white shadow-xl shadow-black/40 flex items-center justify-center hover:scale-110 transition"
          aria-label="Open chat"
        >
          <MessageCircle className="size-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border bg-gradient-to-r from-white/5 to-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-foreground" />
              <div>
                <div className="font-semibold text-sm">{t.chat.title}</div>
                <div className="text-xs text-muted-foreground">{t.chat.subtitle}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-accent"><X className="size-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground text-center pt-8">
                {lang === "es" ? "Pregúntame cualquier cosa sobre Elias: experiencia, proyectos, stack, disponibilidad..." : "Ask me anything about Elias: experience, projects, stack, availability..."}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-gradient-to-br from-green-600 to-green-700 text-white" : "bg-muted text-foreground"}`}>
                  {m.content ? (m.role === "assistant" ? renderRich(m.content) : m.content) : (loading && i === messages.length - 1 ? "..." : "")}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t.chat.placeholder}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              disabled={loading}
            />
            <Button onClick={send} disabled={loading || !input.trim()} size="sm" className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}