/**
 * Hero — Phone Center (wmds-patterns, draft). Copy this file into your app and edit it freely.
 * A centred hero for an app: eyebrow, headline, subhead and a CTA row, then a wide photo or video that
 * fades out at its edges, with an iPhone frame over its centre. The media shows through the phone's
 * glass screen; an optional caption sits on the screen. Built only from @thewhatmatters/wmds parts.
 * Your Tailwind must scan this file (it does if it sits in your app's source folders).
 */
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Badge, Button, cn } from "@thewhatmatters/wmds";

export interface HeroPhoneCenterProps {
  /** Slot, optional: a nav above the hero. Leave it empty when the page already has a nav (the usual case). */
  nav?: ReactNode;
  /** A short line above the headline, shown as a pill. */
  eyebrow?: ReactNode;
  /** The page's only H1. Static: animate it in your page if you want. */
  headline: ReactNode;
  subhead?: ReactNode;
  /** Slot, optional: the CTA row (buttons, links, app-store badges). */
  actions?: ReactNode;
  /**
   * Slot: the picture behind the phone, usually a decorative `<img alt="">`; it's cropped to fill the
   * stage. For a video use `video` instead, which adds the pause control moving media needs.
   */
  media?: ReactNode;
  /** A looping background video (muted, no sound) with a Pause control. Used instead of `media`. */
  video?: { src: string; poster?: string };
  /**
   * Slot, optional: a short caption on the phone's screen over the media (about 40 characters, 3 lines
   * at most). It sits on a scrim so it stays readable over any picture. If it changes, wrap it in
   * `aria-live="polite"`.
   */
  screen?: ReactNode;
  /**
   * Slot, optional: a full app screen on the phone, edge to edge under the glass: a screenshot, a
   * recording (`<video>` 9:19.5, e.g. 1206 × 2622) or live UI. It's cropped to the screen's shape. A
   * recording that plays on its own for over 5 seconds needs a pause control in your page.
   */
  app?: ReactNode;
  /**
   * A progressive blur along the top of the viewport: content scrolling up under it blurs and fades
   * out, like Lovi's. Static CSS (no script, no animation). Use it once per page; skip it if the page's
   * own sticky nav already covers the top edge.
   */
  edgeBlur?: boolean;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

/** Full-width wrapper, so nothing scrolls sideways. */
const rootClasses = "relative w-full overflow-x-clip";
/** The section lays its content on the WMDS page grid. */
const sectionClasses = "grid-page relative !py-0";
/** Centred copy. Nav→eyebrow 48 / 96. */
const copyClasses = "relative z-10 col-span-full flex flex-col items-center pt-12 text-center lg:pt-24";
/**
 * A narrow H1, like the phone it sits over: WMDS type-display-2 (fluid 32px → 50px), kept to about 11em
 * so a short headline sets in 2–3 lines, set tight (-0.035em, line height 1.05) like a display line.
 * `hyphens-auto` needs the page's `lang`.
 */
const headlineClasses =
  "type-display-2 [--text-display-2-leading:1.05] tracking-[-0.035em] min-w-0 max-w-[min(11em,100%)] text-balance [overflow-wrap:anywhere] hyphens-auto";
/** One short line (about 40 characters). Regular weight (type-large is semibold in some WMDS versions). Headline→subhead 24. */
const subheadClasses = "mt-6 max-w-[36rem] text-pretty font-normal text-muted type-large";
/** Subhead→CTAs 32. On phones the buttons stack full width (up to 20rem); from sm they sit in a row. */
const actionsClasses =
  "mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center";

/**
 * The stage: the media spans most of the page width and fades out on every side (a mask, so it melts
 * into the page in light and dark). The whole stage fades out at its foot, so the phone sinks into the
 * page like a fold instead of being cut.
 * The stage's mask also bounds the wide media to the stage. CTAs→stage 40 / 64 (phone / desktop).
 */
const stageClasses =
  "relative col-span-full mt-10 h-[clamp(26rem,52vw,40rem)] overflow-hidden [mask-image:linear-gradient(to_bottom,black_72%,transparent)] lg:mt-16";
const mediaClasses =
  "absolute inset-y-0 left-1/2 w-[min(100vw,72rem)] -translate-x-1/2 " +
  "[mask-image:radial-gradient(closest-side,black_45%,transparent)] " +
  "[&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover [&>svg]:size-full";
/** The phone: centred, a little below the stage top, about 300px wide at desktop. */
const phoneClasses = "absolute top-6 left-1/2 w-[clamp(15rem,24vw,20rem)] -translate-x-1/2 lg:top-14";
/**
 * The screen area inside the frame (matches the SVG's screen rect: 14/390 in, radius 55/362 × 55/816, a thin bezel like a real iPhone).
 * A scrim in the page's surface colour fades down from the top, so the caption stays readable over any
 * picture in either theme.
 */
const screenClasses =
  "absolute inset-x-[3.59%] top-[1.66%] bottom-[1.66%] flex flex-col items-center overflow-hidden rounded-[15.2%/6.74%] " +
  "px-[10%] pt-[22%] text-center text-fg " +
  "before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-surface)_88%,transparent),transparent)]";
const screenTextClasses = "relative line-clamp-3 type-large font-normal";
/**
 * The `app` slot: the screen rect, edge to edge, under the glass (the frame SVG sits above it). A
 * see-through recording (alpha video) shows the media behind the phone through a frosted tint of the
 * page's surface colour, so the app stays the focus: `--hero-screen-tint` sets its strength (default
 * 45%; 0% for clear glass).
 */
const appClasses =
  "absolute inset-x-[3.59%] top-[1.66%] bottom-[1.66%] overflow-hidden rounded-[15.2%/6.74%] " +
  "bg-[color-mix(in_srgb,var(--color-surface)_var(--hero-screen-tint,45%),transparent)] backdrop-blur-[3px] " +
  "[&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover";
/** The Pause / Play control for `video`: a 44px icon button at the stage's right edge, clear of the phone and above the fade. */
const videoControlClasses = "absolute right-0 bottom-[32%] z-20";

/**
 * An iPhone outline: a thin (14 of 390) rounded bezel in the page's surface colour, a glass screen that lets the
 * media through with a faint sheen, the Dynamic Island, and the side buttons. Drawn at 390 × 844.
 */
function PhoneFrame({ id, empty }: { id: string; empty: boolean }) {
  const sheen = `${id}-sheen`;
  return (
    // Above the screen content (z-10), so the bezel, glass and Dynamic Island sit over the caption's scrim.
    <svg viewBox="0 0 390 844" className="pointer-events-none relative z-10 block h-auto w-full overflow-visible" aria-hidden focusable="false">
      <defs>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="white" stopOpacity="0.04" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Side buttons */}
      <rect x="-3" y="180" width="4" height="34" rx="2" fill="var(--color-border-emphasized)" />
      <rect x="-3" y="236" width="4" height="62" rx="2" fill="var(--color-border-emphasized)" />
      <rect x="-3" y="312" width="4" height="62" rx="2" fill="var(--color-border-emphasized)" />
      <rect x="389" y="260" width="4" height="96" rx="2" fill="var(--color-border-emphasized)" />
      {/* Bezel: the body with the screen cut out */}
      <path
        fillRule="evenodd"
        fill="color-mix(in srgb, var(--color-surface) 82%, transparent)"
        stroke="var(--color-border-emphasized)"
        strokeWidth="1.5"
        d="M64 1h262a63 63 0 0 1 63 63v716a63 63 0 0 1-63 63H64A63 63 0 0 1 1 780V64A63 63 0 0 1 64 1Z
           M69 14h252a55 55 0 0 1 55 55v706a55 55 0 0 1-55 55H69a55 55 0 0 1-55-55V69a55 55 0 0 1 55-55Z"
      />
      {/* With no media behind it, the glass is filled so it still reads as a screen */}
      {empty ? (
        <rect x="14" y="14" width="362" height="816" rx="55" fill="color-mix(in srgb, var(--color-surface) 92%, var(--color-text-primary))" />
      ) : null}
      {/* Glass: a faint sheen over the media */}
      <rect x="14" y="14" width="362" height="816" rx="55" fill={`url(#${sheen})`} />
      <rect x="14" y="14" width="362" height="816" rx="55" fill="none" stroke="black" strokeOpacity="0.18" />
      {/* Dynamic Island (screen recordings leave a gap for it in the status bar) */}
      <rect x="143" y="30" width="104" height="31" rx="15.5" fill="#0b0b0c" />
    </svg>
  );
}

