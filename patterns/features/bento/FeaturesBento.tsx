/**
 * Features — Bento: a layout for a features section, as an offset grid of cells (after Hebbia's "knowledge at
 * work" section). The layout is the pattern: a heading, then WMDS Cards that take turns wide and narrow
 * (8 + 4, then 4 + 8 on desktop), sit side by side in pairs on tablets and stack on phones. Each cell holds a
 * title, one line of description and a `visual` slot.
 *
 * What goes in a cell's `visual` follows the site's direction, not this file: a still screen built from WMDS
 * components, a photograph, a picture that wakes while the pointer is over its cell, or a small working demo.
 * A visual is a picture by default (hidden from assistive tech, out of the tab order; the words carry the
 * meaning). Mark an item `interactive` when its visual is something the reader can use: it then keeps its
 * controls, its focus order and its full height.
 *
 * Layout knobs: `media` puts the visual under the words (it runs off the cell's bottom edge) or above them (a
 * framed picture with the words beneath), an item's `span` overrides the wide / narrow turn-taking, and `fill`
 * turns the cells quiet so the surface panels in their visuals stand out.
 *
 * Motion (motion.dev, `motion/react`, the WMDS peer): each visual settles up into its cell once, as the cell
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
  /** Whatever shows the feature: a screen, a photograph, a moving picture, a working demo. A picture fills the cell's box and is cut at its edges. */
  visual: ReactNode;
  /**
   * The visual is something the reader can use (controls, links), not a picture. It keeps its semantics and its
   * place in the tab order, sets the box's height itself and is never faded or cut at the bottom. Label its controls.
   */
  interactive?: boolean;
  /** The cell's width from tablets up. Left out, cells take turns: wide, narrow, narrow, wide, and an odd last cell is full. */
  span?: "wide" | "narrow" | "full";
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
  /** Where a cell's visual sits: under the words, running off the cell's bottom edge, or above them with a rule between. */
  media?: "below" | "above";
  /**
   * The cells' fill. `surface` (default): the layout card, raised off the page. `muted`: WMDS's quiet card (the
   * muted background, a hairline edge, no shadow), so a surface panel in a cell's visual is the brightest thing in it.
   */
  fill?: "surface" | "muted";
  /** The band's WMDS tone. */
  tone?: BandTone;
  className?: string;
}

// Every class is written out in full (never interpolated) so Tailwind sees it.
const HEADER = "col-span-full lg:col-span-6";
const INTRO = "col-span-full mt-4 max-w-[40em] text-pretty type-lead text-fg lg:col-span-6 lg:mt-0 lg:self-end";
// Every cell is two rows of this grid (its words and its visual), so the cells of a row line up part by part.
// The rows of cells sit one grid gutter apart, the same gap as the columns: each cell carries that gap as its
// top padding, and the list gives the first row's back.
const CELLS =
  "col-span-full mt-[calc(2.5rem_-_var(--grid-gutter))] grid grid-cols-subgrid gap-y-0 md:mt-[calc(4rem_-_var(--grid-gutter))]";
const CELL = "row-span-2 grid grid-rows-subgrid pt-[var(--grid-gutter)]";
const CELL_WIDE = "col-span-full md:col-span-4 lg:col-span-8";
const CELL_NARROW = "col-span-full md:col-span-4 lg:col-span-4";
const CELL_FULL = "col-span-full";
// The Card passes the two rows on to its words and its visual. `padding="bare"` (WMDS 0.4.54) gives the layout
// card's surface with no section room, so its parts meet its edges.
const CARD = "group/cell row-span-2 !grid grid-rows-subgrid";
// The visual's box grows with its cell and never drops under these heights.
const VISUAL = "relative min-h-64 overflow-hidden md:min-h-72 lg:min-h-80";
// Under the words, a picture's last 3rem fade out, so whatever runs off the cell's bottom edge leaves softly instead of being cut mid-row.
const VISUAL_FADE = "[mask-image:linear-gradient(to_bottom,black_calc(100%_-_3rem),transparent)]";
// Above the words, a rule closes the picture's frame.
const VISUAL_ABOVE = "order-first border-b border-border";
const SPANS = { wide: CELL_WIDE, narrow: CELL_NARROW, full: CELL_FULL };

/** How far a picture rises into place, in px. */
const RISE = 32;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Wide, narrow, narrow, wide: each row is the mirror of the one above. */
function span(index: number, count: number, set?: FeaturesBentoItem["span"]) {
  if (set) return SPANS[set];
  if (count % 2 === 1 && index === count - 1) return CELL_FULL;
  return index % 4 === 0 || index % 4 === 3 ? CELL_WIDE : CELL_NARROW;
}

/**
 * Settles its children up into place the first time they come on screen. The server and the first client render
 * are the finished state, so nothing is out of place without JavaScript or with reduced motion.
 */
function Rise({ delay, fill, children }: { delay: number; fill: boolean; children: ReactNode }) {
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
    <motion.div ref={ref} className={fill ? "absolute inset-0" : "relative h-full"} style={{ y }}>
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

export function FeaturesBento({
  eyebrow,
  heading,
  intro,
  items,
  media = "below",
  fill = "surface",
  tone = "default",
  className,
}: FeaturesBentoProps) {
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
            <li key={item.title} className={cn(CELL, span(index, items.length, item.span))}>
              <Card as="article" variant={fill} padding="bare" className={CARD} data-slot="cell">
                <div className="p-6 md:p-8">
                  <h3 className="text-balance type-heading-3 text-fg">{item.title}</h3>
                  <p className="mt-2 max-w-[30em] text-pretty font-normal text-muted type-large">{item.description}</p>
                </div>
                {item.interactive ? (
                  <div className={cn(VISUAL, media === "above" && VISUAL_ABOVE)} data-slot="visual" data-interactive="">
                    <Rise delay={(index % 2) * 0.08} fill={false}>
                      {item.visual}
                    </Rise>
                  </div>
                ) : (
                  // A picture of the feature, not a control: out of the tab order and hidden from assistive tech.
                  <div
                    className={cn(VISUAL, media === "above" ? VISUAL_ABOVE : VISUAL_FADE)}
                    data-slot="visual"
                    aria-hidden="true"
                    inert
                  >
                    <Rise delay={(index % 2) * 0.08} fill>
                      {item.visual}
                    </Rise>
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </Band>
    </div>
  );
}
