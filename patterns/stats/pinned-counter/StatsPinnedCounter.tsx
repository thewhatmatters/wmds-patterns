/**
 * Stats — Pinned Counter: a few key figures shown one at a time while the section is pinned, each a huge number
 * that counts up over a row of WMDS meter ticks that fill to it (after CoMinVi's pinned stats dial). Scrolling
 * moves to the next figure; a mono counter and the figure's category sit at the screen's sides (above the meter
 * on phones).
 *
 * Motion (motion.dev, `motion/react`, the WMDS peer): scroll position picks the figure and fills the meter
 * (useScroll); the number counts to its value over 0.8s, easing out (animate on a motion value). Under prefers-reduced-motion the number and the meter
 * jump straight to each figure. Every figure is also in a plain list for screen readers, so nothing depends on
 * scrolling to be read.
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
  /** Where a full meter sits: 100 for a percentage, the goal for a count. Default 100. */
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

/** The pinned screen: heading at the top, the figure in the middle, the meter under it, side labels at mid-height. */
const pinClasses = "sticky top-0 col-span-full grid h-svh grid-rows-[auto_1fr_auto] py-[calc(var(--leading-base)*2)]";
const headingClasses = "type-eyebrow text-muted";
const figureClasses = "flex flex-col items-center justify-center text-center";
const numberClasses = "type-display-hero tabular-nums leading-none text-fg";
const labelClasses = "mt-4 type-heading-3 text-fg";
/** Phones: a row just above the meter. From md: at mid-height, either side of the figure. */
const sideRowClasses =
  "pointer-events-none absolute inset-x-0 bottom-36 flex justify-between md:top-1/2 md:bottom-auto md:-translate-y-1/2";
const sideClasses = "font-mono text-xs uppercase tracking-[0.08em] text-muted";
/** WMDS meter ticks, 64px tall, across the content width. */
const meterHeight = 64;

function format(value: number, stat: StatsPinnedCounterStat) {
  return `${stat.prefix ?? ""}${value.toFixed(stat.decimals ?? 0)}${stat.suffix ?? ""}`;
}

export function StatsPinnedCounter({ heading, stats, tone = "default", className }: StatsPinnedCounterProps) {
  const headingId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const count = stats.length;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  // Which figure, and how far into its stretch of scroll: the meter fills over the first 40% of each stretch.
  const [index, setIndex] = useState(0);
  const [fill, setFill] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const position = Math.min(count - 0.0001, Math.max(0, progress * count));
    setIndex(Math.floor(position));
    setFill(Math.min(1, (position % 1) / 0.4));
  });

  const stat = stats[index];
  const target = stat.value;
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
  const meterValue = reduce ? target : target * fill;

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
            <div className={figureClasses} aria-hidden="true" data-slot="figure">
              <motion.p className={numberClasses}>{shown}</motion.p>
              <p className={labelClasses}>{stat.label}</p>
            </div>
            <div aria-hidden="true" data-slot="meter">
              <Chart.Frame segmentHeight={meterHeight}>
                <Chart.SegmentedBar value={meterValue} max={max} tone="primary" segments={72} />
              </Chart.Frame>
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
