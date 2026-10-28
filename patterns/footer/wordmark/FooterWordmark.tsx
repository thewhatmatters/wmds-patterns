/**
 * Footer — Wordmark: a dark newsletter card beside large link columns, a row of coloured category tiles,
 * the brand name set edge to edge, and a quiet legal line (after Lexington's footer).
 *
 * Everything sits on the WMDS page grid: the card takes the left half, the link columns the right half,
 * the tiles share the page columns (subgrid), and the wordmark spans the full content width.
 */
import { useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button, cn, Input, TextLink } from "@thewhatmatters/wmds";

export interface FooterWordmarkLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterWordmarkColumn {
  label: string;
  links: FooterWordmarkLink[];
}

export interface FooterWordmarkTile {
  label: string;
  href: string;
  /** A WMDS colour token for the tile, e.g. `var(--color-chart-categorical-1)`. */
  color: string;
}

export interface FooterWordmarkProps {
  /** Slot: the newsletter card's line (one or two short sentences). */
  pitch: ReactNode;
  /** The email field's label, read by screen readers (the field shows `placeholder`). */
  emailLabel?: string;
  placeholder?: string;
  /** The submit button's text. */
  submitLabel?: string;
  /** Called with the email on submit; wire it to your newsletter provider. */
  onSubscribe?: (email: string) => void;
  /** Slot, optional: a status line under the form (sent, already subscribed, an error), announced politely. */
  status?: ReactNode;
  /** Two link columns on the right half (2–5 links each). */
  columns: FooterWordmarkColumn[];
  /** 2–4 coloured category tiles under the card and columns. */
  tiles?: FooterWordmarkTile[];
  /** The brand name, set edge to edge. Or pass `wordmark` with the brand's own logo. */
  name: string;
  /** Slot, optional: the brand's logotype SVG instead of `name` set in the heading font. */
  wordmark?: ReactNode;
  /** Slot: the copyright line, bottom left. */
  copyright: ReactNode;
  legal?: FooterWordmarkLink[];
  className?: string;
}

/** Section padding 48 / 64 at the top; the legal line closes 24 / 40 above the page edge. */
const gridClasses = "grid-page !pt-12 !pb-6 md:!pt-16 md:!pb-10";
/** The card: dark-theme scope, so its text, field and button take the WMDS dark tokens. Left half on desktop. */
const cardClasses =
  "col-span-full flex min-h-72 flex-col justify-between gap-10 bg-[var(--color-background-body)] p-6 text-fg md:p-10 lg:col-span-6 lg:w-[calc(100%+var(--grid-column-gap)/2)]";
const pitchClasses = "max-w-[18em] text-balance type-display-3 font-normal text-fg";
const formClasses = "flex flex-col gap-3 sm:flex-row sm:items-stretch";
/** Link columns: the right half, starting on its first column; two columns of large links. */
const columnsClasses = "col-span-full mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:px-6 lg:pt-10";
const labelClasses = "mb-4 text-muted type-supporting";
const linkItemClasses = "type-heading-1 font-normal text-fg";
const linkClasses = "inline-block py-1";
/** Tiles touch, edge to edge: 2 per row on phones and tablets, 4 on desktop, where the row hangs from the card (two tiles = the card's width). */
const tilesClasses = "col-span-full mt-12 grid grid-cols-2 lg:mt-[calc(var(--grid-row-gap)*-1)] lg:grid-cols-4";
const tileClasses =
  "group flex min-h-14 items-center justify-between px-4 type-body font-medium" +
  "outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-current";
const wordmarkClasses = "col-span-full mt-16 overflow-visible text-fg md:mt-24";
const bottomClasses = "col-span-full mt-10 flex flex-col gap-4 text-muted type-supporting md:mt-16 md:flex-row md:items-center md:justify-between";

/** Light and dark ink for text on a coloured tile (WMDS has no "on" ink for its chart colours). */
const inks = { light: "#ffffff", dark: "#111111" };

function luminance(rgb: string) {
  const [r, g, b] = (rgb.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Picks each tile's ink, white or near-black, by whichever contrasts more with the tile's colour as it
 * renders (colours are tokens, so they change with the theme and the brand). Re-checks when the theme flips.
 */
function useTileInks(count: number) {
  const ref = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    const list = ref.current;
    if (!list) return;
    const pick = () => {
      for (const tile of list.querySelectorAll<HTMLElement>("[data-tile]")) {
        const bg = luminance(getComputedStyle(tile).backgroundColor);
        const onWhite = 1.05 / (bg + 0.05);
        const onDark = (bg + 0.05) / (luminance("rgb(17,17,17)") + 0.05);
        tile.style.color = onWhite >= onDark ? inks.light : inks.dark;
      }
    };
    pick();
    const observer = new MutationObserver(pick);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
    return () => observer.disconnect();
  }, [count]);
  return ref;
}

