/**
 * Footer — Landscape (wmds-patterns, draft). Copy this file into your app and edit it freely.
 * A calm footer on the WMDS muted background (after Pengon): brand and a one-line pitch, live world clocks, short link
 * columns, a mono fact strip with a status dot, and a full-width landscape band drawn live as dots from a
 * video by `FooterAsciiBand` (the wm-tools ASCII media technique). Built only from @thewhatmatters/wmds parts.
 * Your Tailwind must scan this file (it does if it sits in your app's source folders).
 */
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn, Status, TextLink } from "@thewhatmatters/wmds";

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

/** Root: the WMDS muted background (`--color-background-muted`; brands set it in brand.css). */
const rootClasses = "relative w-full overflow-x-clip bg-[var(--color-background-muted)] text-fg";
/** Section padding: 48px on phones, 64px (4rem) from md, top and bottom (the band, when present, is the bottom). */
const gridClasses = "grid-page relative !pt-12 !pb-0 md:!pt-16";
const brandBlockClasses = "col-span-full flex flex-col gap-1.5 md:col-span-5 lg:col-span-6";
/** Up to two short lines, broken at the sentence (the copy sets the break); `text-pretty` keeps a lone word off the last line. */
const pitchClasses = "max-w-[52ch] text-pretty text-muted type-body";
/** Links: right-aligned block (2 columns of the grid each); 3–4 columns take their own row. */
const linksClasses = {
  one: "col-span-full mt-12 md:col-span-2 md:col-start-7 md:mt-0 lg:col-start-11",
  two: "col-span-full mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:col-span-3 md:col-start-6 md:mt-0 lg:col-span-4 lg:col-start-9",
  /** 3–4 columns: their own row on the page grid itself (subgrid), so columns line up with the grid. */
  long: "col-span-full mt-12 grid grid-cols-subgrid gap-y-10 lg:mt-16",
} as const;
const longColumnClasses = "col-span-2 lg:col-span-3";
const linkLabelClasses = "mb-6 text-muted type-eyebrow";
/** A 44px tap row; the link itself is a WMDS quiet TextLink at the item's size. */
const linkItemClasses = "type-large font-normal text-fg";
const linkClasses = "inline-block py-2.5";
/** Fact strip: centred and dot-separated from md; stacked one per line on phones. */
const factsClasses =
  "col-span-full mt-12 flex flex-col gap-2 text-muted type-eyebrow md:mt-16 md:flex-row md:flex-wrap md:justify-center md:gap-x-3 lg:mt-24";
const factClasses = "whitespace-nowrap md:[&:not(:first-child)]:before:mr-3 md:[&:not(:first-child)]:before:content-['·'_/_'']";
const bandWrapClasses = "relative mt-2 w-full md:mt-4 lg:mt-6";
/** Bottom padding when there's no band: the same 48 / 64 as the top. */
const endClasses = "h-12 md:h-16";

