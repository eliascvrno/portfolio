import { useEffect, useState } from "react";

export type OS = "windows" | "mac";
export type Mode = "dark" | "light";

export const OS_KEY = "ui-os";
export const MODE_KEY = "ui-mode";
const LEGACY_KEY = "ui-os-theme";

function migrate(): { os: OS; mode: Mode } {
  let os: OS = "windows";
  let mode: Mode = "dark";
  try {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy === "mac") { os = "mac"; mode = "dark"; }
    else if (legacy === "light") { os = "windows"; mode = "light"; }
    else if (legacy === "dark") { os = "windows"; mode = "dark"; }
    const sOs = localStorage.getItem(OS_KEY);
    if (sOs === "windows" || sOs === "mac") os = sOs;
    const sMode = localStorage.getItem(MODE_KEY);
    if (sMode === "dark" || sMode === "light") mode = sMode;
  } catch {}
  return { os, mode };
}

export function apply(os: OS, mode: Mode) {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  r.classList.remove("os-windows", "os-mac", "theme-dark", "theme-light", "theme-mac");
  r.classList.add(`os-${os}`, `theme-${mode}`);
  r.classList.toggle("dark", mode === "dark");
  try {
    window.dispatchEvent(new CustomEvent("os-theme-change", { detail: { os, mode } }));
  } catch {}
}

export function setOS(os: OS) {
  try { localStorage.setItem(OS_KEY, os); } catch {}
  const { mode } = migrate();
  apply(os, mode);
}

export function setMode(mode: Mode) {
  try { localStorage.setItem(MODE_KEY, mode); } catch {}
  const { os } = migrate();
  apply(os, mode);
}

export function useOS(): [OS, (o: OS) => void] {
  const [os, setOsState] = useState<OS>("windows");
  useEffect(() => {
    const { os, mode } = migrate();
    setOsState(os);
    apply(os, mode);
    const onChange = (e: Event) => {
      const d = (e as CustomEvent<{ os: OS; mode: Mode }>).detail;
      if (d?.os) setOsState(d.os);
    };
    window.addEventListener("os-theme-change", onChange);
    return () => window.removeEventListener("os-theme-change", onChange);
  }, []);
  return [os, setOS];
}

export function useMode(): [Mode, (m: Mode) => void] {
  const [mode, setModeState] = useState<Mode>("dark");
  useEffect(() => {
    const { os, mode } = migrate();
    setModeState(mode);
    apply(os, mode);
    const onChange = (e: Event) => {
      const d = (e as CustomEvent<{ os: OS; mode: Mode }>).detail;
      if (d?.mode) setModeState(d.mode);
    };
    window.addEventListener("os-theme-change", onChange);
    return () => window.removeEventListener("os-theme-change", onChange);
  }, []);
  return [mode, setMode];
}