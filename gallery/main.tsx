/**
 * The pattern gallery: a plain viewer, not a second Storybook. Every patterns/<type>/<variant>/example.tsx
 * shows up here on its own (import.meta.glob). Each pattern renders in an iframe at the chosen width, so
 * its real phone, tablet and desktop breakpoints apply.
 */
import { StrictMode, useEffect, useRef, useState, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { dependencies } from "../package.json";
import { patternCode, patternPrompt, patternStatus } from "./copy";
import "./gallery.css";
import { fontQuery, fontRoles, loadFontList, readFontChoice, useFontChoice, type FontChoice, type FontEntry } from "./fonts";
import { useMeasure } from "./measure";

/** `themes` limits a pattern to the themes its example suits; both when left out. */
type Theme = "light" | "dark";
type Meta = { type: string; name: string; purpose: string; themes?: Theme[] };
type Entry = { folder: string; meta: Meta; Example: ComponentType; code: string; prompt: string; status: "draft" | "approved" };

const modules = import.meta.glob<{ default: ComponentType; meta: Meta }>("../patterns/*/*/example.tsx", { eager: true });
// The repo's own files, as text at build time, so Copy code and Copy prompt can't drift from them.
const sources = import.meta.glob<string>("../patterns/*/*/*.tsx", { query: "?raw", import: "default", eager: true });
const readmes = import.meta.glob<string>("../patterns/*/*/README.md", { query: "?raw", import: "default", eager: true });
const wmdsVersion = dependencies["@thewhatmatters/wmds"];

const entries: Entry[] = Object.entries(modules)
  .map(([path, mod]) => {
    const folder = path.replace("../patterns/", "").replace("/example.tsx", "");
    // The pattern file is the folder's .tsx that isn't the example.
    const [, source = ""] =
      Object.entries(sources).find(([file]) => file.startsWith(`../patterns/${folder}/`) && !file.endsWith("/example.tsx")) ?? [];
    const readme = readmes[`../patterns/${folder}/README.md`] ?? "";
    return {
      folder,
      meta: mod.meta,
      Example: mod.default,
      code: patternCode(folder, source, wmdsVersion),
      prompt: patternPrompt(folder, readme),
      status: patternStatus(readme),
    };
  })
  .sort((a, b) => a.folder.localeCompare(b.folder));

const widths = [390, 768, 1440] as const;

/**
 * Slots view: outline every `data-slot` element in pink, and label it "Slot: name (optional)" just above
 * its top-left corner. Labels live in one fixed overlay (never clipped by a pattern's masks or overflow)
 * and are added here, not in the patterns, so copied code stays clean.
 */
function useSlotOutlines(on: boolean) {
  useEffect(() => {
    if (!on) return;
    const layer = document.createElement("div");
    layer.dataset.slotLayer = "";
    document.body.append(layer);
    const place = () => {
      const slots = [...document.querySelectorAll<HTMLElement>("[data-slot]")];
      layer.replaceChildren(
        ...slots.map((slot) => {
          slot.classList.add("slot-outline");
          const box = slot.getBoundingClientRect();
          const label = document.createElement("span");
          label.dataset.slotLabel = "";
          label.textContent = `Slot: ${slot.dataset.slot}${slot.hasAttribute("data-slot-optional") ? " (optional)" : ""}`;
          // Above the slot's top-left corner; inside it when there's no room above (a slot at the very top).
          const top = box.top >= 20 ? box.top - 18 : box.top + 4;
          label.style.transform = `translate(${Math.max(4, box.left)}px, ${Math.max(2, top)}px)`;
          return label;
        }),
      );
    };
    place();
    const timer = setInterval(place, 300); // follows scrolling, resizing and slots that mount later
    addEventListener("scroll", place, { passive: true });
    return () => {
      clearInterval(timer);
      removeEventListener("scroll", place);
      layer.remove();
      for (const slot of document.querySelectorAll(".slot-outline")) slot.classList.remove("slot-outline");
    };
  }, [on]);
}

/** Inside the iframe: just the pattern, on the page background, in the chosen theme. */
function Frame({ entry, theme, slots, measure, fonts }: { entry: Entry; theme: Theme; slots: boolean; measure: boolean; fonts: FontChoice }) {
  useEffect(() => {
    if (theme === "dark") document.documentElement.dataset.theme = "dark";
    else document.documentElement.removeAttribute("data-theme");
  }, [theme]);
  useSlotOutlines(slots);
  useMeasure(measure);
  useFontChoice(fonts);
  // Tell the gallery how tall the pattern is, so the frame fits it (no empty page below a short section).
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = content.current;
    if (!element) return;
    const observer = new ResizeObserver(() => parent.postMessage({ patternHeight: Math.ceil(element.getBoundingClientRect().height) }, location.origin));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={content} className="bg-body text-fg">
      <entry.Example />
    </div>
  );
}

