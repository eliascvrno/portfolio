export function formatDateRange(start: string, end: string | null, lang: "es" | "en") {
  const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };
  const locale = lang === "es" ? "es-ES" : "en-US";
  const s = new Date(start).toLocaleDateString(locale, opts);
  const e = end ? new Date(end).toLocaleDateString(locale, opts) : lang === "es" ? "Actualidad" : "Present";
  return `${s} — ${e}`;
}