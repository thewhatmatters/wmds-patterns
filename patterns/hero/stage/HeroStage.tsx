/**
 * Hero — Stage (wmds-patterns, draft). Copy this file into your app and edit it freely.
 * One hero, two choices (Randy, 2026-10-30; it replaces Hero — Feature Center and Hero — Over Media):
 * - `backdrop`: none (the page colour), or a full-width picture or looping video behind the copy, under a scrim.
 * - `align`: the copy at the start, centre or end. `end` only over a backdrop (a photo whose subject sits
 *   on the left); on a plain page right-aligned copy is hard to read, so it falls back to `start`.
 * The framed product window (`visual`) and the proof strip (`logos`) are optional in both.
 * Built only from @thewhatmatters/wmds parts. Your Tailwind must scan this file.
 */
import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { Badge, cn } from "@thewhatmatters/wmds";

export type HeroStageAlign = "start" | "center" | "end";

/** What sits behind the hero. Leave it out for the page colour. */
export type HeroStageBackdrop =
  | {
      kind: "image";
      /** A decorative `<img alt="">` with its width and height. */
      media: ReactNode;
      /** The part of the picture to keep in view as it crops (CSS `object-position`, e.g. `"50% 30%"`). */
      focus?: string;
    }
  | {
      kind: "video";
      /** A decorative looping video: muted, no controls, its `poster` under reduced motion. */
      src: string;
      poster?: string;
      focus?: string;
    };