/**
 * A muted, looping background video with a Pause / Play control (WCAG 2.2.2). It doesn't start on its own
 * when the visitor prefers reduced motion; the control still lets them play it.
 */
function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().then(() => setPlaying(true), () => setPlaying(false));
  }, [src]);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setPlaying(true), () => setPlaying(false));
    else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <div className={mediaClasses} data-hero-media="">
        <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-hidden />
      </div>
      <div className={videoControlClasses}>
        <Button
          role="secondary"
          size="sm"
          className="!size-11 !p-0"
          onClick={toggle}
          aria-label={playing ? "Pause background video" : "Play background video"}
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden focusable="false">
            {playing ? (
              <path fill="currentColor" d="M4 3h3v10H4zM9 3h3v10H9z" />
            ) : (
              <path fill="currentColor" d="M5 3l8 5-8 5z" />
            )}
          </svg>
        </Button>
      </div>
    </>
  );
}

/**
 * The top-edge blur: four fixed layers, each blurring a little more than the last and masked to a lower
 * band, so the blur ramps up toward the very top; a light fade to the page colour finishes it. 48px
 * deep, the hero's own top space, so nothing is blurred until it scrolls.
 */
function EdgeBlur() {
  const layer = "absolute inset-0";
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-12" aria-hidden data-hero-edge-blur="">
      <div className={cn(layer, "backdrop-blur-[1px] [mask-image:linear-gradient(to_top,transparent,black_40%)]")} />
      <div className={cn(layer, "backdrop-blur-[2px] [mask-image:linear-gradient(to_top,transparent_25%,black_60%)]")} />
      <div className={cn(layer, "backdrop-blur-[4px] [mask-image:linear-gradient(to_top,transparent_50%,black_80%)]")} />
      <div className={cn(layer, "backdrop-blur-[8px] [mask-image:linear-gradient(to_top,transparent_70%,black)]")} />
      <div className={cn(layer, "bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-surface)_70%,transparent),transparent)]")} />
    </div>
  );
}

