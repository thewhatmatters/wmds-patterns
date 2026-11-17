/**
 * Features — Bento: a features section as an offset grid of cells (after Hebbia's "knowledge at work" section).
 * Each cell is a WMDS Card with a title and one line of description at its top, and below them a picture of the
 * feature at work that runs off the cell's edge. Cells take turns wide and narrow (8 + 4, then 4 + 8 on desktop),
 * sit side by side in pairs on tablets and stack on phones.
 *
 * The picture is the point: fill each cell's `visual` with the product's own output (a table, a list of cards,
 * a chart) built from WMDS components, never a stock illustration. It is a picture, so it is hidden from
 * assistive tech and can't take focus; the title and description carry the meaning.
 *
 * Motion (motion.dev, `motion/react`, the WMDS peer): each picture settles up into its cell once, as the cell
 * comes on screen (transform only). `FeaturesBentoDrift` is an optional row that glides sideways for a few
 * seconds on arrival and again while the pointer is over its cell; it is never moving on its own for more than
 * five seconds, so it needs no pause control. Reduced motion gives a still section.
 */
import { useEffect, useId, useRef, type ReactNode } from "react";
import { animate, motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Band, Card, cn, type BandTone } from "@thewhatmatters/wmds";

export interface FeaturesBentoItem {
  /** The feature's name (an h3). */
  title: string;
  /** One or two lines on what it does for the reader. */
  description: ReactNode;
  /** A picture of the feature at work, built from WMDS components. It fills the box under the text and is cut at its edges. */
  visual: ReactNode;
}

export interface FeaturesBentoProps {
  /** A short label above the heading. */
  eyebrow?: ReactNode;
  /** The section's heading (an h2). */
  heading: ReactNode;
  /** One or two lines beside the heading. */
  intro?: ReactNode;
  /** The cells, in reading order. Two or four read best; an odd last cell takes the full width. */
  items: FeaturesBentoItem[];
  /** The band's WMDS tone. */
  tone?: BandTone;
  className?: string;
}

// Every class is written out in full (never interpolated) so Tailwind sees it.
const HEADER = "col-span-full lg:col-span-6";
const INTRO = "col-span-full mt-4 max-w-[40em] text-pretty type-lead text-fg lg:col-span-6 lg:mt-0 lg:self-end";
// The rows sit one grid gutter apart, the same gap as the columns.
const CELLS = "col-span-full mt-10 grid grid-cols-subgrid gap-y-[var(--grid-gutter)] md:mt-16";
const CELL_WIDE = "col-span-full md:col-span-4 lg:col-span-8";
const CELL_NARROW = "col-span-full md:col-span-4 lg:col-span-4";
const CELL_FULL = "col-span-full";
// The picture's last 3rem fade out, so whatever runs off the cell's bottom edge leaves softly instead of being cut mid-row.
const VISUAL =
  "relative mt-auto h-64 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%_-_3rem),transparent)] md:h-72 lg:h-80";

/** How far a picture rises into place, in px. */
const RISE = 32;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Wide, narrow, narrow, wide: each row is the mirror of the one above. */
function span(index: number, count: number) {
  if (count % 2 === 1 && index === count - 1) return CELL_FULL;
  return index % 4 === 0 || index % 4 === 3 ? CELL_WIDE : CELL_NARROW;
}

/**
 * Settles its children up into place the first time they come on screen. The server and the first client render
 * are the finished state, so nothing is out of place without JavaScript or with reduced motion.
 */
function Rise({ delay, children }: { delay: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const armed = useRef(false);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const y = useMotionValue(0);

  useEffect(() => {
    if (reduce) return;
    y.set(RISE);
    armed.current = true;
  }, [reduce, y]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    const controls = animate(y, 0, { duration: 0.7, ease: EASE_OUT, delay });
    return () => controls.stop();
  }, [inView, delay, y]);

  return (
    <motion.div ref={ref} className="relative size-full" style={{ y }}>
      {children}
    </motion.div>
  );
}

export interface FeaturesBentoDriftProps {
  /** The row's items (chips, badges). They are drawn twice so the row can loop. */
  children: ReactNode;
  /** Which way the row travels. */
  direction?: "left" | "right";
  /** Seconds for one full loop at full pace. */
  duration?: number;
  className?: string;
}

/**
 * A row for a cell's picture that glides sideways: about four seconds when its cell comes on screen, then again
 * for as long as a mouse pointer is over the cell. Still with reduced motion.
 */
export function FeaturesBentoDrift({ children, direction = "left", duration = 40, className }: FeaturesBentoDriftProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  /** Where the row is, as a share (0–50%) of its doubled width. */
  const travel = useMotionValue(0);
  /** 0 is still, 1 is full pace. */
  const pace = useMotionValue(0);
  const x = useTransform(travel, (value) => (direction === "left" ? `${-value}%` : `${value - 50}%`));

  useAnimationFrame((_, delta) => {
    const now = pace.get();
    if (now === 0) return;
    travel.set((travel.get() + (now * delta * 50) / (duration * 1000)) % 50);
  });

  // On arrival: up to pace, hold, and ease to a stop, all inside five seconds.
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(pace, [0, 1, 1, 0], { duration: 4.5, times: [0, 0.1, 0.65, 1], ease: "easeInOut" });
    return () => controls.stop();
  }, [inView, reduce, pace]);

  // While a mouse is over the cell, the row keeps moving; it eases to a stop when the pointer leaves.
  useEffect(() => {
    const host = ref.current?.closest("[data-slot='cell']");
    if (!host || reduce) return;
    const enter = (event: Event) => {
      if ((event as PointerEvent).pointerType === "mouse") animate(pace, 1, { duration: 0.4, ease: "easeOut" });
    };
    const leave = () => {
      animate(pace, 0, { duration: 0.9, ease: "easeOut" });
    };
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
    };
  }, [reduce, pace]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div className="flex w-max" style={{ x }}>
        <div className="flex shrink-0 gap-2 pr-2">{children}</div>
        <div className="flex shrink-0 gap-2 pr-2" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function FeaturesBento({ eyebrow, heading, intro, items, tone = "default", className }: FeaturesBentoProps) {
  const headingId = useId();

  return (
    <div className={cn("relative w-full", className)} data-pattern="features-bento">
      <Band tone={tone} aria-labelledby={headingId}>
        <div className={HEADER}>
          {eyebrow ? (
            <p className="mb-3 type-eyebrow text-muted" data-slot="eyebrow" data-slot-optional="">
              {eyebrow}
            </p>
          ) : null}
          <h2 id={headingId} className="text-balance type-heading-1 text-fg" data-slot="heading">
            {heading}
          </h2>
        </div>
        {intro ? (
          <p className={INTRO} data-slot="intro" data-slot-optional="">
            {intro}
          </p>
        ) : null}

        <ul className={CELLS} data-slot="cells">
          {items.map((item, index) => (
            <li key={item.title} className={span(index, items.length)}>
              <Card as="article" padding="none" className="h-full" data-slot="cell">
                <div className="p-6 md:p-8">
                  <h3 className="text-balance type-heading-3 text-fg">{item.title}</h3>
                  <p className="mt-2 max-w-[30em] text-pretty font-normal text-muted type-large">{item.description}</p>
                </div>
                {/* A picture of the feature, not a control: out of the tab order and hidden from assistive tech. */}
                <div className={VISUAL} data-slot="visual" aria-hidden="true" inert>
                  <Rise delay={(index % 2) * 0.08}>{item.visual}</Rise>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Band>
    </div>
  );
}
