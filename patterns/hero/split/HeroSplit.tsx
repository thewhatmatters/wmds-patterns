/**
 * Hero — Split (wmds-patterns, draft). Copy this file into your app and edit it freely.
 * The default hero for services (Hero R7): left-aligned copy (eyebrow, headline, lead, one primary action
 * and an optional secondary) beside the real thing (R8), the client's work in a frame, a product screen or
 * the homepage sketch. Stacked on phones and tablets, side by side from lg. Built only from WMDS parts.
 * Your Tailwind must scan this file (it does if it sits in your app's source folders).
 */
import { useId, type ReactNode } from "react";
import { Badge, Band, cn, type BandTone } from "@thewhatmatters/wmds";

export interface HeroSplitProps {
  /** Slot, optional: a nav above the hero. Leave it empty when the page already has a nav (the usual case). */
  nav?: ReactNode;
  /** Optional: a short line above the headline (sentence case; the capitals come from `type-eyebrow`). */
  eyebrow?: ReactNode;
  /** Where the eyebrow links. With it, the eyebrow is one outlined pill link (Eyebrow E10); never filled. */
  eyebrowHref?: string;
  /** The page's only H1: 12 words at most, 2 lines from 600px, 3 on phones (Display D6, D7). */
  headline: ReactNode;
  /** Optional: the lead, 1–2 sentences in ink (Lead L7, L8). */
  lead?: ReactNode;
  /** Slot: the one primary action, a WMDS `<Button role="primary" size="lg">` (Hero R2, Buttons U7). */
  primaryAction: ReactNode;
  /** Slot, optional: a secondary action after it, a WMDS `<Button role="outline" size="lg">` (U8). */
  secondaryAction?: ReactNode;
  /**
   * Slot, optional: the real thing (R8): the client's work in a browser or phone frame, a product screen,
   * the homepage sketch. At least 4:3 on phones and tablets (it grows, never crops); beside the copy from lg.
   * Leave it out rather than fill it with stock: a short headline then reads better as a centred hero.
   */
  visual?: ReactNode;
  /** From lg, the visual runs past the content edge to the viewport's right edge (Grid G9). Its inner edge stays on column 7. */
  visualBleed?: boolean;
  /** The WMDS Band tone: `default` (the page), `inverse` (brand surface) or `field`. */
  tone?: BandTone;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. `data-slot` marks where your
   content goes; it does nothing on a page (the gallery outlines slots with it). */

/** Full width; the bleed's overflow is clipped here, never on a narrower element. */
const rootClasses = "relative w-full overflow-x-clip";
/**
 * With a visual: full width on phones and tablets (8 columns), columns 1–6 from lg, centred against the
 * visual. Without one: columns 1–8 from lg, still left-aligned (Headings H8).
 */
const copyClasses = {
  split: "col-span-full flex min-w-0 flex-col items-start text-left lg:col-start-1 lg:col-span-6 lg:row-start-1 lg:self-center",
  solo: "col-span-full flex min-w-0 flex-col items-start text-left lg:col-start-1 lg:col-span-8",
} as const;
/**
 * WMDS `type-display-2`: a 12-word headline holds 2 lines from 600px in the half-width column, 2–3 on phones
 * (Display D7). `type-display-hero` (230px at 1440) is a wordmark step; it breaks this headline into 8 lines.
 * A long word breaks instead of running off a phone (D5).
 */
const headlineClasses = "type-display-2 min-w-0 max-w-full text-balance [overflow-wrap:anywhere]";
/** Headline → lead 24; a lead in ink, measure 42rem at most (Lead L4, L8). */
const leadClasses = "mt-6 max-w-[42rem] text-pretty text-fg type-lead";
/**
 * Lead → actions 32; primary first (Buttons U8). On phones the pair doesn't fit one row beside a half-width
 * column's worth of copy, so it stacks full width, primary on top; a row from md.
 */
const actionsClasses = "mt-8 flex flex-col items-stretch gap-3 self-stretch md:flex-row md:flex-wrap md:items-center md:self-start";
/**
 * Actions → visual 48 on phones and tablets (the grid's 24px row gap plus 24). From lg, columns 7–12 on the
 * copy's row.
 */
const visualCellClasses = "col-span-full mt-6 min-w-0 lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:mt-0";
/**
 * From lg, the bleed pulls the cell's right edge out by the space between the content edge and the viewport:
 * half of what the viewport has over the grid's max width, plus the page margin.
 */
const visualBleedClasses = "lg:mr-[calc((min(100vw,var(--grid-max))-100vw)*0.5-var(--grid-margin))]";
/**
 * At least 1:1 on phones, so the fold cuts it mid-frame at 390×844 (the scroll cue, Hero R4); at least 4:3 on
 * tablets. No clip: a taller picture grows the frame instead of being cropped. From lg, the picture's own shape.
 */
const visualFrameClasses = "flex aspect-square w-full items-stretch [&>*]:w-full md:aspect-[4/3] lg:aspect-auto";

export function HeroSplit({
  nav,
  eyebrow,
  eyebrowHref,
  headline,
  lead,
  primaryAction,
  secondaryAction,
  visual,
  visualBleed = false,
  tone = "default",
  className,
}: HeroSplitProps) {
  const headingId = useId();
  const split = visual != null;

  return (
    <div className={cn(rootClasses, className)} data-pattern="hero-split">
      {nav != null ? <div data-slot="nav" data-slot-optional="">{nav}</div> : null}
      {/* WMDS Band: full width, the page grid inside, Band `lg` spacing (96, 64 on phones; Spacing S8, Hero R9). */}
      <Band tone={tone} spacing="lg" aria-labelledby={headingId}>
        <div className={split ? copyClasses.split : copyClasses.solo}>
          {eyebrow != null ? (
            // Tight to the headline (12px, Eyebrow E5). A linked WMDS Badge already has a 44px-tall tap layer (K6).
            <div className="mb-3" data-slot="eyebrow" data-slot-optional="">
              {eyebrowHref ? (
                <Badge variant="neutral" emphasis="outline" size="md" render={<a href={eyebrowHref} />}>
                  {eyebrow}
                </Badge>
              ) : (
                <p className="type-eyebrow text-muted">{eyebrow}</p>
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
        {split ? (
          <div className={cn(visualCellClasses, visualBleed && visualBleedClasses)} data-slot="visual" data-slot-optional="" data-bleed={visualBleed ? "" : undefined}>
            <div className={visualFrameClasses}>{visual}</div>
          </div>
        ) : null}
      </Band>
    </div>
  );
}