function Toggle<T extends string | number>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (value: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex items-center rounded-md border border-border p-0.5">
      <span aria-hidden className="px-2 text-xs text-muted">
        {label}
      </span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
          className="min-h-8 rounded px-3 text-sm aria-pressed:bg-fg aria-pressed:text-body"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/**
 * Copies `text`, says "Copied" in the button (announced politely), and falls back to a dialog with the
 * text selected when the clipboard is refused.
 */
function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      dialog.current?.showModal();
      area.current?.select();
    }
  }

  return (
    <>
      <button type="button" onClick={copy} className="min-h-8 rounded-md border border-border px-3 text-sm">
        <span aria-live="polite">{copied ? "Copied" : label}</span>
      </button>
      <dialog ref={dialog} aria-label={label} className="m-auto w-[min(48rem,90vw)] rounded-lg border border-border bg-body p-4 text-fg">
        <p className="mb-2 text-sm">The clipboard isn't available here. The text is selected: press ⌘C or Ctrl+C.</p>
        <textarea ref={area} readOnly value={text} rows={16} className="w-full rounded-md border border-border bg-surface p-2 font-mono text-xs" />
        <form method="dialog" className="mt-2 text-right">
          <button type="submit" className="min-h-8 rounded-md border border-border px-3 text-sm">
            Close
          </button>
        </form>
      </dialog>
    </>
  );
}

/**
 * Headings, body and mono font pickers: type to search every Google Font (native datalist), Enter or pick to
 * apply. Empty means the WMDS default. Categories follow each name, so "serif" or "mono" narrows the list.
 */
function FontPanel({ value, onChange }: { value: FontChoice; onChange: (next: FontChoice) => void }) {
  const [fonts, setFonts] = useState<FontEntry[]>([]);
  const [drafts, setDrafts] = useState<FontChoice>(value);
  useEffect(() => {
    loadFontList().then(setFonts);
  }, []);
  const names = new Set(fonts.map(([family]) => family));
  const apply = (role: keyof FontChoice, family: string) => {
    const next = { ...value };
    if (family && names.has(family)) next[role] = family;
    else if (!family) delete next[role];
    else return;
    onChange(next);
  };
  return (
    <div id="font-panel" role="group" aria-label="Fonts" className="flex flex-wrap items-end gap-3 border-b border-border px-3 py-2">
      <datalist id="google-fonts">
        {fonts.map(([family, category]) => (
          <option key={family} value={family} label={category} />
        ))}
      </datalist>
      {fontRoles.map(({ role, label }) => (
        <label key={role} className="flex flex-col gap-1 text-xs text-muted">
          {label}
          <input
            list="google-fonts"
            value={drafts[role] ?? ""}
            placeholder="WMDS default"
            onChange={(event) => {
              const family = event.target.value;
              setDrafts((d) => ({ ...d, [role]: family }));
              if (names.has(family) || family === "") apply(role, family);
            }}
            onKeyDown={(event) => event.key === "Enter" && apply(role, event.currentTarget.value)}
            className="min-h-8 w-56 rounded-md border border-border bg-surface px-2 text-sm text-fg"
          />
        </label>
      ))}
      <button
        type="button"
        onClick={() => {
          setDrafts({});
          onChange({});
        }}
        className="min-h-8 rounded-md border border-border px-3 text-sm"
      >
        Reset
      </button>
      <p className="text-xs text-muted">{fonts.length ? `${fonts.length} Google Fonts. Only the ones you pick load.` : "Loading the font list…"}</p>
    </div>
  );
}

