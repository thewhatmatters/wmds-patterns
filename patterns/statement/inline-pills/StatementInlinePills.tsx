/**
 * Statement — Inline Pills: one big centred sentence whose key words sit in soft pills, each with a small
 * picture on its left (after Graphical's hero sentence). Use it as a hero (`as="h1"`) or as an intro or
 * statement section further down a page (the default, `h2`).
 *
 * Motion (opt-in, `animate`): when the sentence scrolls into view, each pill's picture pops in, one after
 * another, with a small tilt and overshoot. It runs once, uses the Web Animations API with WMDS motion
 * tokens (no library), animates only transform and opacity, and is skipped under reduced motion.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@thewhatmatters/wmds";

export interface StatementInlinePillsProps {
  /** Slot, optional: a short eyebrow above the sentence, e.g. a WMDS `<Badge>`. */
  eyebrow?: ReactNode;
  /** Slot: the sentence, with its key words wrapped in `<InlinePill media={…}>word</InlinePill>`. */
  children: ReactNode;
  /** Slot, optional: the CTA row under the sentence (WMDS `<Button>`s). */
  actions?: ReactNode;
  /** The sentence's heading level: `h1` when this is the page's hero, `h2` (default) further down. */
  as?: "h1" | "h2";
  /** Pop the pills' pictures in when the sentence scrolls into view. Off by default. */
  animate?: boolean;
  className?: string;
}

export interface InlinePillProps {
  /** The picture on the pill's left: a small icon, 3D render or photo (`<img alt="">` or an `aria-hidden` SVG). */
  media: ReactNode;
  /** The word or words in the pill. They stay part of the sentence for screen readers. */
  children: ReactNode;
}

/** Full width; content on the WMDS page grid; section padding 48 / 64 top and bottom. */
const rootClasses = "group/statement relative w-full";
const gridClasses = "grid-page !pt-12 !pb-12 md:!pt-16 md:!pb-16";
const innerClasses = "col-span-full flex flex-col items-center text-center";
/** WMDS display type, kept to about 18em so the sentence sets in 2–3 lines with room for the pills. */
/** Long words break rather than scroll the page sideways; a looser line gap on phones keeps stacked pills apart. */
const sentenceClasses =
  "min-w-0 max-w-[18em] text-balance type-display-2 font-normal leading-[1.4] tracking-tight text-fg [overflow-wrap:anywhere] md:leading-[1.35]";
const actionsClasses = "mt-10 flex flex-wrap items-center justify-center gap-3";
/**
 * The pill: an inline run (not inline-flex), so it sits on the sentence's baseline and punctuation right
 * after it never wraps away. Fill is the text colour at 4% (8% in dark, where 4% disappears). Sized in em,
 * so it scales with the sentence. The picture sits in the left padding, out of the text flow, so it can
 * never be left at the end of a line without its word; `box-decoration-break: clone` keeps the shape if
 * a pill wraps.
 */
const pillClasses =
  "relative rounded-full bg-[color-mix(in_srgb,var(--color-fg)_4%,transparent)] py-0 pl-[1.3em] pr-[0.32em] " +
  "[[data-theme=dark]_&]:bg-[color-mix(in_srgb,var(--color-fg)_8%,transparent)] " +
  "[box-decoration-break:clone] [-webkit-box-decoration-break:clone]";
/**
 * The picture: 1em square, a touch proud of the pill, on its first line (an inline box that wraps spans two lines, so 50% would float between them). Hidden before the
 * pop-in runs (so it doesn't flash, then animate), never in print; on hover it tilts a little, where
 * motion is allowed.
 */
const mediaClasses =
  "absolute top-[0.14em] left-[0.15em] size-[1em] [&>img]:size-full [&>img]:object-contain [&>svg]:block [&>svg]:size-full " +
  "group-data-[pills=pending]/statement:scale-0 group-data-[pills=pending]/statement:opacity-0 print:!scale-100 print:!opacity-100 " +
  "motion-safe:transition-transform motion-safe:duration-[var(--duration-fast)] motion-safe:ease-[var(--ease-standard)] " +
  "motion-safe:group-hover/pill:-rotate-8 motion-safe:group-hover/pill:scale-105";

export function InlinePill({ media, children }: InlinePillProps) {
  return (
    <span className={cn(pillClasses, "group/pill")} data-pill="">
      <span aria-hidden className={mediaClasses} data-pill-media="">
        {media}
      </span>
      {children}
    </span>
  );
}

/** Reads a WMDS motion token in ms (e.g. `--duration-medium`), with a fallback before styles load. */
function token(name: string, fallback: number) {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

/** "pending" hides the pictures until the sentence is in view; "done" leaves them at rest. */
type PillsState = "still" | "pending" | "done";

function usePillsPopIn(animate: boolean) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<PillsState>("still");

  // Hide before the first paint, so the pictures never flash in and then animate.
  useLayoutEffect(() => {
    if (animate && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) setState("pending");
  }, [animate]);

  useEffect(() => {
    const root = ref.current;
    if (state !== "pending" || !root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = token("--duration-medium-max", 550);
        // One beat apart, but the whole run stays under about half a second however many pills there are.
        const count = root.querySelectorAll("[data-pill-media]").length;
        const stagger = Math.min(token("--motion-beat", 160), 480 / Math.max(1, count - 1));
        const easing = getComputedStyle(document.documentElement).getPropertyValue("--ease-standard").trim() || "cubic-bezier(0.24, 1, 0.4, 1)";
        const media = [...root.querySelectorAll<HTMLElement>("[data-pill-media]")];
        // fill: "backwards" holds each picture hidden through its delay, after the pending state lifts.
        media.forEach((element, i) =>
          element.animate(
            [
              { transform: "scale(0) rotate(-24deg)", opacity: 0 },
              { transform: "scale(1.14) rotate(6deg)", opacity: 1, offset: 0.6 },
              { transform: "scale(1) rotate(0deg)", opacity: 1 },
            ],
            { duration, delay: 120 + i * stagger, easing, fill: "backwards" },
          ),
        );
        setState("done");
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [state]);

  return { ref, state };
}

export function StatementInlinePills({ eyebrow, children, actions, as: Heading = "h2", animate = false, className }: StatementInlinePillsProps) {
  const { ref, state } = usePillsPopIn(animate);
  return (
    <section ref={ref} className={cn(rootClasses, className)} data-pattern="statement-inline-pills" data-pills={state}>
      <div className={gridClasses}>
        <div className={innerClasses}>
          {eyebrow != null ? (
            <div className="mb-6" data-slot="eyebrow" data-slot-optional="">
              {eyebrow}
            </div>
          ) : null}
          <Heading className={sentenceClasses} data-slot="sentence">
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
