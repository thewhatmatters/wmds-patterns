/**
 * Team — Ruled Grid: the people behind the work, each in a ruled cell with a portrait, their name and role, under a
 * heading and a short intro (after Heron AI's "Powered by technologists"). Plain and content-led: no motion beyond a
 * quiet fill on the cell under the pointer.
 */
import { useId, type ReactNode } from "react";
import { Band, cn, type BandTone } from "@thewhatmatters/wmds";

export interface TeamRuledGridPerson {
  /** Their name. */
  name: string;
  /** Their role, short: "Founder · Design". Set in small mono caps. */
  role: string;
  /** Slot: the portrait, an `<img>` with `alt` (or `alt=""` when the name beside it says enough), cropped 4:5. */
  portrait: ReactNode;
  /** Slot, optional: one link under the role, e.g. a WMDS `<TextLink>` to their LinkedIn or their work. */
  link?: ReactNode;
}

export interface TeamRuledGridProps {
  /** Optional: a short label above the heading, e.g. "Team". */
  eyebrow?: ReactNode;
  /** The section's heading, one short line. */
  heading: ReactNode;
  /** Optional: a sentence or two beside the heading: who they are and how they work. */
  intro?: ReactNode;
  /** The people, 2–8: two across on phones, four from md. */
  people: TeamRuledGridPerson[];
  /** The WMDS Band tone. Default `default`. */
  tone?: BandTone;
  className?: string;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

const headerClasses = "col-span-full lg:col-span-6";
const headingClasses = "text-balance type-heading-1 text-fg";
/** The intro starts where the second half starts (column 7, Grid rule). */
const introClasses = "col-span-full mt-4 text-pretty text-fg type-lead md:mt-6 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:self-end";
/** Ruled cells that share their rules: the list draws the top and left edge, each cell its right and bottom. */
const gridClasses = "col-span-full mt-10 grid grid-cols-2 border-l border-t border-border md:mt-16 md:grid-cols-4";
/** A quiet fill under the pointer: the text colour at 4% (WMDS has no row-hover token for a static cell). */
const cellClasses =
  "flex flex-col border-b border-r border-border p-4 transition-colors duration-150 ease-out hover:bg-[color-mix(in_srgb,var(--color-text-primary)_4%,transparent)] motion-reduce:transition-none md:p-6";
const portraitClasses = "aspect-[4/5] w-full overflow-hidden rounded-md [&>*]:size-full [&>img]:object-cover";
const nameClasses = "mt-4 text-balance type-heading-3 text-fg md:mt-6";
const roleClasses = "mt-1 type-eyebrow text-muted";

export function TeamRuledGrid({ eyebrow, heading, intro, people, tone = "default", className }: TeamRuledGridProps) {
  const headingId = useId();

  return (
    <div className={cn("relative w-full", className)} data-pattern="team-ruled-grid">
      {/* WMDS Band: full width, the page grid inside, Band `md` spacing (48 top and bottom; Spacing S8). */}
      <Band tone={tone} aria-labelledby={headingId}>
        <div className={headerClasses}>
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

        <ul className={gridClasses} data-slot="people">
          {people.map((person) => (
            <li key={person.name} className={cellClasses}>
              <div className={portraitClasses}>{person.portrait}</div>
              <h3 className={nameClasses}>{person.name}</h3>
              <p className={roleClasses}>{person.role}</p>
              {person.link != null ? <div className="mt-3">{person.link}</div> : null}
            </li>
          ))}
        </ul>
      </Band>
    </div>
  );
}
