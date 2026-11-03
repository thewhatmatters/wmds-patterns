/**
 * Stats — Pinned Counter: a few key figures shown one at a time while the section is pinned, around one large
 * WMDS dial of ticks (after CoMinVi's pinned stats dial). The dial stays put: scrolling to the next figure sweeps
 * the same dial from the last figure's share to the next (70% → 38% → 98%), and the number in its hole counts
 * from the last figure to the next, so each step reads as the gauge moving, never resetting. A mono counter and
 * the figure's category sit at the screen's sides (under the dial on phones).
 *
 * Motion (motion.dev, `motion/react`, the WMDS peer): scroll position picks the figure (useScroll); the dial is
 * WMDS `Chart.SegmentedRing` with `animate="always"` (a spring from the last value); the number tweens over 0.8s,
 * easing out. Under prefers-reduced-motion both jump straight to each figure. Every figure is also in a plain
 * list for screen readers, so nothing depends on scrolling to be read.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Band, Chart, cn, type BandTone } from "@thewhatmatters/wmds";

export interface StatsPinnedCounterStat {
  /** The figure: 35, 1200, 4.9. */
  value: number;
  /** What it counts, short: "Projects shipped". */
  label: string;
  /** Optional: a word or two at the screen's side, e.g. "Since 2019". */
  category?: string;
  /** Optional: before the number, e.g. "$". */
  prefix?: string;
  /** Optional: after the number, e.g. "%" or "k". */
  suffix?: string;
  /** Decimal places shown. Default 0. */
  decimals?: number;
  /** Where a full dial sits: 100 for a percentage, the goal for a count. Default 100. */
  max?: number;
}

export interface StatsPinnedCounterProps {
  /** The section's heading, short: "By the numbers". Small, at the top of the pinned screen. */
  heading: ReactNode;
  /** The figures, 3–5. */
  stats: StatsPinnedCounterStat[];
  /** The WMDS Band tone. Default `default`. */
  tone?: BandTone;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

/** The pinned screen: heading at the top, the dial filling the middle, side labels at mid-height. */
const pinClasses = "sticky top-0 col-span-full grid h-svh grid-rows-[auto_1fr] py-[calc(var(--leading-base)*2)]";
const headingClasses = "type-eyebrow text-muted";
/** The dial's box: as wide as the content allows, never taller than the screen leaves (it's square). */
const dialClasses = "mx-auto flex w-[min(100%,calc(100svh-12rem))] items-center self-center";
/** The figure's label under the number, inside the hole. */
const labelClasses = "mt-[3cqi] max-w-[60cqi] text-balance type-heading-3 text-fg";
/** Phones: a row under the dial. From md: at mid-height, either side of the dial. */
const sideRowClasses =
  "pointer-events-none absolute inset-x-0 bottom-10 flex justify-between md:top-1/2 md:bottom-auto md:-translate-y-1/2";
const sideClasses = "font-mono text-xs uppercase tracking-[0.08em] text-muted";
/** Ticks round the dial. */
const dialSegments = 72;

function format(value: number, stat: StatsPinnedCounterStat) {
  return `${stat.prefix ?? ""}${value.toFixed(stat.decimals ?? 0)}${stat.suffix ?? ""}`;
}

export function StatsPinnedCounter({ heading, stats, tone = "default", className }: StatsPinnedCounterProps) {
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const count = stats.length;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  // Which figure: one screen of scroll each.
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setIndex(Math.floor(Math.min(count - 0.0001, Math.max(0, progress * count))));
  });

  const stat = stats[index];
  const target = stat.value;
  // The number moves from wherever it is (the last figure) to this one; it never restarts at zero.
  const number = useMotionValue(target);
  useEffect(() => {
    if (reduce) {
      number.jump(target);
      return;
    }
    const controls = animate(number, target, { duration: 0.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [target, reduce, number]);
  const shown = useTransform(number, (value) => format(value, stat));
  const max = stat.max ?? 100;

  return (
    <div className={cn("relative w-full", className)} data-pattern="stats-pinned-counter">
      <Band tone={tone} spacing="none" aria-labelledby={headingId}>
        {/* One screen of scroll per figure. */}
        <div ref={trackRef} className="relative col-span-full grid grid-cols-subgrid" style={{ height: `${count * 100}svh` }}>
          <div className={pinClasses}>
            <h2 id={headingId} className={headingClasses} data-slot="heading">
              {heading}
            </h2>
            {/* The figures for screen readers: all of them, in order, as text. */}
            <dl className="sr-only">
              {stats.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{format(item.value, item)}</dd>
                </div>
              ))}
            </dl>
            {/* One dial for every figure: its value changes, so it sweeps from the last share to this one. */}
            <div className={dialClasses} aria-hidden="true" data-slot="figure">
              <Chart.SegmentedRing
                value={target}
                max={max}
                size="fluid"
                animate={reduce ? "none" : "always"}
                segments={dialSegments}
                tone="primary"
                centerValue={<motion.span>{shown}</motion.span>}
                centerLabel={<span className={labelClasses}>{stat.label}</span>}
              />
            </div>
            <div className={sideRowClasses} aria-hidden="true">
              <span className={sideClasses}>
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <span className={sideClasses}>{stat.category}</span>
            </div>
          </div>
        </div>
      </Band>
    </div>
  );
}