/** The brand name as SVG text sized to its own measured width, so it fills the row at any width. */
function FittedName({ name }: { name: string }) {
  const textRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState({ x: 0, y: -80, w: name.length * 60, h: 110 });
  useLayoutEffect(() => {
    // Width from the measured text; height from cap height (and descenders only when the name has them),
    // so the name sits tight in its row instead of in the font's full line box.
    const measure = () => {
      const b = textRef.current?.getBBox();
      const descent = /[gjpqy]/.test(name) ? 24 : 2;
      if (b && b.width) setBox({ x: b.x, y: -74, w: b.width, h: 74 + descent });
    };
    measure();
    // Measure again whenever fonts finish loading (the heading font's metrics differ from the fallback's,
    // and a page can swap fonts later).
    document.fonts?.ready.then(measure);
    document.fonts?.addEventListener("loadingdone", measure);
    return () => document.fonts?.removeEventListener("loadingdone", measure);
  }, [name]);
  return (
    <svg viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} className="block h-auto w-full overflow-visible" role="img" aria-label={name}>
      <text ref={textRef} x="0" y="0" fill="currentColor" style={{ fontFamily: "var(--font-family-heading)", fontSize: 100, letterSpacing: "-0.03em" }}>
        {name}
      </text>
    </svg>
  );
}

export function FooterWordmark({
  pitch,
  emailLabel = "Email address",
  placeholder = "you@example.com",
  submitLabel = "Subscribe",
  onSubscribe,
  status,
  columns,
  tiles = [],
  name,
  wordmark,
  copyright,
  legal = [],
  className,
}: FooterWordmarkProps) {
  const id = useId();
  const tilesRef = useTileInks(tiles.length);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email === "string" && email) onSubscribe?.(email);
  };
  return (
    <footer className={cn("relative w-full", className)} data-pattern="footer-wordmark">
      <div className={gridClasses}>
        <div className={cardClasses} data-theme="dark" data-slot="newsletter">
          <p className={pitchClasses} data-slot="pitch">
            {pitch}
          </p>
          <div>
            <form className={formClasses} onSubmit={submit}>
              <label htmlFor={`${id}-email`} className="sr-only">
                {emailLabel}
              </label>
              <Input id={`${id}-email`} name="email" type="email" autoComplete="email" required placeholder={placeholder} size="lg" className="min-w-0 flex-1" />
              <Button role="primary" size="lg" type="submit">
                {submitLabel}
              </Button>
            </form>
            <p aria-live="polite" className="mt-3 text-muted type-supporting empty:hidden" data-slot="status" data-slot-optional="">
              {status}
            </p>
          </div>
        </div>

        <nav aria-label="Footer" className={columnsClasses} data-slot="columns">
          {columns.map((column, i) => (
            <div key={column.label}>
              <p id={`${id}-c${i}`} className={labelClasses}>
                {column.label}
              </p>
              <ul aria-labelledby={`${id}-c${i}`}>
                {column.links.map((link) => (
                  <li key={link.label} className={linkItemClasses}>
                    <TextLink href={link.href} variant="quiet" external={link.external} className={linkClasses}>
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {tiles.length > 0 ? (
          <ul ref={tilesRef} className={tilesClasses} data-slot="tiles" data-slot-optional="">
            {tiles.map((tile) => (
              <li key={tile.label} className="contents">
                <a href={tile.href} className={tileClasses} style={{ backgroundColor: tile.color }} data-tile="">
                  {tile.label}
                  <svg viewBox="0 0 16 16" className="size-4 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden focusable="false">
                    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <div className={wordmarkClasses} data-slot="wordmark">
          {wordmark ?? <FittedName name={name} />}
        </div>

        <div className={bottomClasses}>
          <p data-slot="copyright">{copyright}</p>
          {legal.length > 0 ? (
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {legal.map((link) => (
                <li key={link.label}>
                  <TextLink href={link.href} variant="quiet" className="inline-block py-3 md:py-0">
                    {link.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
