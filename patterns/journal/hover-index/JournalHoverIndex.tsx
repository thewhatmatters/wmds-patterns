/**
 * Journal — Hover Index: the latest posts as a ruled WMDS `IndexList` under a two-tone heading, with a small cover
 * that follows the pointer while it's over a post (after United Carriers' "What's moving in your industry"). The
 * list is the content; the cover is a reward for a mouse, never needed to read or open a post.
 *
 * Motion (motion.dev, `motion/react`, the WMDS peer): the cover trails the pointer on a spring and fades and scales
 * in and out (transform and opacity). Only on devices with a fine pointer that can hover; never under reduced
 * motion. Screen readers and touch get the list alone.
 */
import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Band, IndexList, cn, type BandTone } from "@thewhatmatters/wmds";

export interface JournalHoverIndexPost {
  /** The post's title. */
  title: string;
  /** Where it lives. */
  href: string;
  /** The meta column, e.g. a `<time>` and a category: "9 Jul · Case study". */
  meta?: ReactNode;
  /** Slot, optional: the cover that follows the pointer, an `<img alt="">` (decorative; 4:3 reads best). */
  cover?: ReactNode;
}

export interface JournalHoverIndexProps {
  /** The heading's first, quiet part: "What's new". Set muted. */
  lead: ReactNode;
  /** The heading's second part, in ink: "in the studio". */
  heading: ReactNode;
  /** Optional: a sentence beside the heading. */
  intro?: ReactNode;
  /** Slot, optional: one action under the intro, e.g. a WMDS outline `<Button>` to the journal. */
  actions?: ReactNode;
  /** The latest posts, 4–8. */
  posts: JournalHoverIndexPost[];
  /** The WMDS Band tone. Default `default`. */
  tone?: BandTone;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

const headingClasses = "col-span-full text-balance type-heading-1 lg:col-span-6";
/** Intro and action start where the second half starts (column 7, Grid rule). */
const asideClasses = "col-span-full mt-4 flex flex-col items-start gap-6 md:mt-6 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:self-end";
const listClasses = "relative col-span-full mt-10 md:mt-16";
/** The cover: 240px wide at 4:3, just right of the pointer and centred on it, so it never hides the title being read; never catches clicks. */
const coverClasses =
  "pointer-events-none fixed left-0 top-0 z-20 aspect-[4/3] w-60 translate-x-8 -translate-y-1/2 overflow-hidden rounded-lg shadow-raised [&>*]:size-full [&>img]:object-cover";

/** Fine pointer that can hover (a mouse or trackpad), and motion allowed. */
function useCanFollow() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return hover && !reduce;
}

export function JournalHoverIndex({ lead, heading, intro, actions, posts, tone = "default", className }: JournalHoverIndexProps) {
  const headingId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const canFollow = useCanFollow();
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canFollow || event.pointerType !== "mouse") return;
    x.set(event.clientX);
    y.set(event.clientY);
    const row = (event.target as HTMLElement).closest("li");
    const rows = listRef.current ? Array.from(listRef.current.querySelectorAll("li")) : [];
    const index = row ? rows.indexOf(row) : -1;
    if (index !== active) {
      // Jump to the pointer when the cover first appears, then trail it on the spring.
      if (active == null) {
        springX.jump(event.clientX);
        springY.jump(event.clientY);
      }
      setActive(index >= 0 && posts[index]?.cover != null ? index : null);
    }
  };

  return (
    <div className={cn("relative w-full", className)} data-pattern="journal-hover-index">
      {/* WMDS Band: full width, the page grid inside, Band `md` spacing (48 top and bottom; Spacing S8). */}
      <Band tone={tone} aria-labelledby={headingId}>
        <h2 id={headingId} className={headingClasses} data-slot="heading">
          <span className="block text-muted">{lead}</span>
          <span className="block text-fg">{heading}</span>
        </h2>
        {intro != null || actions != null ? (
          <div className={asideClasses}>
            {intro != null ? (
              <p className="text-pretty text-fg type-lead" data-slot="intro" data-slot-optional="">
                {intro}
              </p>
            ) : null}
            {actions != null ? (
              <div data-slot="actions" data-slot-optional="">
                {actions}
              </div>
            ) : null}
          </div>
        ) : null}

        <div ref={listRef} className={listClasses} onPointerMove={onMove} onPointerLeave={() => setActive(null)} data-slot="posts">
          {/* Titles in `sm` (type-heading-3), two steps under the h2 (Headings rule). */}
          <IndexList aria-labelledby={headingId} size="sm" titleAs="h3">
            {posts.map((post) => (
              <IndexList.Item key={post.href} title={post.title} href={post.href} meta={post.meta} />
            ))}
          </IndexList>
        </div>
      </Band>

      {canFollow ? (
        <AnimatePresence>
          {active != null ? (
            <motion.div
              key="cover"
              aria-hidden
              className={coverClasses}
              style={{ x: springX, y: springY }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {posts[active]?.cover}
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}
    </div>
  );
}
