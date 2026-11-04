/**
 * Logos — Marquee: a quiet proof strip. A short label ("Trusted by") on the left and the clients' marks drifting
 * slowly right to left beside it, fading out at both edges (after Interfere's "Trusted and funded by" strip).
 *
 * The row is WMDS `Carousel` with `autoplay` and `loop`: it holds under a pointer, on focus, off screen and in a
 * hidden tab, never moves under reduced motion, and has a Pause button (Logo strip O5, WCAG 2.2.2). Each mark
 * carries the company's name as text for screen readers (Logo strip O4).
 */
import { useId, type ReactNode } from "react";
import { Band, Carousel, cn, type BandTone } from "@thewhatmatters/wmds";

export interface LogosMarqueeLogo {
  /** The company's name: the text alternative, read instead of the mark. */
  name: string;
  /** A monochrome mark drawn in `currentColor` (an `<svg>`), shown muted. */
  logo: ReactNode;
}

export interface LogosMarqueeProps {
  /** The short label beside the marks, e.g. "Trusted by" or "Clients". */
  label: ReactNode;
  /** 8–16 marks: enough to fill the row at least once, so the loop never shows a gap. */
  logos: LogosMarqueeLogo[];
  /** Drift speed in px a second. Default 32: slow enough to read a mark as it passes. */
  speed?: number;
  /** The WMDS Band tone. Default `default`. */
  tone?: BandTone;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

/** Label on the first columns, the row on the rest: 2 + 6 of 8 on tablet, 3 + 9 of 12 on desktop; stacked on phones. */
const labelClasses = "col-span-full text-muted type-eyebrow md:col-span-2 md:self-center lg:col-span-3";
const rowClasses = "col-span-full mt-4 min-w-0 md:col-span-6 md:col-start-3 md:mt-0 lg:col-span-9 lg:col-start-4";
/** One mark per cell, centred, muted; marks are 24px tall on phones and 32 from md. */
const cellClasses =
  "flex h-16 items-center justify-center px-4 text-muted [&_svg]:h-6 [&_svg]:w-auto [&_svg]:max-w-none md:[&_svg]:h-8";

export function LogosMarquee({ label, logos, speed = 32, tone = "default", className }: LogosMarqueeProps) {
  const labelId = useId();

  return (
    <div className={cn("relative w-full", className)} data-pattern="logos-marquee">
      {/* WMDS Band: full width, the page grid inside, Band `md` spacing (48 top and bottom; Spacing S8). */}
      <Band tone={tone} aria-labelledby={labelId}>
        <h2 id={labelId} className={labelClasses} data-slot="label">
          {label}
        </h2>
        <div className={rowClasses} data-slot="logos">
          <Carousel aria-labelledby={labelId} autoplay={{ speed }} loop fade itemWidth={{ base: 34, md: 25, lg: 17 }} snap={false}>
            {logos.map((item) => (
              <Carousel.Item key={item.name}>
                <div className={cellClasses}>
                  {/* The company name is the text alternative (Logo strip O4); the mark is decoration. */}
                  <span aria-hidden className="contents">
                    {item.logo}
                  </span>
                  <span className="sr-only">{item.name}</span>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </Band>
    </div>
  );
}