function Gallery() {
  const params = new URLSearchParams(location.search);
  const [folder, setFolder] = useState(params.get("pattern") ?? entries[0]?.folder ?? "");
  const [theme, setTheme] = useState<Theme>(params.get("theme") === "dark" ? "dark" : "light");
  const [width, setWidth] = useState<(typeof widths)[number]>(1440);
  const [slots, setSlots] = useState<"off" | "on">(params.get("slots") === "on" ? "on" : "off");
  const [measure, setMeasure] = useState<"off" | "on">(params.get("measure") === "on" ? "on" : "off");
  const [fonts, setFonts] = useState<FontChoice>(() => readFontChoice(params));
  const [fontsOpen, setFontsOpen] = useState(Object.keys(readFontChoice(params)).length > 0);
  // The overlays' query string, shared by the address bar and the frame.
  const overlays = `${slots === "on" ? "&slots=on" : ""}${measure === "on" ? "&measure=on" : ""}${fontQuery(fonts)}`;
  const current = entries.find((entry) => entry.folder === folder) ?? entries[0];
  // Scale a frame wider than the pane down to fit; it still lays out at its real width.
  const stage = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(1440);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const scale = Math.min(1, available / width);
  // The frame's height follows the pattern's (sent from inside the frame).
  const [height, setHeight] = useState(1000);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin === location.origin && typeof event.data?.patternHeight === "number") setHeight(event.data.patternHeight);
    };
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  }, []);
  const themes: readonly Theme[] = current?.meta.themes ?? ["light", "dark"];
  const shownTheme: Theme = themes.includes(theme) ? theme : themes[0];

  useEffect(() => {
    history.replaceState(null, "", `?pattern=${folder}&theme=${theme}${overlays}`);
  }, [folder, theme, overlays]);

  const types = [...new Set(entries.map((entry) => entry.meta.type))];

  return (
    <div className="flex h-svh bg-body text-fg">
      <nav aria-label="Patterns" className="w-72 shrink-0 overflow-y-auto border-r border-border p-4">
        <p className="mb-4 font-mono text-xs text-muted">wmds-patterns</p>
        {types.map((type) => (
          <section key={type} className="mb-6">
            <h2 className="mb-2 text-sm font-semibold">{type}</h2>
            <ul className="flex flex-col gap-1">
              {entries
                .filter((entry) => entry.meta.type === type)
                .map((entry) => (
                  <li key={entry.folder}>
                    <button
                      type="button"
                      aria-current={entry.folder === current?.folder ? "page" : undefined}
                      onClick={() => setFolder(entry.folder)}
                      className="w-full rounded-md p-2 text-left aria-[current=page]:bg-[color-mix(in_srgb,var(--color-text-primary)_8%,transparent)]"
                    >
                      <span className="block text-sm font-medium">{entry.meta.name}</span>
                      <span className="block text-xs text-muted">{entry.meta.purpose}</span>
                      <code className="mt-1 block font-mono text-xs text-muted">
                        patterns/{entry.folder}
                        {entry.status === "draft" ? " · draft" : ""}
                      </code>
                    </button>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </nav>
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-3">
          <p className="mr-auto text-sm">
            {current?.meta.name} <code className="ml-2 font-mono text-xs text-muted">patterns/{current?.folder}</code>
            {current?.status === "draft" ? <span className="ml-2 rounded-sm border border-border px-1.5 py-0.5 font-mono text-xs text-muted">draft</span> : null}
          </p>
          {current ? (
            <>
              <CopyButton label="Copy code" text={current.code} />
              <CopyButton label="Copy prompt" text={current.prompt} />
            </>
          ) : null}
          <Toggle label="Theme" options={themes} value={shownTheme} onChange={setTheme} />
          {themes.length === 1 ? <span className="text-xs text-muted">{themes[0]} only</span> : null}
          <Toggle label="Width" options={widths} value={width} onChange={setWidth} />
          <button
            type="button"
            aria-expanded={fontsOpen}
            aria-controls="font-panel"
            onClick={() => setFontsOpen((open) => !open)}
            className="min-h-8 rounded-md border border-border px-3 text-sm aria-expanded:bg-fg aria-expanded:text-body"
          >
            Fonts{Object.keys(fonts).length ? ` · ${Object.keys(fonts).length}` : ""}
          </button>
          <Toggle label="Slots" options={["off", "on"] as const} value={slots} onChange={setSlots} />
          <Toggle label="Measure" options={["off", "on"] as const} value={measure} onChange={setMeasure} />
          {measure === "on" ? (
            <p className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1"><span aria-hidden className="size-2.5 rounded-sm bg-[#15803d]" />padding</span>
              <span className="flex items-center gap-1"><span aria-hidden className="size-2.5 rounded-sm bg-[#c2410c]" />margin</span>
              <span className="flex items-center gap-1"><span aria-hidden className="size-2.5 rounded-sm bg-[#7e22ce]" />gap</span>
            </p>
          ) : null}
        </div>
        {fontsOpen ? <FontPanel value={fonts} onChange={setFonts} /> : null}
        <div ref={stage} className="flex flex-1 overflow-auto bg-[color-mix(in_srgb,var(--color-text-primary)_4%,transparent)] p-4">
          {current ? (
            <iframe
              key={`${current.folder}-${shownTheme}${overlays}`}
              title={current.meta.name}
              src={`?frame=${current.folder}&theme=${shownTheme}${overlays}`}
              style={{ width, height, zoom: scale }}
              // Auto margins centre it both ways when it fits, and fall back to the top-left when it overflows (so nothing is cut off).
              className="m-auto block shrink-0 border border-border bg-body"
            />
          ) : (
            <p className="text-muted">No patterns yet: add a folder under patterns/&lt;type&gt;/&lt;variant&gt;/.</p>
          )}
        </div>
      </main>
    </div>
  );
}

const params = new URLSearchParams(location.search);
const frame = params.get("frame");
const frameEntry = frame ? entries.find((entry) => entry.folder === frame) : undefined;

createRoot(document.getElementById("root")!).render(
  <StrictMode>{frameEntry ? <Frame entry={frameEntry} theme={params.get("theme") === "dark" ? "dark" : "light"} slots={params.get("slots") === "on"} measure={params.get("measure") === "on"} fonts={readFontChoice(params)} /> : <Gallery />}</StrictMode>,
);
