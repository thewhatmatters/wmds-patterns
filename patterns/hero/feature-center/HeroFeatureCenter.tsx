/**
 * Hero — Feature Center (wmds-patterns, draft). Copy this file into your app and edit it freely.
 * A centred hero: eyebrow, headline, subhead, a CTA row, the product in a framed window lit from behind,
 * and an optional proof strip (client logos). Built only from @thewhatmatters/wmds parts.
 * Your Tailwind must scan this file (it does if it sits in your app's source folders).
 */
import { useId, type ReactNode } from "react";
import { Badge, Button, cn } from "@thewhatmatters/wmds";

export interface HeroFeatureCenterAction {
  label: string;
  href: string;
}

export interface HeroFeatureCenterProps {
  /**
   * Slot, optional: a nav above the hero. Leave it empty when the page already has a nav (the usual case).
   */
  nav?: ReactNode;
  /** Optional: a short line above the headline, 1–3 words in sentence case (capitals come from the style). */
  eyebrow?: ReactNode;
  /**
   * Where the eyebrow links (an offer or announcement). With it, the eyebrow is an outlined pill link with a
   * trailing arrow; without it, a plain `type-eyebrow` label. A pill never appears without a link (Eyebrow E10).
   */
  eyebrowHref?: string;
  /** The page's only H1. Static: animate it in your page if you want (e.g. wrap it in TextSequence). */
  headline: ReactNode;
  subhead?: ReactNode;
  /** Slot, optional: the CTA row (any buttons or links). When set, `primaryAction` / `secondaryAction` are ignored. */
  actions?: ReactNode;
  /** Shorthand for the CTA row: a primary button. */
  primaryAction?: HeroFeatureCenterAction;
  /** Shorthand: a secondary button beside it. */
  secondaryAction?: HeroFeatureCenterAction;
  /** Slot, optional: what goes in the framed window (a product shot, a site, a video). Decorative unless it carries content. */
  visual?: ReactNode;
  /** Slot, optional: proof under the visual. Usually `<HeroFeatureCenterLogos logos={…} />`; a marquee, quote or stats row works too. */
  logos?: ReactNode;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. `data-slot` marks where your
   content goes; it does nothing on a page (the gallery outlines slots with it). */

/** Full-width wrapper: the glow's overflow is clipped here, never on a narrower element. */
const rootClasses = "relative w-full overflow-x-clip";
/** The section lays its content on the WMDS page grid (centred, gutters, columns by breakpoint). */
const sectionClasses = "grid-page relative !py-0";
/** Centred copy across the page grid; the headline needs the width for 2 lines. Section padding 48 / 64 (the logos row closes with the same). */
/** Left-aligned until desktop: the centred headline runs past 2 lines on phones (4) and tablets (3); centred from lg, where it sets in 2 (Headings H8). */
const copyClasses = "relative col-span-full flex flex-col items-start pt-12 text-left md:pt-16 lg:items-center lg:text-center";
/** WMDS type-display-1 as it is (fluid 40px → 80px): about 58 characters take 2 lines at desktop. */
const headlineClasses = "type-display-1 min-w-0 max-w-[min(16em,100%)] text-balance [overflow-wrap:anywhere]";
/** Headline→subhead 24, regular weight (type-large is semibold in some WMDS versions), about 42rem measure. */
/** The subhead summarises the page, so it's a lead in ink, not muted (Lead L8, Body B9); about 2 lines at 390. */
const subheadClasses = "mt-6 max-w-[42rem] text-pretty text-fg type-lead";
/** Subhead→CTAs 32. */
const actionsClasses = "mt-8 flex flex-wrap items-center justify-start gap-3 lg:justify-center";
/** The visual spans columns 2–11 at lg. CTAs→visual 64 (plus the grid's row gap). */
const visualWrapClasses = "relative col-span-full mt-16 lg:col-start-2 lg:col-end-12";

/**
 * The backlight. `--hero-glow` sets its colour (a pattern knob); default, a light tint of
 * `--color-brand-outline` (navy in light, a lighter navy in dark). Two layers, both behind the frame: a
 * wide radial gradient with eased stops, centred just inside the frame's top, and a halo the shape of
 * the frame.
 */
const glowColorClasses = "[--hero-glow-c:var(--hero-glow,color-mix(in_srgb,var(--color-brand-outline)_18%,transparent))]";
const glowGradient =
  "bg-[radial-gradient(in_oklab_closest-side,var(--hero-glow-c),color-mix(in_srgb,var(--hero-glow-c)_72%,transparent)_18%,color-mix(in_srgb,var(--hero-glow-c)_44%,transparent)_38%,color-mix(in_srgb,var(--hero-glow-c)_20%,transparent)_58%,color-mix(in_srgb,var(--hero-glow-c)_6%,transparent)_80%,transparent)]";
const glowClasses = cn("pointer-events-none absolute inset-x-[-20%] -top-60 h-[36rem]", glowGradient);
const haloClasses =
  "pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-[var(--radius-surface)] shadow-[0_-16px_72px_4px_var(--hero-glow-c)]";
/** The window: fades out over its last 30%, like a cropped app screen. */
const frameClasses =
  "relative overflow-hidden rounded-[var(--radius-surface)] border border-border bg-surface [mask-image:linear-gradient(to_bottom,black_70%,transparent)]";
/** Visual→proof is the grid's 24px row gap (the frame's faded foot already reads as space); bottom padding 48 / 64. */
const logosWrapClasses = "relative col-span-full pb-12 md:pb-16";

export function HeroFeatureCenter({
  nav,
  eyebrow,
  eyebrowHref,
  headline,
  subhead,
  actions,
  primaryAction,
  secondaryAction,
  visual,
  logos,
  className,
}: HeroFeatureCenterProps) {
  const headingId = useId();

  return (
    <div className={cn(rootClasses, className)} data-pattern="hero-feature-center">
      {nav != null ? <div data-slot="nav" data-slot-optional="">{nav}</div> : null}
      <section aria-labelledby={headingId} className={sectionClasses}>
        <div className={copyClasses}>
          {eyebrow != null ? (
            // Eyebrow rules: tight to the headline (12px), 1–3 words; a pill only when it links (E5, E10).
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
                <p className="type-eyebrow text-muted">{eyebrow}</p>
              )}
            </div>
          ) : null}
          <h1 id={headingId} className={headlineClasses}>
            {headline}
          </h1>
          {subhead != null ? <p className={subheadClasses}>{subhead}</p> : null}
          <div className={actionsClasses} data-slot="actions" data-slot-optional="">
            {actions ?? (
              <>
                {primaryAction != null ? (
                  <Button role="primary" render={<a href={primaryAction.href} />}>
                    {primaryAction.label}
                  </Button>
                ) : null}
                {secondaryAction != null ? (
                  <Button role="secondary" render={<a href={secondaryAction.href} />}>
                    {secondaryAction.label}
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </div>

        {visual != null ? (
          <div className={cn(visualWrapClasses, glowColorClasses)} aria-hidden data-hero-visual="">
            <div className={glowClasses} />
            <div className={haloClasses} />
            <div className={frameClasses} data-slot="visual" data-slot-optional="">
              {visual}
            </div>
          </div>
        ) : null}

        {logos != null ? (
          <div className={logosWrapClasses} data-hero-logos="" data-slot="logos" data-slot-optional="">
            {logos}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export interface HeroFeatureCenterLogo {
  /** The client's name: the logo's accessible name. */
  name: string;
  /** A monochrome mark drawn in `currentColor` (an `<svg>`), shown muted. */
  logo: ReactNode;
}

/**
 * The default content for the `logos` slot: one muted row of client marks, equal cells, 3 per row on
 * phones and 6 from lg; a short row centres. Never a sideways scroller (use a marquee in the slot instead).
 */
export function HeroFeatureCenterLogos({ logos, label = "Clients" }: { logos: HeroFeatureCenterLogo[]; label?: string }) {
  return (
    <ul className="flex flex-wrap justify-center" aria-label={label}>
      {logos.map((item) => (
        <li
          key={item.name}
          aria-label={item.name}
          className="flex min-w-0 basis-1/3 items-center justify-center px-1 py-5 text-muted lg:basis-1/6 [&_svg]:h-6 [&_svg]:w-auto [&_svg]:max-w-none lg:[&_svg]:h-8"
        >
          <span aria-hidden className="contents">
            {item.logo}
          </span>
        </li>
      ))}
    </ul>
  );
}
