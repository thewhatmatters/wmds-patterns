/**
 * Hero — Phone Center (wmds-patterns, draft). Copy this file into your app and edit it freely.
 * A centred hero for an app: eyebrow, headline, subhead and a CTA row, then a wide photo or video that
 * fades out at its edges, with an iPhone frame over its centre. The media shows through the phone's
 * glass screen; an optional caption sits on the screen. Built only from @thewhatmatters/wmds parts.
 * Your Tailwind must scan this file (it does if it sits in your app's source folders).
 */
import { useId, type ReactNode } from "react";
import { Badge, cn } from "@thewhatmatters/wmds";

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
   * Slot: the photo or video behind the phone. Pass an `<img>` or a muted, looping `<video>` (with a
   * `poster`); it's cropped to fill the stage. Decorative unless you give it a text alternative.
   */
  media?: ReactNode;
  /** Slot, optional: what sits on the phone's screen, over the media (a caption, a status, an app UI). */
  screen?: ReactNode;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

/** Full-width wrapper; the stage's wide media is clipped here, never on a narrower element. */
const rootClasses = "relative w-full overflow-x-clip";
/** The section lays its content on the WMDS page grid. */
const sectionClasses = "grid-page relative !py-0";
/** Centred copy. Nav→eyebrow 48 / 96. */
const copyClasses = "relative z-10 col-span-full flex flex-col items-center pt-12 text-center lg:pt-24";
/** WMDS type-display-1 (fluid 40px → 80px), kept to about 12em so a short headline sets in 2–3 lines. */
const headlineClasses = "type-display-1 min-w-0 max-w-[min(12em,100%)] text-balance [overflow-wrap:anywhere] hyphens-auto";
/** Regular weight (type-large is semibold in some WMDS versions). Headline→subhead 24. */
const subheadClasses = "mt-6 max-w-[36rem] text-pretty font-normal text-muted type-large";
/** Subhead→CTAs 32. */
const actionsClasses = "mt-8 flex flex-wrap items-center justify-center gap-3";

/**
 * The stage: the media spans most of the page width and fades out on every side (a mask, so it melts
 * into the page in light and dark). The whole stage fades out at its foot, so the phone sinks into the
 * page like a fold instead of being cut.
 * CTAs→stage 64. Stage height follows the phone (its width × 19.5/9, less the cropped foot).
 */
const stageClasses =
  "relative col-span-full mt-16 h-[clamp(26rem,52vw,40rem)] overflow-hidden [mask-image:linear-gradient(to_bottom,black_72%,transparent)]";
const mediaClasses =
  "absolute inset-y-0 left-1/2 w-[min(100vw,72rem)] -translate-x-1/2 " +
  "[mask-image:radial-gradient(closest-side,black_45%,transparent)] " +
  "[&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover [&>svg]:size-full";
/** The phone: centred, a little below the stage top, about 300px wide at desktop. */
const phoneClasses = "absolute top-10 left-1/2 w-[clamp(15rem,24vw,20rem)] -translate-x-1/2 lg:top-14";
/** The screen area inside the frame (matches the SVG's screen rect), where the `screen` slot sits. */
const screenClasses =
  "absolute inset-x-[5.4%] top-[2.6%] bottom-[2.6%] flex flex-col items-center overflow-hidden rounded-[13%/6%] " +
  "pt-[22%] text-center text-fg";

/**
 * An iPhone outline: a thin rounded bezel in the page's surface colour, a glass screen that lets the
 * media through with a faint sheen, the Dynamic Island, and the side buttons. Drawn at 390 × 844.
 */
function PhoneFrame() {
  return (
    <svg viewBox="0 0 390 844" className="block h-auto w-full overflow-visible" aria-hidden focusable="false">
      <defs>
        <linearGradient id="hero-phone-sheen" x1="0" y1="0" x2="1" y2="1">
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
           M75 22h240a53 53 0 0 1 53 53v694a53 53 0 0 1-53 53H75a53 53 0 0 1-53-53V75a53 53 0 0 1 53-53Z"
      />
      {/* Glass: a faint sheen over the media */}
      <rect x="22" y="22" width="346" height="800" rx="53" fill="url(#hero-phone-sheen)" />
      <rect x="22" y="22" width="346" height="800" rx="53" fill="none" stroke="black" strokeOpacity="0.18" />
      {/* Dynamic Island */}
      <rect x="143" y="40" width="104" height="31" rx="15.5" fill="#0b0b0c" />
    </svg>
  );
}

export function HeroPhoneCenter({ nav, eyebrow, headline, subhead, actions, media, screen, className }: HeroPhoneCenterProps) {
  const headingId = useId();

  return (
    <div className={cn(rootClasses, className)} data-pattern="hero-phone-center">
      {nav}
      <section aria-labelledby={headingId} className={sectionClasses}>
        <div className={copyClasses}>
          {eyebrow != null ? (
            <div className="mb-6">
              <Badge variant="neutral">{eyebrow}</Badge>
            </div>
          ) : null}
          <h1 id={headingId} className={headlineClasses}>
            {headline}
          </h1>
          {subhead != null ? <p className={subheadClasses}>{subhead}</p> : null}
          {actions != null ? <div className={actionsClasses}>{actions}</div> : null}
        </div>

        <div className={stageClasses} data-hero-stage="">
          {media != null ? (
            <div className={mediaClasses} data-hero-media="">
              {media}
            </div>
          ) : null}
          <div className={phoneClasses}>
            <PhoneFrame />
            {screen != null ? (
              <div className={screenClasses} data-hero-screen="">
                {screen}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
