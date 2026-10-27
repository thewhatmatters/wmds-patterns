/**
 * Footer — Landscape (wmds-patterns, draft). Copy this file into your app and edit it freely.
 * A calm footer on tinted paper (after Pengon): brand and a one-line pitch, live world clocks, short link
 * columns, a mono fact strip with a status dot, and a full-width landscape band drawn live as dots from a
 * video by `FooterAsciiBand` (the wm-tools ASCII media technique). Built only from @thewhatmatters/wmds parts.
 * Your Tailwind must scan this file (it does if it sits in your app's source folders).
 */
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@thewhatmatters/wmds";

/* Every class is written out in full (never interpolated) so Tailwind sees it. `data-slot` marks where your
   content goes; it does nothing on a page (the gallery outlines slots with it). */

export interface FooterLandscapeLinkColumn {
  label: string;
  links: { label: string; href: string; external?: boolean }[];
}

export interface FooterLandscapeProps {
  /** Slot: the logo lockup (a co-brand is fine). */
  brand: ReactNode;
  /** Slot: one short line about the company, about 40 characters wide; may hold an inline link. */
  pitch?: ReactNode;
  /** Slot, optional: a small live detail under the pitch, usually `<FooterClocks cities={…} />`. */
  clocks?: ReactNode;
  /** 1–4 short link columns. Four get their own row under the brand. */
  links?: FooterLandscapeLinkColumn[];
  /** Slot, optional: the fact strip items (©, domain, email, where it's built); shown dot-separated. */
  facts?: ReactNode[];
  /** Optional status at the end of the fact strip, with a green dot (e.g. "All systems operational"). */
  status?: ReactNode;
  /** Slot, optional: the moment at the bottom, usually `<FooterAsciiBand src=… />`. Leave it out to end on the strip. */
  moment?: ReactNode;
  className?: string;
}

/** Root: the tinted paper. `--color-background-muted` is the paper knob (set it in brand.css). */
const rootClasses = "relative w-full overflow-x-clip bg-[var(--color-background-muted)] text-fg";
/** Faint column rules on the page grid, fading down; hidden on phones (4 rules read as a table). */
const rulesClasses =
  "pointer-events-none absolute inset-x-0 top-0 hidden h-20 grid-page !py-0 md:grid lg:h-30 " +
  "[mask-image:linear-gradient(to_bottom,black,transparent)] " +
  "[&>span]:border-l [&>span]:border-[var(--color-border)] [&>span:last-child]:border-r " +
  "[&>span:nth-child(n+9)]:hidden lg:[&>span:nth-child(n+9)]:block";
const gridClasses = "grid-page relative !pt-16 !pb-0 md:!pt-20 lg:!pt-24";
const brandBlockClasses = "col-span-full flex flex-col gap-6 md:col-span-5 lg:col-span-6";
const pitchClasses = "max-w-[40ch] text-muted type-body [&_a]:text-fg [&_a]:underline";
/** Links: right-aligned block (2 columns of the grid each); 3–4 columns take their own row. */
const linksClasses = {
  short: "col-span-full mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:col-span-3 md:col-start-6 md:mt-0 lg:col-span-4 lg:col-start-9",
  long: "col-span-full mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:mt-16",
} as const;
const linkLabelClasses = "mb-6 text-muted type-eyebrow";
const linkClasses = "inline-block py-2.5 type-large font-normal text-fg hover:underline focus-visible:underline";
/** Fact strip: centred and dot-separated from md; stacked one per line on phones. */
const factsClasses =
  "col-span-full mt-12 flex flex-col gap-2 text-muted type-eyebrow md:mt-16 md:flex-row md:flex-wrap md:justify-center md:gap-x-3 lg:mt-24 " +
  "[&_a]:text-fg [&_a]:underline";
const factClasses = "whitespace-nowrap md:[&:not(:first-child)]:before:mr-3 md:[&:not(:first-child)]:before:content-['·']";
const bandWrapClasses = "relative mt-10 w-full md:mt-12 lg:mt-16";
const endClasses = "h-12 md:h-16";

