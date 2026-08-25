import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/use-profile";
import { Link } from "@tanstack/react-router";

type Line = { kind: "in" | "out" | "sys"; text: string; html?: boolean };

export function MiniTerminal() {
  const { lang } = useI18n();
  const { data: profile } = useProfile();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState<number>(-1);
  const [lines, setLines] = useState<Line[]>([]);
  const [closed, setClosed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const es = lang === "es";

  const banner = es
    ? [
        "Sev OS v1.0.0 — terminal interactiva",
        "Escribe 'help' para ver los comandos disponibles.",
      ]
    : [
        "Sev OS v1.0.0 — interactive terminal",
        "Type 'help' to see available commands.",
      ];

  useEffect(() => {
    setLines(banner.map((t) => ({ kind: "sys", text: t })));
    
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const commands: Record<string, () => Line[]> = {
    help: () => [
      {
        kind: "out",
        text:
          (es ? "Comandos disponibles:\n" : "Available commands:\n") +
          "  help        " + (es ? "Muestra esta ayuda" : "Show this help") + "\n" +
          "  about       " + (es ? "Sobre Elias" : "About Elias") + "\n" +
          "  whoami      " + (es ? "Quién soy" : "Who am I") + "\n" +
          "  skills      " + (es ? "Tecnologías" : "Technologies") + "\n" +
          "  projects    " + (es ? "Proyectos destacados" : "Featured projects") + "\n" +
          "  contact     " + (es ? "Cómo contactarme" : "How to reach me") + "\n" +
          "  social      " + "GitHub / LinkedIn\n" +
          "  cv          " + (es ? "Descargar CV" : "Download CV") + "\n" +
          "  date        " + (es ? "Fecha y hora" : "Date and time") + "\n" +
          "  echo <txt>  " + (es ? "Repite el texto" : "Echo text") + "\n" +
          "  clear       " + (es ? "Limpia la terminal" : "Clear the terminal") + "\n" +
          "  sudo        " + "¯\\_(ツ)_/¯",
      },
    ],
    about: () => [{ kind: "out", text: (es ? profile?.bio_es : profile?.bio_en) ?? "Full Stack Developer." }],
    whoami: () => [{ kind: "out", text: profile?.name ?? "Elias Severino" }],
    skills: () => [
      {
        kind: "out",
        text:
          "TypeScript · React · Next.js · Node.js · TanStack · Tailwind · PostgreSQL · Supabase · Python · Docker · Git",
      },
    ],
    projects: () => [
      { kind: "out", html: true, text: `→ <a href="/proyectos" class="text-green-400 underline">/proyectos</a>` },
    ],
    contact: () => [
      {
        kind: "out",
        html: true,
        text:
          `email   <a href="mailto:${profile?.email ?? "eliasseverinok@gmail.com"}" class="text-green-400 underline">${profile?.email ?? "eliasseverinok@gmail.com"}</a>\n` +
          `whatsapp <a href="https://wa.me/593963382336" target="_top" class="text-green-400 underline">+54 9 11 5937-1225</a>`,
      },
    ],
    social: () => [
      {
        kind: "out",
        html: true,
        text:
          (profile?.github_url ? `github   <a href="${profile.github_url}" target="_blank" rel="noreferrer" class="text-green-400 underline">${profile.github_url}</a>\n` : "") +
          (profile?.linkedin_url ? `linkedin <a href="${profile.linkedin_url}" target="_blank" rel="noreferrer" class="text-green-400 underline">${profile.linkedin_url}</a>` : ""),
      },
    ],
    cv: () => [
      { kind: "out", html: true, text: `→ <a href="/" class="text-green-400 underline">${es ? "usá el botón 'Descargar CV' arriba" : "use the 'Download CV' button above"}</a>` },
    ],
    date: () => [{ kind: "out", text: new Date().toString() }],
    clear: () => {
      setTimeout(() => setLines([]), 0);
      return [];
    },
    sudo: () => [{ kind: "out", text: es ? "Permiso denegado: no eres root 😎" : "Permission denied: you are not root 😎" }],
    ls: () => [{ kind: "out", text: "about  projects  skills  contact  cv  social" }],
    exit: () => [{ kind: "out", text: es ? "No puedes salir de la matrix." : "You can't exit the matrix." }],
  };

  function run(raw: string) {
    const cmdLine = raw.trim();
    const promptLine: Line = { kind: "in", text: cmdLine };
    if (!cmdLine) {
      setLines((l) => [...l, promptLine]);
      return;
    }
    setHistory((h) => [...h, cmdLine]);
    setHIdx(-1);

    const [cmd, ...rest] = cmdLine.split(/\s+/);
    const arg = rest.join(" ");
    let out: Line[] = [];
    if (cmd === "echo") {
      out = [{ kind: "out", text: arg }];
    } else if (commands[cmd]) {
      out = commands[cmd]();
    } else {
      out = [{ kind: "out", text: `${cmd}: ${es ? "comando no encontrado. Prueba 'help'." : "command not found. Try 'help'."}` }];
    }
    setLines((l) => [...l, promptLine, ...out]);
  }

  if (closed) return null;
  return (
    <section className="mt-12">
      <div
        onClick={() => inputRef.current?.focus()}
        className="rounded-xl border border-green-400/20 bg-black/80 shadow-[0_0_40px_-12px_rgba(16,185,129,0.35)] overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/5">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={(e) => { e.stopPropagation(); setClosed(true); }}
            className="group size-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center"
          >
            <svg className="opacity-0 group-hover:opacity-100" width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#4a0000" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
          <span className="size-3 rounded-full bg-yellow-500" />
          <span className="size-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-muted-foreground">guest@matu:~</span>
        </div>
        <div ref={scrollRef} className="h-64 sm:h-72 overflow-y-auto p-4 text-[13px] leading-relaxed">
          {lines.map((l, i) => (
            <div key={i} className={l.kind === "sys" ? "text-muted-foreground" : l.kind === "in" ? "text-green-400" : "text-foreground/90"}>
              {l.kind === "in" ? (
                <span>
                  <span className="text-green-400">guest@matu</span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-green-300">~$</span>{" "}
                  <span className="text-foreground">{l.text}</span>
                </span>
              ) : l.html ? (
                <pre className="whitespace-pre-wrap font-mono" dangerouslySetInnerHTML={{ __html: l.text }} />
              ) : (
                <pre className="whitespace-pre-wrap font-mono">{l.text}</pre>
              )}
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
              setInput("");
            }}
            className="flex items-center gap-2 mt-1"
          >
            <span className="text-green-400">guest@matu</span>
            <span className="text-muted-foreground -ml-2">:</span>
            <span className="text-green-300 -ml-2">~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (!history.length) return;
                  const next = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1);
                  setHIdx(next);
                  setInput(history[next]);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (hIdx === -1) return;
                  const next = hIdx + 1;
                  if (next >= history.length) {
                    setHIdx(-1);
                    setInput("");
                  } else {
                    setHIdx(next);
                    setInput(history[next]);
                  }
                }
              }}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="flex-1 bg-transparent outline-none border-0 text-foreground font-mono caret-green-300"
              placeholder={es ? "Escribe 'help' y ENTER" : "type 'help' and ENTER"}
            />
          </form>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {es ? "Tip: prueba 'help', 'about', 'projects', 'contact'." : "Tip: try 'help', 'about', 'projects', 'contact'."}
        {" "}<Link to="/proyectos" className="text-green-400 hover:underline">/proyectos</Link>
      </p>
    </section>
  );
}