export function HeroPhoneCenter({ nav, eyebrow, headline, subhead, actions, media, video, screen, app, edgeBlur = false, className }: HeroPhoneCenterProps) {
  const headingId = useId();
  const frameId = useId().replace(/:/g, "");

  return (
    <div className={cn(rootClasses, className)} data-pattern="hero-phone-center">
      {edgeBlur ? <EdgeBlur /> : null}
      {nav}
      <section aria-labelledby={headingId} className={sectionClasses}>
        <div className={copyClasses}>
          {eyebrow != null ? (
            // Keep it to about 30 characters; a longer line is cut with an ellipsis rather than spill.
            <div className="mb-6 flex max-w-full justify-center">
              <Badge variant="neutral">
                <span className="block max-w-[min(30ch,80vw)] truncate">{eyebrow}</span>
              </Badge>
            </div>
          ) : null}
          <h1 id={headingId} className={headlineClasses}>
            {headline}
          </h1>
          {subhead != null ? <p className={subheadClasses}>{subhead}</p> : null}
          {actions != null ? <div className={actionsClasses}>{actions}</div> : null}
        </div>

        <div className={stageClasses} data-hero-stage="">
          {video != null ? (
            <HeroVideo src={video.src} poster={video.poster} />
          ) : media != null ? (
            <div className={mediaClasses} data-hero-media="">
              {media}
            </div>
          ) : null}
          <div className={phoneClasses}>
            {app != null ? (
              <div className={appClasses} data-hero-app="">
                {app}
              </div>
            ) : null}
            <PhoneFrame id={frameId} empty={video == null && media == null && app == null} />
            {screen != null ? (
              <div className={screenClasses} data-hero-screen="">
                <div className={screenTextClasses}>{screen}</div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
