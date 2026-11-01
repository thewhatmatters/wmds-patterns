/**
 * Steps — Stacked Cards: a "how it works" section where each step is a wide card that sticks as you scroll and
 * the next one slides up over it, leaving a strip of each earlier card ("Step 1", "Step 2") showing above, like
 * a stack of index cards (after Understory's steps). Cards take turns in WMDS Card tones.
 *
 * Motion (motion.dev, `motion/react`, the WMDS peer): as later cards cover a card, it eases back to a slightly
 * smaller scale (useScroll + useTransform, transform only). The stacking itself is CSS `position: sticky`.
 * Phones get a plain list (a tall sticky card would cover the screen); reduced motion keeps the stack but no
 * scaling.
 */
import { useId, useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Band, Card, cn, type BandTone, type CardTone } from "@thewhatmatters/wmds";

export interface StepsStackedCardsStep {
  /** The step's name, a few words: "We talk". */
  title: string;
  /** What happens in it, one or two sentences. */
  description: ReactNode;
  /** Slot: what the step makes or looks like: a picture, a screen, a WMDS composition. */
  visual: ReactNode;
  /** Optional: short meta beside the step number, e.g. "Week 1". */
  meta?: ReactNode;
}

export interface StepsStackedCardsProps {
  /** Optional: a short label above the heading, e.g. "How it works". */
  eyebrow?: ReactNode;
  /** The section's heading, one short line. */
  heading: ReactNode;
  /** Optional: a sentence or two beside the heading. */
  intro?: ReactNode;
  /** The steps, 3–5. */
  steps: StepsStackedCardsStep[];
  /** The WMDS Band tone for the section. Default `default` (the page's own colours). */
  tone?: BandTone;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

/** Heading over the first half of the grid; intro and its column start where the cards' right half starts (Grid rule). */
const headingClasses = "col-span-full text-balance type-heading-1 text-fg lg:col-span-6";
const introClasses = "col-span-full mt-4 text-pretty text-fg type-lead md:mt-6 lg:col-span-5 lg:col-start-7 lg:mt-0 lg:self-end";
const listClasses = "col-span-full mt-10 flex flex-col gap-4 md:mt-16 md:gap-[16svh]";
/** Cards take turns in these WMDS tones. */
const tones: CardTone[] = ["field", "inverse", "light"];
/** From md, each card sticks a strip lower than the one before, so every earlier card's top strip stays in view. */
const itemClasses = "md:sticky";
const stackTop = 96;
const strip = 72;
/** Inside a card: number and meta on top, title and copy at the bottom, the visual on the right from md. */
const cardInnerClasses = "grid gap-6 p-6 md:h-[min(34rem,70svh)] md:grid-cols-2 md:gap-8 md:p-8";
const numberRowClasses = "flex flex-wrap items-baseline gap-x-4 gap-y-1";
const numberClasses = "type-heading-2 text-fg";
const metaClasses = "type-eyebrow text-muted";
const copyClasses = "flex flex-col gap-3 md:mt-auto";
/** Phones: after the copy. From md: the right half, both rows. */
const visualClasses = "flex aspect-[4/3] min-h-0 items-center justify-center overflow-hidden rounded-lg md:col-start-2 md:row-span-2 md:row-start-1 md:aspect-auto";

function Step({ step, index, count, progress }: { step: StepsStackedCardsStep; index: number; count: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  // Each card shrinks a little for every card that lands on it: the first most, the last not at all.
  const end = 1 - (count - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / count, 1], [1, reduce ? 1 : end]);

  return (
    <li className={itemClasses} style={{ top: stackTop + index * strip }} data-slot="step">
      <motion.div style={{ scale }} className="origin-top">
        <Card as="article" tone={tones[index % tones.length]} padding="none">
          <div className={cardInnerClasses}>
            <div className={numberRowClasses}>
              <span className={numberClasses}>Step {index + 1}</span>
              {step.meta != null ? <span className={metaClasses}>{step.meta}</span> : null}
            </div>
            <div className={copyClasses}>
              <h3 className="type-heading-3 text-fg">{step.title}</h3>
              <p className="max-w-[32em] text-pretty text-fg type-large">{step.description}</p>
            </div>
            <div className={visualClasses}>{step.visual}</div>
          </div>
        </Card>
      </motion.div>
    </li>
  );
}

export function StepsStackedCards({ eyebrow, heading, intro, steps, tone = "default", className }: StepsStackedCardsProps) {
  const headingId = useId();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start start", "end end"] });

  return (
    <div className={cn("relative w-full", className)} data-pattern="steps-stacked-cards">
      {/* WMDS Band: full width, the page grid inside, Band `md` spacing (48 top and bottom; Spacing S8). */}
      <Band tone={tone} aria-labelledby={headingId}>
        <div className="col-span-full lg:col-span-6">
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
        {intro != null ? (
          <p className={introClasses} data-slot="intro" data-slot-optional="">
            {intro}
          </p>
        ) : null}
        <ol ref={listRef} className={listClasses} data-slot="steps">
          {steps.map((step, index) => (
            <Step key={index} step={step} index={index} count={steps.length} progress={scrollYProgress} />
          ))}
        </ol>
      </Band>
    </div>
  );
}