export function FooterLandscape({ brand, pitch, clocks, links = [], facts = [], status, moment, className }: FooterLandscapeProps) {
  const id = useId();
  const long = links.length >= 3;
  return (
    <footer className={cn(rootClasses, className)} data-pattern="footer-landscape">
      <div className={rulesClasses} aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className={gridClasses}>
        <div className={brandBlockClasses}>
          <div data-slot="brand">{brand}</div>
          {pitch != null ? (
            <p className={pitchClasses} data-slot="pitch" data-slot-optional="">
              {pitch}
            </p>
          ) : null}
          {clocks != null ? (
            <div className="mt-2" data-slot="clocks" data-slot-optional="">
              {clocks}
            </div>
          ) : null}
        </div>

        {links.length > 0 ? (
          <nav aria-label="Footer" className={long ? linksClasses.long : linksClasses.short} data-slot="links">
            {links.map((column, i) => (
              <div key={column.label}>
                <p id={`${id}-l${i}`} className={linkLabelClasses}>
                  {column.label}
                </p>
                <ul aria-labelledby={`${id}-l${i}`}>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className={linkClasses}
                        {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {link.label}
                        {link.external ? <span aria-hidden> ↗</span> : null}
                        {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        ) : null}

        {facts.length > 0 || status != null ? (
          <ul className={factsClasses} data-slot="facts" data-slot-optional="">
            {facts.map((fact, i) => (
              <li key={i} className={factClasses}>
                {fact}
              </li>
            ))}
            {status != null ? (
              <li className={cn(factClasses, "inline-flex items-center gap-2")}>
                <span className="inline-block size-2 rounded-full bg-success" aria-hidden />
                <span className="sr-only">Status: </span>
                {status}
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>

      {moment != null ? (
        <div className={bandWrapClasses} data-slot="moment" data-slot-optional="">
          {moment}
        </div>
      ) : (
        <div className={endClasses} />
      )}
    </footer>
  );
}

/* ---------- Clocks ---------- */

export interface FooterClock {
  city: string;
  region?: string;
  /** IANA time zone, e.g. "America/Chicago". */
  timeZone: string;
}

/**
 * Live world clocks: `<time>` per city, ticking each second (each minute, without seconds, under reduced
 * motion). Not a live region: a ticking announcement is noise; each clock has an aria-label instead.
 */
export function FooterClocks({ cities }: { cities: FooterClock[] }) {
  const [now, setNow] = useState(() => new Date());
  const [seconds, setSeconds] = useState(true);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSeconds(!reduce);
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), reduce ? 60_000 : 1_000);
    return () => clearInterval(timer);
  }, []);
  return (
    <ul className="grid grid-cols-2 gap-6 sm:flex sm:flex-wrap sm:gap-8">
      {cities.map((c) => {
        const time = new Intl.DateTimeFormat("en-GB", {
          timeZone: c.timeZone,
          hour: "2-digit",
          minute: "2-digit",
          ...(seconds ? { second: "2-digit" } : {}),
          hour12: false,
        }).format(now);
        const spoken = new Intl.DateTimeFormat("en-US", { timeZone: c.timeZone, hour: "numeric", minute: "2-digit" }).format(now);
        return (
          <li key={c.city} className="flex flex-col">
            <time aria-label={`${c.city}, ${spoken}`} className="type-code tabular-nums text-fg" suppressHydrationWarning>
              {time}
            </time>
            <span className="type-caption text-fg">{c.city}</span>
            {c.region ? <span className="type-eyebrow text-muted">{c.region}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- The ASCII band ---------- */

export interface FooterAsciiBandProps {
  /** A looping landscape video (or an image): a clean silhouette on a plain sky reads best. Same-origin, or served with CORS. */
  src: string;
  /** Shown before the first frame, if the canvas fails, and under reduced motion. */
  poster?: string;
  /** "dots" (default, reads as halftone) or "classic" ASCII characters. */
  ramp?: "dots" | "classic";
  /** 0–441: how far from the sky colour a pixel must be to get a dot. Raise it to blank a hazy sky. */
  threshold?: number;
}

const ramps = { dots: " ·•●", classic: " .:-=+*#%@" } as const;
/** Band height 220 / 300 / 360; its top 20% fades into the paper. */
const bandClasses =
  "relative h-[220px] w-full text-fg md:h-[300px] lg:h-[360px] " +
  "[mask-image:linear-gradient(to_bottom,transparent,black_20%)] opacity-55 dark:opacity-45";
const toggleClasses =
  "absolute right-3 bottom-3 z-10 inline-flex min-h-11 items-center rounded-full px-3 text-muted type-eyebrow " +
  "bg-[color-mix(in_srgb,var(--color-background-muted)_80%,transparent)] hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-fg)]";

/**
 * The landscape drawn live as a halftone: each frame the video is drawn tiny (one pixel per cell) on a
 * hidden canvas; each cell's tone (stretched across the land each frame) sets a dot's size, and
 * sky-coloured cells stay empty. `ramp="classic"` draws ASCII characters instead of dots. Draws in the text
 * colour, so it follows light and dark (dark inverts the source, so ridges read as light dots). Pauses
 * off-screen, holds a still frame under reduced motion, and has a Pause motion toggle (WCAG 2.2.2).
 */
export function FooterAsciiBand({ src, poster, ramp = "dots", threshold = 60 }: FooterAsciiBandProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [drawn, setDrawn] = useState(false);
  const playingRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    const sample = document.createElement("canvas");
    const sctx = sample.getContext("2d", { willReadFrequently: true });
    if (!ctx || !sctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      playingRef.current = false;
      setPlaying(false);
    }
    const chars = ramps[ramp];
    let raf = 0;
    let visible = true;
    let cols = 0;
    let rows = 0;
    let cell = 7;
    let cellH = 7;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = width >= 1024 ? 7 : width >= 768 ? 6 : 5;
      cellH = ramp === "dots" ? cell : cell * 1.25;
      cols = Math.max(1, Math.floor(width / cell));
      rows = Math.max(1, Math.floor(height / cellH));
      sample.width = cols;
      sample.height = rows;
      ctx.font = `${Math.round(cellH * 1.1)}px ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    };

    const draw = () => {
      if (video.readyState < 2) return;
      const { width, height } = canvas.getBoundingClientRect();
      // Cover-fit the video into the grid, anchored to the bottom (the ridges).
      const scale = Math.max(cols / video.videoWidth, (rows * (cellH / cell)) / video.videoHeight);
      const dw = video.videoWidth * scale;
      const dh = (video.videoHeight * scale) / (cellH / cell);
      sctx.drawImage(video, (cols - dw) / 2, rows - dh, dw, dh);
      const data = sctx.getImageData(0, 0, cols, rows).data;
      // The sky colour: the top-left sample, so any plain sky works.
      const sr = data[0], sg = data[1], sb = data[2];
      // Stretch the tones of the land (not the sky) to the full range each frame, so near and far ridges
      // get different dot sizes instead of one solid block.
      const ink = new Float32Array(cols * rows).fill(-1);
      let lo = 1, hi = 0;
      for (let p = 0; p < cols * rows; p++) {
        const i = p * 4, r = data[i], g = data[i + 1], b = data[i + 2];
        if (Math.hypot(r - sr, g - sg, b - sb) < threshold) continue;
        const v = 1 - (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        ink[p] = v;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      const span = Math.max(0.05, hi - lo);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(canvas).color;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = ink[y * cols + x];
          if (v < 0) continue;
          // Ease the tone so mid ridges stay open; 0.15 keeps the farthest haze as fine specks.
          const t = 0.15 + 0.85 * Math.pow((v - lo) / span, 1.8);
          const cx = x * cell + cell / 2, cy = y * cellH + cellH / 2;
          if (ramp === "dots") {
            const radius = (cell / 2) * 0.8 * Math.sqrt(t);
            if (radius < 0.35) continue;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const ch = chars[Math.min(chars.length - 1, Math.floor(t * chars.length))];
            if (ch !== " ") ctx.fillText(ch, cx, cy);
          }
        }
      }
      setDrawn(true);
    };

    const loop = () => {
      if (visible && playingRef.current) draw();
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && playingRef.current) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(canvas);
    const onData = () => {
      resize();
      draw();
    };
    video.addEventListener("loadeddata", onData);
    resize();
    if (!reduce) video.play().catch(() => {});
    loop();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      video.removeEventListener("loadeddata", onData);
    };
  }, [ramp, threshold, src]);

  const toggle = () => {
    const video = videoRef.current;
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    if (video) next ? video.play().catch(() => {}) : video.pause();
  };

  return (
    <div className={bandClasses}>
      {poster && !drawn ? <img src={poster} alt="" aria-hidden className="absolute inset-0 size-full object-cover object-bottom" /> : null}
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
      <video ref={videoRef} src={src} muted loop playsInline preload="auto" crossOrigin="anonymous" className="hidden" aria-hidden />
      <button type="button" onClick={toggle} className={toggleClasses}>
        {playing ? "Pause motion" : "Play motion"}
      </button>
    </div>
  );
}
