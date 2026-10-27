/**
 * Font switcher (gallery only): try a pattern with any Google Font for headings, body and mono. The choice
 * sets the WMDS font knobs (`--font-family-heading`, `--font-family-body`, `--font-family-code`) inside the
 * preview frame, so the patterns' code never changes. Only the chosen families are downloaded; the list of
 * ~1,800 families (gallery/fonts.json, from `node scripts/google-fonts.mjs`) loads when the panel opens.
 */
import { useEffect } from "react";

/** [family, category, weights]: weights are "400,700" (static) or "100..900" (variable). */
export type FontEntry = [family: string, category: string, weights: string];
export type FontRole = "heading" | "body" | "mono";
export type FontChoice = Partial<Record<FontRole, string>>;

export const fontRoles: { role: FontRole; label: string; param: string; knob: string; fallback: string }[] = [
  { role: "heading", label: "Headings", param: "hf", knob: "--font-family-heading", fallback: "ui-serif, Georgia, serif" },
  { role: "body", label: "Body", param: "bf", knob: "--font-family-body", fallback: "ui-sans-serif, system-ui, sans-serif" },
  { role: "mono", label: "Mono", param: "mf", knob: "--font-family-code", fallback: "ui-monospace, monospace" },
];

let list: Promise<FontEntry[]> | undefined;
/** The family list, fetched once (a separate chunk, so the gallery doesn't load it until it's needed). */
export function loadFontList() {
  list ??= import("./fonts.json").then((m) => m.default as FontEntry[]);
  return list;
}

export function readFontChoice(params: URLSearchParams): FontChoice {
  const choice: FontChoice = {};
  for (const { role, param } of fontRoles) {
    const family = params.get(param);
    if (family) choice[role] = family;
  }
  return choice;
}

export function fontQuery(choice: FontChoice) {
  return fontRoles
    .filter(({ role }) => choice[role])
    .map(({ role, param }) => `&${param}=${encodeURIComponent(choice[role]!)}`)
    .join("");
}

function weightsOf(entry: FontEntry | undefined) {
  if (!entry) return { variable: false, list: [400] };
  const [, , weights] = entry;
  if (weights.includes("..")) {
    const [min, max] = weights.split("..").map(Number);
    return { variable: true, list: [min, max], min, max };
  }
  return { variable: false, list: weights.split(",").map(Number) };
}

function nearest(want: number, entry: FontEntry | undefined) {
  const w = weightsOf(entry);
  if (w.variable) return Math.min(Math.max(want, w.min!), w.max!);
  return w.list.reduce((best, x) => (Math.abs(x - want) < Math.abs(best - want) ? x : best), w.list[0]);
}

function stylesheetHref(family: string, entry: FontEntry | undefined) {
  const w = weightsOf(entry);
  const axis = w.variable ? `:wght@${w.min}..${w.max}` : w.list.length > 1 ? `:wght@${w.list.join(";")}` : "";
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}${axis}&display=swap`;
}

/** In the preview frame: load the chosen families and point the WMDS font knobs at them. */
export function useFontChoice(choice: FontChoice) {
  const key = JSON.stringify(choice);
  useEffect(() => {
    if (!Object.keys(choice).length) return;
    let cancelled = false;
    const added: HTMLElement[] = [];
    const root = document.documentElement;
    loadFontList().then((fonts) => {
      if (cancelled) return;
      const find = (family: string) => fonts.find(([name]) => name === family);
      const rules: string[] = [];
      for (const { role, knob, fallback } of fontRoles) {
        const family = choice[role];
        if (!family) continue;
        const entry = find(family);
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = stylesheetHref(family, entry);
        document.head.append(link);
        added.push(link);
        root.style.setProperty(knob, `"${family}", ${fallback}`);
        if (role === "heading") {
          // Ask for weights the face has: the display styles' own, and a pattern's headline weight (500).
          root.style.setProperty("--text-display-1-weight", String(nearest(700, entry)));
          root.style.setProperty("--text-display-2-weight", String(nearest(600, entry)));
          root.style.setProperty("--text-display-3-weight", String(nearest(600, entry)));
          const medium = nearest(500, entry);
          if (medium !== 500) rules.push(`h1, h2, h3 { font-weight: ${medium} !important; }`);
        }
      }
      if (rules.length) {
        const style = document.createElement("style");
        style.textContent = rules.join("\n");
        document.head.append(style);
        added.push(style);
      }
    });
    return () => {
      cancelled = true;
      for (const el of added) el.remove();
      for (const { knob } of fontRoles) root.style.removeProperty(knob);
      for (const n of [1, 2, 3]) root.style.removeProperty(`--text-display-${n}-weight`);
    };
  }, [key]);
}