export interface HeroStageProps {
  /** Slot, optional: a nav above the hero. Leave it empty when the page already has a nav (the usual case). */
  nav?: ReactNode;
  /** Optional: a short line above the headline, 1–3 words in sentence case (the capitals come from the style). */
  eyebrow?: ReactNode;
  /** Where the eyebrow links. With it, the eyebrow is one outlined pill link with an arrow (Eyebrow E10). */
  eyebrowHref?: string;
  /** The page's only H1: 12 words at most, 2 lines at desktop (Display D6, D7). */
  headline: ReactNode;
  /** Optional: the lead, 1–2 sentences, in ink (Lead L7, L8). */
  lead?: ReactNode;
  /** Slot: the CTA row, one WMDS `<Button role="primary" size="lg">` and at most one `role="outline"` beside it (R2, U7). */
  actions?: ReactNode;
  /** Optional: a picture or video behind the hero. */
  backdrop?: HeroStageBackdrop;
  /** Where the copy sits. Default: `center` on a plain page, `start` over a backdrop. Phones are always `start`. */
  align?: HeroStageAlign;
  /** Slot, optional: what goes in the framed window (a product shot, a site). Decorative unless it carries content. */
  visual?: ReactNode;
  /** Slot, optional: proof under the hero. Usually `<HeroStageLogos logos={…} />`. */
  logos?: ReactNode;
  /**
   * Backdrop only: the full screen height less 64px, so the next section's edge shows (Hero R9, R4), with a scroll
   * cue. Off by default: the hero is its content plus Band `lg` spacing.
   */
  fullHeight?: boolean;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. `data-slot` marks where your
   content goes; it does nothing on a page (the gallery outlines slots with it). */

/** Full-width wrapper: the glow's overflow is clipped here, never on a narrower element. */
const rootClasses = "relative w-full overflow-x-clip";

/** Plain page: the section lays its content on the WMDS page grid; spacing comes from the copy and the last row. */
const plainSectionClasses = "grid-page relative !py-0";
/**
 * Over a backdrop: the picture's height, at least 28rem on phones, 36rem from md, 40rem from lg, or the screen
 * less 64px with `fullHeight`. Dark-theme scope, so the WMDS ink, muted text and buttons read on the scrim.
 */
const backdropSectionClasses = {
  content: "relative isolate flex w-full flex-col overflow-hidden min-h-[28rem] md:min-h-[36rem] lg:min-h-[40rem]",
  full: "relative isolate flex w-full flex-col overflow-hidden min-h-[calc(100svh-4rem)]",
} as const;
/** The grid over the backdrop: copy at the bottom of the picture, Band `lg` spacing (96, 64 on phones; S8). */
const backdropGridClasses = {
  bottom:
    "grid-page mt-auto w-full !pt-[calc(var(--grid-baseline)*8)] !pb-[calc(var(--grid-baseline)*8)] md:!pt-[calc(var(--leading-base)*4)] md:!pb-[calc(var(--leading-base)*4)]",
  top: "grid-page w-full !pt-[calc(var(--grid-baseline)*8)] !pb-[calc(var(--grid-baseline)*8)] md:!pt-[calc(var(--leading-base)*4)] md:!pb-[calc(var(--leading-base)*4)]",
} as const;
const mediaClasses = "absolute inset-0 -z-10 size-full object-cover";
/**
 * Scrim in the dark page colour. Bottom-up behind bottom-set copy: the headline clears 3:1 and the lead and buttons
 * 4.5:1 over the brightest frame of the example video, fading clear at the top. With a `visual` the copy sits at
 * the top, so the scrim covers evenly.
 */
const scrimClasses = {
  bottom:
    "pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-[color-mix(in_srgb,var(--color-background-body)_90%,transparent)] via-[color-mix(in_srgb,var(--color-background-body)_74%,transparent)] via-50% to-transparent to-95%",
  even: "pointer-events-none absolute inset-0 -z-10 bg-[color-mix(in_srgb,var(--color-background-body)_80%,transparent)]",
} as const;

/**
 * The copy column. Phones and tablets are always left-aligned: a centred headline runs 3–4 lines there (Headings
 * H8). From lg the copy takes 8 columns, enough for a 12-word display-1 headline in 2 lines: start = 1–8, center = 3–10,
 * end = 5–12.
 * On a plain page the copy carries the top spacing (Band `lg`).
 */
const plainTop = "pt-[calc(var(--grid-baseline)*8)] md:pt-[calc(var(--leading-base)*4)]";
const copyClasses = {
  plain: {
    start: cn("relative col-span-full flex min-w-0 flex-col items-start text-left lg:col-span-8", plainTop),
    center: cn("relative col-span-full flex min-w-0 flex-col items-start text-left lg:items-center lg:text-center", plainTop),
    end: cn("relative col-span-full flex min-w-0 flex-col items-start text-left lg:col-span-8", plainTop),
  },
  backdrop: {
    start: "col-span-full flex min-w-0 flex-col items-start text-left text-fg lg:col-start-1 lg:col-span-8",
    center: "col-span-full flex min-w-0 flex-col items-start text-left text-fg lg:col-start-3 lg:col-end-11 lg:items-center lg:text-center",
    end: "col-span-full flex min-w-0 flex-col items-start text-left text-fg lg:col-start-5 lg:col-end-13 lg:items-end lg:text-right",
  },
} as const;
/** WMDS type-display-1 (fluid 40px → 80px): about 58 characters take 2 lines across 8 columns. Long words break (D5). */
const headlineClasses = "type-display-1 min-w-0 max-w-[min(16em,100%)] text-balance [overflow-wrap:anywhere]";
/** Headline → lead 24, regular weight, in ink (Lead L8, Body B9), measure 42rem at most. */
const leadClasses = "mt-6 max-w-[42rem] text-pretty text-fg type-lead";
/** Lead → actions 32; primary first (Buttons U8). Centred or end-aligned with the copy from lg. */
const actionsClasses = {
  start: "mt-8 flex flex-wrap items-center justify-start gap-3",
  center: "mt-8 flex flex-wrap items-center justify-start gap-3 lg:justify-center",
  end: "mt-8 flex flex-wrap items-center justify-start gap-3 lg:justify-end",
} as const;

/** The visual spans columns 2–11 at lg. CTAs → visual 64 (plus the grid's row gap). */
const visualWrapClasses = "relative col-span-full mt-16 lg:col-start-2 lg:col-end-12";
/**
 * The backlight. `--hero-glow` sets its colour (a pattern knob); default, a light tint of `--color-brand-outline`.
 * A wide radial gradient with eased stops just inside the frame's top, and a halo the shape of the frame.
 */
const glowColorClasses = "[--hero-glow-c:var(--hero-glow,color-mix(in_srgb,var(--color-brand-outline)_18%,transparent))]";
const glowClasses = cn(
  "pointer-events-none absolute inset-x-[-20%] -top-60 h-[36rem]",
  "bg-[radial-gradient(in_oklab_closest-side,var(--hero-glow-c),color-mix(in_srgb,var(--hero-glow-c)_72%,transparent)_18%,color-mix(in_srgb,var(--hero-glow-c)_44%,transparent)_38%,color-mix(in_srgb,var(--hero-glow-c)_20%,transparent)_58%,color-mix(in_srgb,var(--hero-glow-c)_6%,transparent)_80%,transparent)]",
);
const haloClasses =
  "pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-[var(--radius-surface)] shadow-[0_-16px_72px_4px_var(--hero-glow-c)]";
/** The window fades out over its last 30%, like a cropped app screen. */
const frameClasses =
  "relative overflow-hidden rounded-[var(--radius-surface)] border border-border bg-surface [mask-image:linear-gradient(to_bottom,black_70%,transparent)]";
/** Visual → proof is the grid's row gap; on a plain page the proof row closes with Band `lg` spacing (S8). */
const logosWrapClasses = {
  plain: "relative col-span-full pb-[calc(var(--grid-baseline)*8)] md:pb-[calc(var(--leading-base)*4)]",
  backdrop: "relative col-span-full mt-8",
} as const;
/** A plain page with no proof row still closes with Band `lg` spacing. */
const plainBottom = "col-span-full pb-[calc(var(--grid-baseline)*8)] md:pb-[calc(var(--leading-base)*4)]";
/** `fullHeight` only: a quiet scroll cue, centred at the bottom. */
const cueClasses = "pointer-events-none absolute inset-x-0 bottom-4 flex justify-center text-muted";

/** Decorative looping video: plays only on screen, holds the poster under reduced motion. */
function BackgroundVideo({ src, poster, focus }: { src: string; poster?: string; focus?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => (visible && !motion.matches ? video.play().catch(() => {}) : video.pause());
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      sync();
    });
    observer.observe(video);
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
    };
  }, []);
  return (
    <video
      ref={ref}
      className={mediaClasses}
      style={focus ? { objectPosition: focus } : undefined}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}

