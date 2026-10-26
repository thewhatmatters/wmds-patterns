/**
 * The pattern gallery: a plain viewer, not a second Storybook. Every patterns/<type>/<variant>/example.tsx
 * shows up here on its own (import.meta.glob). Each pattern renders in an iframe at the chosen width, so
 * its real phone, tablet and desktop breakpoints apply.
 */
import { StrictMode, useEffect, useRef, useState, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "./gallery.css";

type Meta = { type: string; name: string; purpose: string };
type Entry = { folder: string; meta: Meta; Example: ComponentType };

const modules = import.meta.glob<{ default: ComponentType; meta: Meta }>("../patterns/*/*/example.tsx", { eager: true });
const entries: Entry[] = Object.entries(modules)
  .map(([path, mod]) => ({
    folder: path.replace("../patterns/", "").replace("/example.tsx", ""),
    meta: mod.meta,
    Example: mod.default,
  }))
  .sort((a, b) => a.folder.localeCompare(b.folder));

const widths = [390, 768, 1440] as const;
type Theme = "light" | "dark";

/** Inside the iframe: just the pattern, on the page background, in the chosen theme. */
function Frame({ entry, theme }: { entry: Entry; theme: Theme }) {
  useEffect(() => {
    if (theme === "dark") document.documentElement.dataset.theme = "dark";
    else document.documentElement.removeAttribute("data-theme");
  }, [theme]);
  return (
    <div className="min-h-svh bg-body text-fg">
      <entry.Example />
    </div>
  );
}

function Toggle<T extends string | number>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (value: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex rounded-md border border-border p-0.5">
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

function Gallery() {
  const params = new URLSearchParams(location.search);
  const [folder, setFolder] = useState(params.get("pattern") ?? entries[0]?.folder ?? "");
  const [theme, setTheme] = useState<Theme>(params.get("theme") === "dark" ? "dark" : "light");
  const [width, setWidth] = useState<(typeof widths)[number]>(1440);
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

  useEffect(() => {
    history.replaceState(null, "", `?pattern=${folder}&theme=${theme}`);
  }, [folder, theme]);

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
                      <code className="mt-1 block font-mono text-xs text-muted">patterns/{entry.folder}</code>
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
          </p>
          <Toggle label="Theme" options={["light", "dark"] as const} value={theme} onChange={setTheme} />
          <Toggle label="Width" options={widths} value={width} onChange={setWidth} />
        </div>
        <div ref={stage} className="flex-1 overflow-auto bg-[color-mix(in_srgb,var(--color-text-primary)_4%,transparent)] p-4">
          {current ? (
            <iframe
              key={`${current.folder}-${theme}`}
              title={current.meta.name}
              src={`?frame=${current.folder}&theme=${theme}`}
              style={{ width, height: 1000 / scale, zoom: scale }}
              className="mx-auto block border border-border bg-body"
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
  <StrictMode>{frameEntry ? <Frame entry={frameEntry} theme={params.get("theme") === "dark" ? "dark" : "light"} /> : <Gallery />}</StrictMode>,
);
