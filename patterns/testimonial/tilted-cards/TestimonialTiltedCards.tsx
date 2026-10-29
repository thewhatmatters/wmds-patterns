/**
 * Testimonial — Tilted Cards: client quotes as cards set at small, alternating angles in a WMDS `Carousel`
 * row the visitor drags or scrolls (after Griflan's "Client Confessions"), on a WMDS `Band`, the inverse
 * field by default. A heading row on top; each card holds the quote, an optional result line, and who said it.
 *
 * Nothing animates by default: the tilt is a still transform, and the row moves only when the visitor moves it.
 */
import { useId, type ReactNode } from "react";
import { Avatar, Band, Carousel, cn, type BandTone } from "@thewhatmatters/wmds";

export interface TestimonialTiltedCardsQuote {
  /** The quote, without quotation marks: about 20–45 words. Cut longer ones; the card doesn't scroll. */
  quote: ReactNode;
  /** Who said it. */
  name: string;
  /** Their role and company: "Owner, Eastside Bakery". */
  role?: ReactNode;
  /** Optional: a photo of them (WMDS `Avatar` shows their initials when it's left out). */
  avatarSrc?: string;
  /** Optional: one measurable result above the quote, short: "Bookings up 40%". */
  result?: ReactNode;
}

export interface TestimonialTiltedCardsProps {
  /** Optional: a short label above the heading, e.g. "Clients". */
  eyebrow?: ReactNode;
  /** The section's heading, one short line. */
  heading: ReactNode;
  /** Slot, optional: one CTA at the heading row's end, e.g. a WMDS outline `<Button>` to case studies. */
  actions?: ReactNode;
  /** The quotes, 4–8 of them, so the row has somewhere to go. */
  quotes: TestimonialTiltedCardsQuote[];
  /** The section's WMDS Band tone: `inverse` (default, the brand's dark surface), `field` or `default`. */
  tone?: BandTone;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

/** Heading row on the page grid: heading on the left, the CTA at the row's end from md. */
const headerClasses = "col-span-full flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between";
const headingClasses = "text-balance type-heading-1 text-fg";
/** The row runs to the page edges (Carousel `bleed`); with the cards' 16px clearance it sits 40px under the heading row on phones, 64 from md. */
const rowClasses = "col-span-full mt-4 md:mt-8";
/**
 * Small alternating angles, so the row reads as a hand of cards laid on the table. Four steps, repeating,
 * none past 2.5°, so quotes stay easy to read. Written out in full for Tailwind.
 */
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-[2.5deg]"] as const;
/** 16px around each card, so its tilted corners clear the row's clip at the top and bottom. */
const itemInnerClasses = "h-full py-4";
const cardBaseClasses = "flex h-full flex-col gap-6 rounded-lg border p-6 text-fg md:p-8";
/**
 * Two kinds of card, alternating, so the row has a rhythm (Griflan alternates two colours; see WMDS-GAP in the
 * README): a raised card on the tone's surface, and an open card that is only an outline on the field.
 */
const cardKinds = ["border-border bg-surface shadow-raised", "border-border-emphasized bg-transparent"] as const;
/** The card's top line: the result on the left, a quiet quotation mark in the corner (decorative; the blockquote carries the meaning). */
const topClasses = "flex min-h-6 items-start justify-between gap-4";
const markClasses = "ml-auto type-heading-1 leading-none text-muted";
const resultClasses = "type-eyebrow text-muted";
const quoteClasses = "type-large text-pretty text-fg";
const captionClasses = "mt-auto flex items-center gap-3 border-t border-border pt-6";

export function TestimonialTiltedCards({ eyebrow, heading, actions, quotes, tone = "inverse", className }: TestimonialTiltedCardsProps) {
  const headingId = useId();

  return (
    <div className={cn("relative w-full overflow-x-clip", className)} data-pattern="testimonial-tilted-cards">
      {/* WMDS Band: full width, the page grid inside, Band `md` spacing (48 top and bottom; Spacing S8). */}
      <Band tone={tone} aria-labelledby={headingId}>
        <div className={headerClasses}>
          <div>
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
            <div className="shrink-0" data-slot="actions" data-slot-optional="">
              {actions}
            </div>
          ) : null}
        </div>

        <div className={rowClasses} data-slot="quotes">
          <Carousel aria-labelledby={headingId} bleed itemWidth={{ base: 85, md: 50, lg: 34 }} progress="center">
            {quotes.map((item, index) => (
              <Carousel.Item key={index}>
                <div className={itemInnerClasses}>
                  <figure className={cn(cardBaseClasses, cardKinds[index % cardKinds.length], tilts[index % tilts.length])}>
                    <div className={topClasses}>
                      {item.result != null ? <p className={resultClasses}>{item.result}</p> : null}
                      <span className={markClasses} aria-hidden="true">
                        &rdquo;
                      </span>
                    </div>
                    <blockquote className={quoteClasses}>
                      <p>{item.quote}</p>
                    </blockquote>
                    <figcaption className={captionClasses}>
                      <Avatar name={item.name} src={item.avatarSrc} size="md" />
                      <span className="flex min-w-0 flex-col">
                        <span className="font-medium text-fg">{item.name}</span>
                        {item.role != null ? <span className="text-muted">{item.role}</span> : null}
                      </span>
                    </figcaption>
                  </figure>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </Band>
    </div>
  );
}