export function HeroStage({
  nav,
  eyebrow,
  eyebrowHref,
  headline,
  lead,
  actions,
  backdrop,
  align,
  visual,
  logos,
  fullHeight = false,
  className,
}: HeroStageProps) {
  const headingId = useId();
  const onBackdrop = backdrop != null;
  // `end` needs a backdrop: on a plain page ragged-left copy is hard to read, so it falls back to `start`.
  const requested = align ?? (onBackdrop ? "start" : "center");
  const placed: HeroStageAlign = requested === "end" && !onBackdrop ? "start" : requested;

  const copy = (
    <div className={onBackdrop ? copyClasses.backdrop[placed] : copyClasses.plain[placed]}>
      {eyebrow != null ? (
        // Tight to the headline (12px, Eyebrow E5); a pill only when it links (E10). A linked WMDS Badge already has a 44px-tall tap layer (K6).
        <div className="mb-3" data-slot="eyebrow" data-slot-optional="">
          {eyebrowHref ? (
            <Badge variant="neutral" emphasis="outline" size="md" render={<a href={eyebrowHref} />}>
              <span className="inline-flex items-center gap-1.5">
                {eyebrow}
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden focusable="false">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            </Badge>
          ) : (
            <p className={onBackdrop ? "type-eyebrow text-fg" : "type-eyebrow text-muted"}>{eyebrow}</p>
          )}
        </div>
      ) : null}
      <h1 id={headingId} className={headlineClasses} data-slot="headline">
        {headline}
      </h1>
      {lead != null ? (
        <p className={leadClasses} data-slot="lead" data-slot-optional="">
          {lead}
        </p>
      ) : null}
      {actions != null ? (
        <div className={actionsClasses[placed]} data-slot="actions">
          {actions}
        </div>
      ) : null}
    </div>
  );

  const frameWindow =
    visual != null ? (
      <div className={cn(visualWrapClasses, glowColorClasses)} aria-hidden data-hero-visual="">
        <div className={glowClasses} />
        <div className={haloClasses} />
        <div className={frameClasses} data-slot="visual" data-slot-optional="">
          {visual}
        </div>
      </div>
    ) : null;

  const proof = (where: "plain" | "backdrop") =>
    logos != null ? (
      <div className={logosWrapClasses[where]} data-hero-logos="" data-slot="logos" data-slot-optional="">
        {logos}
      </div>
    ) : null;

  return (
    <div className={cn(rootClasses, className)} data-pattern="hero-stage" data-align={placed} data-backdrop={backdrop?.kind ?? "none"}>
      {nav != null ? <div data-slot="nav" data-slot-optional="">{nav}</div> : null}
      {onBackdrop ? (
        <section aria-labelledby={headingId} className={fullHeight ? backdropSectionClasses.full : backdropSectionClasses.content} data-theme="dark">
          {backdrop.kind === "video" ? (
            <BackgroundVideo src={backdrop.src} poster={backdrop.poster} focus={backdrop.focus} />
          ) : (
            <div
              aria-hidden
              className={cn(mediaClasses, "[&>*]:size-full [&>*]:object-cover [&>*]:[object-position:var(--focus,50%_50%)]")}
              style={backdrop.focus ? ({ "--focus": backdrop.focus } as CSSProperties) : undefined}
              data-slot="media"
            >
              {backdrop.media}
            </div>
          )}
          <div className={visual != null ? scrimClasses.even : scrimClasses.bottom} />
          {/* With a window the copy sits at the top of the picture and the window below it; without, the copy sits at the bottom. */}
          <div className={visual != null ? backdropGridClasses.top : backdropGridClasses.bottom}>
            {copy}
            {frameWindow}
            {proof("backdrop")}
          </div>
          {fullHeight ? (
            <div className={cueClasses} aria-hidden data-slot="scroll-cue">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          ) : null}
        </section>
      ) : (
        <section aria-labelledby={headingId} className={plainSectionClasses}>
          {copy}
          {frameWindow}
          {logos != null ? proof("plain") : <div className={plainBottom} aria-hidden />}
        </section>
      )}
    </div>
  );
}

export interface HeroStageLogo {
  /** The client's name: the logo's accessible name. */
  name: string;
  /** A monochrome mark drawn in `currentColor` (an `<svg>`), shown muted. */
  logo: ReactNode;
}

/**
 * The default content for the `logos` slot: one muted row of client marks, equal cells, 3 per row on phones and
 * 6 from lg; a short row centres. Never a sideways scroller (put a marquee in the slot instead).
 */
export function HeroStageLogos({ logos, label = "Clients" }: { logos: HeroStageLogo[]; label?: string }) {
  return (
    <ul className="flex flex-wrap justify-center" aria-label={label}>
      {logos.map((item) => (
        <li
          key={item.name}
          className="flex min-w-0 basis-1/3 items-center justify-center px-1 py-6 text-muted lg:basis-1/6 [&_svg]:h-6 [&_svg]:w-auto [&_svg]:max-w-none lg:[&_svg]:h-8"
        >
          {/* The company name is the text alternative (Logo strip O4); the mark is decoration. */}
          <span aria-hidden className="contents">
            {item.logo}
          </span>
          <span className="sr-only">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}
