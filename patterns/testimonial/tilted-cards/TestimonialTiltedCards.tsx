/**
 * Testimonial — Tilted Cards: client quotes as cards laid down at uneven angles and heights, alternating two
 * colours, in a WMDS `Carousel` row that drifts on its own and that the visitor can drag (after Griflan's
 * "Client Confessions"). On a WMDS `Band`, the inverse field by default. A centred heading on top; each card
 * holds the quote, centred between two quotation marks, and a small byline. No photos.
 *
 * Motion: the row repeats seamlessly (WMDS Carousel `loop`) and drifts slowly one way (`autoplay`). It holds on
 * hover and focus, has a Pause button, and doesn't move under reduced motion. A drag stays where it's let go (no
 * snap), and the cards lean the way the row moves (`--carousel-velocity`), then ease upright. A hand badge follows a mouse over the row (Carousel `cursor`).
 */
import { useId, type ReactNode } from "react";
import { Band, Card, Carousel, cn, type BandTone, type CardTone } from "@thewhatmatters/wmds";

export interface TestimonialTiltedCardsQuote {
  /** The quote, without quotation marks: about 20–45 words. Cut longer ones; the card doesn't scroll. */
  quote: ReactNode;
  /** Who said it. */
  name: string;
  /** Their role and company: "Owner, Eastside Bakery". */
  role?: ReactNode;
}

export interface TestimonialTiltedCardsProps {
  /** Optional: a short label above the heading, e.g. "Clients". */
  eyebrow?: ReactNode;
  /** The section's heading, one short line. */
  heading: ReactNode;
  /** Slot, optional: one CTA under the heading, e.g. a WMDS outline `<Button>` to case studies. */
  actions?: ReactNode;
  /** The quotes, an even number from 4 to 8, so the two card colours keep alternating where the loop joins. */
  quotes: TestimonialTiltedCardsQuote[];
  /** The section's WMDS Band tone: `inverse` (default, the brand's dark surface), `field` or `default`. */
  tone?: BandTone;
  /** The two card colours the row alternates (WMDS Card `tone`). Default: `field`, then `light` (paper). */
  cardTones?: [CardTone, CardTone];
  /** Drift on its own (WMDS Carousel `autoplay`). Default `true`; it never moves under reduced motion. */
  autoplay?: boolean;
  /** Slot, optional: what the badge that follows a mouse over the row shows. Default: a hand. `null` hides it. */
  cursor?: ReactNode;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

/** Centred heading block on the page grid; the CTA under it. */
const headerClasses = "col-span-full flex flex-col items-center gap-6 text-center";
const headingClasses = "text-balance type-display-2 text-fg";
/** The row runs to the page edges (Carousel `bleed`), 40px under the heading on phones, 64 from md. */
const rowClasses = "col-span-full mt-4 md:mt-8";
/**
 * Uneven angles and heights, so the row reads as cards dropped on a table. Six steps, repeating, none past
 * 4°, so quotes stay easy to read. Written out in full for Tailwind.
 */
const lays = [
  "-rotate-3 translate-y-3",
  "rotate-2 -translate-y-2",
  "-rotate-1 translate-y-6",
  "rotate-[3.5deg] translate-y-0",
  "-rotate-2 -translate-y-3",
  "rotate-1 translate-y-4",
] as const;
/** Room above and below for the tilt and lift; the card runs 12px past its slot each side, so neighbours overlap a little. */
const itemInnerClasses = "h-full -mx-3 py-8";
/**
 * The lean: while the row moves, each card tips toward the way it's going (WMDS Carousel's
 * `--carousel-velocity`, -1 to 1, smoothed by a Motion spring in WMDS), up to 8°, and eases back upright
 * when it stops. 0 under reduced motion.
 */
const leanClasses = "h-full rotate-[calc(var(--carousel-velocity,0)*8deg)]";
/** The card: WMDS Card with its own tone; quote and byline centred between the two marks. */
const cardClasses = "relative h-full min-h-64 items-center justify-center px-8 py-12 text-center md:px-10";
/** Quotation marks in two corners, top right and bottom left: decorative (the blockquote carries the meaning). */
const markTopClasses = "pointer-events-none absolute right-5 top-4 type-heading-1 font-bold leading-none text-fg";
const markBottomClasses = "pointer-events-none absolute bottom-0 left-5 type-heading-1 font-bold leading-none text-fg";
/** The quote: centred, in the card's ink. */
const quoteClasses = "type-large text-balance text-fg";
/** The byline: smaller than the quote, the name in bold over the role. */
const bylineClasses = "mt-6 flex flex-col items-center gap-0";
/** Name and role set tight together, as one byline (line height 1.25). */
const nameClasses = "type-supporting font-semibold leading-tight text-fg";
const roleClasses = "type-supporting leading-tight text-muted";

/** A hand, pointing the way the row moves: the default follow badge. */
const handCursor = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12" />
    <path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0V12" />
    <path d="M14 10.5a1.5 1.5 0 0 1 3 0V12" />
    <path d="M17 11.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2c-2.8 0-4.5-.9-5.9-2.3L3 16.6a1.6 1.6 0 0 1 2.3-2.2L8 17" />
  </svg>
);

export function TestimonialTiltedCards({
  eyebrow,
  heading,
  actions,
  quotes,
  tone = "inverse",
  cardTones = ["field", "light"],
  autoplay = true,
  cursor = handCursor,
  className,
}: TestimonialTiltedCardsProps) {
  const headingId = useId();

  return (
    <div className={cn("relative w-full overflow-x-clip", className)} data-pattern="testimonial-tilted-cards">
      {/* WMDS Band: full width, the page grid inside, Band `md` spacing (48 top and bottom; Spacing S8). */}
      <Band tone={tone} aria-labelledby={headingId}>
        <div className={headerClasses}>
          <div className="flex flex-col items-center">
            {eyebrow != null ? (
              // Tight to the heading (12px, Eyebrow E5).
              <p className="mb-3 type-eyebrow text-muted" data-slot="eyebrow" data-slot-optional="">
                {eyebrow}
              </p>
            ) : null}
            <h2 id={headingId} className={headingClasses} data-slot="heading">
              {heading}
            </h2>
          </div>
          {actions != null ? (
            <div data-slot="actions" data-slot-optional="">
              {actions}
            </div>
          ) : null}
        </div>

        <div className={rowClasses} data-slot="quotes">
          <Carousel
            aria-labelledby={headingId}
            bleed
            itemWidth={{ base: 85, md: 46, lg: 30 }}
            loop
            snap={false}
            autoplay={autoplay}
            cursor={cursor ?? undefined}
          >
            {quotes.map((item, index) => (
              <Carousel.Item key={index}>
                <div className={itemInnerClasses}>
                  <div className={leanClasses}>
                  <Card
                    as="article"
                    tone={cardTones[index % 2]}
                    padding="lg"
                    className={cn(cardClasses, lays[index % lays.length])}
                  >
                    <span className={markTopClasses} aria-hidden="true">
                      &rdquo;
                    </span>
                    <figure>
                      <blockquote className={quoteClasses}>
                        <p>{item.quote}</p>
                      </blockquote>
                      <figcaption className={bylineClasses}>
                        <span className={nameClasses}>{item.name}</span>
                        {item.role != null ? <span className={roleClasses}>{item.role}</span> : null}
                      </figcaption>
                    </figure>
                    <span className={markBottomClasses} aria-hidden="true">
                      &rdquo;
                    </span>
                  </Card>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </Band>
    </div>
  );
}
