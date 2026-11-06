/**
 * Journal — Hover Index: the latest posts as a ruled table of rows on the page grid, under a two-tone heading
 * (after United Carriers' "What's moving in your industry"; Randy, 2026-11-06: date in its own columns, the title
 * across the width, the row's tags and an arrow at the end, a hover state on every row).
 *
 * Each row is a WMDS `IndexList.Item` on `columns="page"`: the date in the first two columns, the title (`h3`) across
 * the width, then the post's tags (WMDS `Badge`s) and an arrow, → for a post on this site, ↗ for one elsewhere
 * (opens a new tab). The whole row is the link, with a quiet fill under the pointer and on keyboard focus. No
 * motion beyond the arrow's small nudge on hover.
 */
import { useId, type ReactNode } from "react";
import { Badge, Band, IndexList, cn, type BandTone } from "@thewhatmatters/wmds";

export interface JournalHoverIndexPost {
  /** The post's title. */
  title: string;
  /** Where it lives. */
  href: string;
  /** The date column: a `<time>`, e.g. `<time dateTime="2026-10-29">29 Oct</time>`. */
  date: ReactNode;
  /** The post's tags, one or two words each: "Case study", "Guide". Shown as badges at the row's end. */
  tags?: string[];
  /** The post lives on another site: an out-arrow, and it opens in a new tab. */
  external?: boolean;
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
/** The rows sit on the page grid, under the header. */
const listClasses = "mt-10 md:mt-16";

export function JournalHoverIndex({ lead, heading, intro, actions, posts, tone = "default", className }: JournalHoverIndexProps) {
  const headingId = useId();

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

        {/* Titles in `sm` (type-heading-3), two steps under the h2 (Headings rule). */}
        <IndexList aria-labelledby={headingId} size="sm" titleAs="h3" columns="page" className={listClasses}>
          {posts.map((post) => (
            <IndexList.Item
              key={post.href}
              title={post.title}
              href={post.href}
              meta={post.date}
              tags={
                post.tags != null && post.tags.length > 0
                  ? post.tags.map((tag) => (
                      <Badge key={tag} size="sm" emphasis="outline">
                        {tag}
                      </Badge>
                    ))
                  : undefined
              }
              arrow
              external={post.external}
            />
          ))}
        </IndexList>
      </Band>
    </div>
  );
}
