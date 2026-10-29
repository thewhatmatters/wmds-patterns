/**
 * Hero — Over Media (wmds-patterns, draft). Copy this file into your app and edit it freely.
 * The atmosphere hero (Hero R7: food, places, a room people come to): a full-width photo or looping video,
 * with the copy set left-aligned at its bottom left on the page grid, over a scrim that keeps every letter
 * readable (Display D8, Hero R5). Built only from WMDS parts.
 * Your Tailwind must scan this file (it does if it sits in your app's source folders).
 */
import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { Badge, cn } from "@thewhatmatters/wmds";

export interface HeroOverMediaProps {
  /** Slot, optional: a nav above the hero. Leave it empty when the page already has a nav (the usual case). */
  nav?: ReactNode;
  /** Optional: a short line above the headline (sentence case; the capitals come from `type-eyebrow`). */
  eyebrow?: ReactNode;
  /** Where the eyebrow links. With it, the eyebrow is one outlined pill link (Eyebrow E10); never filled. */
  eyebrowHref?: string;
  /** The page's only H1: 12 words at most, 2 lines from 600px, 3 on phones (Display D6, D7). */
  headline: ReactNode;
  /** Optional: the lead, 1–2 sentences (Lead L7). */
  lead?: ReactNode;
  /** Slot: the one primary action, a WMDS `<Button role="primary" size="lg">` (Hero R2, Buttons U7). */
  primaryAction: ReactNode;
  /** Slot, optional: a secondary action, a WMDS `<Button role="outline" size="lg">`: on the picture its border is the light ink, 3:1 or more (U4). */
  secondaryAction?: ReactNode;
  /** Slot: the picture, a decorative `<img alt="">` with its width and height. Ignored when `video` is set. */
  media?: ReactNode;
  /** A decorative looping video instead of `media`: muted, no controls, its `poster` under reduced motion. */
  video?: { src: string; poster?: string };
  /** The part of the picture to keep in view as it crops (CSS `object-position`, e.g. `"50% 30%"`). Default: centre. */
  focus?: string;
  /**
   * The full screen height, less 64px so the next section's edge shows (Hero R9, R4), with a scroll cue at the
   * bottom. Off by default: the hero is its content plus Band `lg` spacing, over a picture at least 28rem tall.
   */
  fullHeight?: boolean;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. `data-slot` marks where your
   content goes; it does nothing on a page (the gallery outlines slots with it). */

/**
 * The picture's height: at least 28rem on phones, 36rem from md, 40rem from lg (enough of the room to read),
 * or the screen less 64px with `fullHeight` (never the bare screen height).
 */
const rootClasses = {
  content: "relative isolate flex w-full flex-col overflow-hidden min-h-[28rem] md:min-h-[36rem] lg:min-h-[40rem]",
  full: "relative isolate flex w-full flex-col overflow-hidden min-h-[calc(100svh-4rem)]",
} as const;
const mediaClasses = "absolute inset-0 -z-10 size-full object-cover";
/**
 * Bottom-up scrim in the dark page colour: solid enough behind the copy that the headline clears 3:1 and the
 * lead and buttons 4.5:1 over the brightest frame (measured on every half second of the example video), fading to
 * clear at the top so the picture shows.
 */
const scrimClasses =
  "pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-[color-mix(in_srgb,var(--color-background-body)_90%,transparent)] via-[color-mix(in_srgb,var(--color-background-body)_74%,transparent)] via-50% to-transparent to-95%";
/** The copy sits at the bottom of the picture, on the page grid, with Band `lg` spacing (96, 64 on phones; S8). */
const gridClasses = "grid-page mt-auto w-full !pt-[calc(var(--grid-baseline)*8)] !pb-[calc(var(--grid-baseline)*8)] md:!pt-[calc(var(--leading-base)*4)] md:!pb-[calc(var(--leading-base)*4)]";
/** Columns 1–7 from lg, left-aligned at every width (Headings H8). */
const copyClasses = "col-span-full flex min-w-0 flex-col items-start text-left text-fg lg:col-start-1 lg:col-span-7";
/**
 * WMDS `type-display-2`: a 12-word headline holds 2 lines from 600px in the half-width column, 2–3 on phones
 * (Display D7). `type-display-hero` (230px at 1440) is a wordmark step; it breaks this headline into 8 lines.
 * A long word breaks instead of running off a phone (D5).
 */
const headlineClasses = "type-display-2 min-w-0 max-w-full text-balance [overflow-wrap:anywhere]";
/** Headline → lead 24, in ink on the scrim (Lead L8), measure 42rem at most. */
const leadClasses = "mt-6 max-w-[42rem] text-pretty text-fg type-lead";
/** Lead → actions 32; primary first (Buttons U8). */
const actionsClasses = "mt-8 flex flex-wrap items-center gap-3";
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

export function HeroOverMedia({
  nav,
  eyebrow,
  eyebrowHref,
  headline,
  lead,
  primaryAction,
  secondaryAction,
  media,
  video,
  focus,
  fullHeight = false,
  className,
}: HeroOverMediaProps) {
  const headingId = useId();

  return (
    <div className={className} data-pattern="hero-over-media">
      {nav != null ? <div data-slot="nav" data-slot-optional="">{nav}</div> : null}
      {/* Dark-theme scope: the WMDS tokens (text, muted, Button, focus ring) take their dark values on the picture. */}
      <section aria-labelledby={headingId} className={fullHeight ? rootClasses.full : rootClasses.content} data-theme="dark">
        {video ? (
          <BackgroundVideo src={video.src} poster={video.poster} focus={focus} />
        ) : media != null ? (
          <div
            aria-hidden
            className={cn(mediaClasses, "[&>*]:size-full [&>*]:object-cover [&>*]:[object-position:var(--focus,50%_50%)]")}
            style={focus ? ({ "--focus": focus } as CSSProperties) : undefined}
            data-slot="media"
          >
            {media}
          </div>
        ) : null}
        <div className={scrimClasses} />
        <div className={gridClasses}>
          <div className={copyClasses}>
            {eyebrow != null ? (
              // Tight to the headline (12px, Eyebrow E5). A linked WMDS Badge already has a 44px-tall tap layer (K6).
              <div className="mb-3" data-slot="eyebrow" data-slot-optional="">
                {eyebrowHref ? (
                  <Badge variant="neutral" emphasis="outline" size="md" render={<a href={eyebrowHref} />}>
                    {eyebrow}
                  </Badge>
                ) : (
                  <p className="type-eyebrow text-fg">{eyebrow}</p>
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
            <div className={actionsClasses} data-slot="actions">
              {primaryAction}
              {secondaryAction}
            </div>
          </div>
        </div>
        {fullHeight ? (
          <div className={cueClasses} aria-hidden data-slot="scroll-cue">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        ) : null}
      </section>
    </div>
  );
}