export function FooterLandscape({ brand, pitch, clocks, links = [], facts = [], status, moment, className }: FooterLandscapeProps) {
  const id = useId();
  const long = links.length >= 3;
  return (
    <footer className={cn(rootClasses, className)} data-pattern="footer-landscape">
      <div className={gridClasses}>
        <div className={brandBlockClasses}>
          <div data-slot="brand">{brand}</div>
          {pitch != null ? (
            <p className={pitchClasses} data-slot="pitch" data-slot-optional="">
              {pitch}
            </p>
          ) : null}
          {clocks != null ? (
            <div className="mt-6.5" data-slot="clocks" data-slot-optional="">
              {clocks}
            </div>
          ) : null}
        </div>

        {links.length > 0 ? (
          <nav aria-label="Footer" className={long ? linksClasses.long : links.length === 1 ? linksClasses.one : linksClasses.two} data-slot="links">
            {links.map((column, i) => (
              <div key={column.label} className={long ? longColumnClasses : undefined}>
                <p id={`${id}-l${i}`} className={linkLabelClasses}>
                  {column.label}
                </p>
                <ul aria-labelledby={`${id}-l${i}`}>
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
                <Status variant="dot" tone="success" besideLabel />
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

/** Follows prefers-reduced-motion, including changes while the page is open. */
function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(query.matches);
    const onChange = () => setReduce(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

/**
 * Live world clocks, ticking each second (HH:MM once a minute under reduced motion). Screen readers get
 * one plain line per city ("Austin, 8:44 AM"); the ticking digits are hidden from them, and nothing is
 * a live region (a ticking announcement is noise).
 */
export function FooterClocks({ cities }: { cities: FooterClock[] }) {
  const reduce = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), reduce ? 60_000 : 1_000);
    return () => clearInterval(timer);
  }, [reduce]);
  const formats = useMemo(
    () =>
      cities.map((c) => ({
        shown: new Intl.DateTimeFormat("en-GB", {
          timeZone: c.timeZone,
          hour: "2-digit",
          minute: "2-digit",
          ...(reduce ? {} : { second: "2-digit" }),
          hour12: false,
        }),
        spoken: new Intl.DateTimeFormat("en-US", { timeZone: c.timeZone, hour: "numeric", minute: "2-digit" }),
      })),
    [cities, reduce],
  );
  return (
    <ul className="grid grid-cols-2 gap-6 sm:flex sm:flex-wrap sm:justify-between">
      {cities.map((c, i) => (
        <li key={c.city} className="flex flex-col">
          <span className="sr-only" suppressHydrationWarning>
            {c.city}, {formats[i].spoken.format(now)}
          </span>
          <time aria-hidden className="type-code tabular-nums text-fg" suppressHydrationWarning>
            {formats[i].shown.format(now)}
          </time>
          <span aria-hidden className="type-caption text-fg">
            {c.city}
          </span>
          {c.region ? (
            <span aria-hidden className="type-eyebrow text-muted">
              {c.region}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* ---------- The landscape band ---------- */

export interface FooterAsciiBandProps {
  /** A looping landscape video (or an image): a clean silhouette on a plain sky reads best. Same-origin, or served with CORS. */
  src: string;
  /** Shown before the first frame, if the canvas fails, and under reduced motion. */
  poster?: string;
  /** "dots" (default, reads as halftone) or "classic" ASCII characters. */
  ramp?: "dots" | "classic";
  /** 0–441: how far from the sky colour a pixel must be to get a dot. Raise it to blank a hazy sky. */
  threshold?: number;
  /** 0–1: which part of the video sits in the band vertically (0 top, 1 bottom). Put the ridgeline near the band's middle. */
  focusY?: number;
}

const classicRamp = " .:-=+*#%@";
/** Band height 180 / 240 / 280. */
const bandClasses = "relative h-[180px] w-full md:h-[240px] lg:h-[280px]";
/** The drawing: text colour at 55% (45% dark), its top 20% fading into the paper. */
const bandArtClasses =
  "absolute inset-0 text-fg opacity-55 [[data-theme=dark]_&]:opacity-45 " +
  "[mask-image:linear-gradient(to_bottom,transparent,black_20%)]";
/**
 * The landscape drawn live as a halftone: each video frame is drawn tiny (one pixel per cell) on a hidden
 * canvas; sky-coloured cells (the top row's median colour) stay empty; the land's tones are stretched
 * (smoothed over frames, so passing clouds don't make it pulse) and set each dot's size, with the faintest
 * haze dropped. In dark mode the tone flips, so light land reads as light dots. Draws in the text colour,
 * pauses off-screen and holds a still frame under reduced motion. No pause control: it's part of the design,
 * not a video to watch (Randy, 2026-10-27).
 */
export function FooterAsciiBand({ src, poster, ramp = "dots", threshold = 60, focusY = 0.5 }: FooterAsciiBandProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [drawn, setDrawn] = useState(false);
  const playingRef = useRef(true);

  useEffect(() => {
    playingRef.current = !reduce;
    const video = videoRef.current;
    if (video) (reduce ? video.pause() : video.play().catch(() => {}));
  }, [reduce]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    const sample = document.createElement("canvas");
    const sctx = sample.getContext("2d", { willReadFrequently: true });
    if (!ctx || !sctx) return;
    let visible = true;
    let cols = 0, rows = 0, cell = 7, cellH = 7;
    let lo = -1, hi = -1; // smoothed tone range
    let stopped = false;
    let pending = 0;
    let firstDrawn = false;

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
      if (video.readyState < 2 || !cols) return;
      const { width, height } = canvas.getBoundingClientRect();
      const aspect = cellH / cell;
      const scale = Math.max(cols / video.videoWidth, (rows * aspect) / video.videoHeight);
      const dw = video.videoWidth * scale;
      const dh = (video.videoHeight * scale) / aspect;
      sctx.drawImage(video, (cols - dw) / 2, (rows - dh) * focusY, dw, dh);
      const data = sctx.getImageData(0, 0, cols, rows).data;
      // Sky: the median colour of the top row, so a cloud or bird in a corner can't flip the frame.
      const top = Array.from({ length: cols }, (_, x) => x * 4);
      const median = (k: number) => top.map((i) => data[i + k]).sort((a, b) => a - b)[cols >> 1];
      const sr = median(0), sg = median(1), sb = median(2);
      const color = getComputedStyle(canvas).color;
      const [ir, ig, ib] = (color.match(/\d+(\.\d+)?/g) ?? ["0", "0", "0"]).map(Number);
      const lightInk = 0.2126 * ir + 0.7152 * ig + 0.0722 * ib > 128; // dark mode: flip the tone
      const ink = new Float32Array(cols * rows).fill(-1);
      let flo = 1, fhi = 0;
      for (let p = 0; p < cols * rows; p++) {
        const i = p * 4, r = data[i], g = data[i + 1], b = data[i + 2];
        if (Math.hypot(r - sr, g - sg, b - sb) < threshold) continue;
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        const v = lightInk ? lum : 1 - lum;
        ink[p] = v;
        if (v < flo) flo = v;
        if (v > fhi) fhi = v;
      }
      // Smooth the range over frames (EMA), so the land doesn't pulse as clouds pass.
      if (lo < 0) {
        lo = flo;
        hi = fhi;
      } else {
        lo += (flo - lo) * 0.05;
        hi += (fhi - hi) * 0.05;
      }
      const span = Math.max(0.05, hi - lo);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = ink[y * cols + x];
          if (v < 0) continue;
          const t = Math.min(1, Math.max(0, (v - lo) / span)) ** 1.6;
          if (t < 0.12) continue; // the faintest haze drops out, leaving sky
          const cx = x * cell + cell / 2, cy = y * cellH + cellH / 2;
          if (ramp === "dots") {
            const radius = (cell / 2) * 0.8 * Math.sqrt(t);
            ctx.moveTo(cx + radius, cy);
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          } else {
            const ch = classicRamp[Math.min(classicRamp.length - 1, Math.floor(t * classicRamp.length))];
            if (ch !== " ") ctx.fillText(ch, cx, cy);
          }
        }
      }
      if (ramp === "dots") ctx.fill();
      if (!firstDrawn) {
        firstDrawn = true;
        setDrawn(true);
      }
    };

    // Draw on each new video frame where the browser supports it, else on animation frames.
    const v = video as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number };
    const schedule = () => {
      if (stopped) return;
      if (v.requestVideoFrameCallback) pending = v.requestVideoFrameCallback(tick);
      else pending = requestAnimationFrame(tick);
    };
    const tick = () => {
      if (visible) draw();
      schedule();
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
    video.addEventListener("seeked", onData);
    resize();
    schedule();
    return () => {
      stopped = true;
      cancelAnimationFrame(pending);
      ro.disconnect();
      io.disconnect();
      video.removeEventListener("loadeddata", onData);
      video.removeEventListener("seeked", onData);
    };
  }, [ramp, threshold, focusY, src]);

  return (
    <div className={bandClasses}>
      <div className={bandArtClasses}>
        {poster && !drawn ? <img src={poster} alt="" aria-hidden className="absolute inset-0 size-full object-cover" /> : null}
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
      </div>
      <video ref={videoRef} src={src} poster={poster} muted loop playsInline preload="auto" crossOrigin="anonymous" className="hidden" aria-hidden />
    </div>
  );
}
