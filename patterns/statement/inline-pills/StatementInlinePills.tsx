/**
 * Statement — Inline Pills: one big centred sentence whose key words sit in WMDS `InlinePill`s, each with a
 * small picture on its left (after Graphical's hero sentence). Use it as a hero (`as="h1"`) or as an intro or
 * statement section further down a page (the default, `h2`).
 *
 * Motion (opt-in, `animate`): WMDS `useInlinePillsPopIn` pops each pill's picture in, one after another,
 * when the sentence scrolls into view. Once, transform and opacity only, nothing under reduced motion.
 */
import type { ReactNode } from "react";
import { cn, useInlinePillsPopIn } from "@thewhatmatters/wmds";

export { InlinePill } from "@thewhatmatters/wmds";

export interface StatementInlinePillsProps {
  /** Slot, optional: a 1–3 word eyebrow above the sentence, in sentence case (the capitals come from `type-eyebrow`). Plain text. */
  eyebrow?: ReactNode;
  /** Slot: the sentence, with its key words wrapped in WMDS `<InlinePill media={…}>word</InlinePill>`. */
  children: ReactNode;
  /** Slot, optional: the CTA row under the sentence (WMDS `<Button>`s). */
  actions?: ReactNode;
  /** The sentence's heading level: `h1` when this is the page's hero, `h2` (default) further down. */
  as?: "h1" | "h2";
  /** Pop the pills' pictures in when the sentence scrolls into view. Off by default. */
  animate?: boolean;
  className?: string;
}

/** Full width; content on the WMDS page grid; section padding 48 / 64 top and bottom. */
const gridClasses = "grid-page !pt-12 !pb-12 md:!pt-16 md:!pb-16";
const innerClasses = "col-span-full flex flex-col items-center text-center";
/** Long words break rather than scroll the page sideways; a looser line gap on phones keeps stacked pills apart. */
const sentenceClasses =
  "min-w-0 max-w-[18em] text-balance type-display-2 font-normal leading-[1.4] tracking-tight text-fg [overflow-wrap:anywhere] md:leading-[1.35]";
const actionsClasses = "mt-10 flex flex-wrap items-center justify-center gap-3";

export function StatementInlinePills({ eyebrow, children, actions, as: Heading = "h2", animate = false, className }: StatementInlinePillsProps) {
  const popIn = useInlinePillsPopIn<HTMLHeadingElement>(animate);
  return (
    <section className={cn("relative w-full", className)} data-pattern="statement-inline-pills">
      <div className={gridClasses}>
        <div className={innerClasses}>
          {eyebrow != null ? (
            // A plain eyebrow, tight to the sentence (Eyebrow rules E5, E10).
            <p className="mb-3 type-eyebrow text-muted" data-slot="eyebrow" data-slot-optional="">
              {eyebrow}
            </p>
          ) : null}
          <Heading {...popIn} className={sentenceClasses} data-slot="sentence">
            {children}
          </Heading>
          {actions != null ? (
            <div className={actionsClasses} data-slot="actions" data-slot-optional="">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
