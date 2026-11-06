/**
 * Example content for Journal — Hover Index: a studio's six latest posts. Titles are made up, and each cover is
 * flat cut-paper shapes drawn in SVG from WMDS chart colours, so the example is licence-free; a client page uses
 * each post's own cover image.
 */
import type { ReactNode } from "react";
import { Button } from "@thewhatmatters/wmds";
import { JournalHoverIndex, type JournalHoverIndexPost, type JournalHoverIndexProps } from "./JournalHoverIndex";

export const meta = {
  type: "Journal",
  name: "Journal — Hover Index",
  purpose: "Latest posts as a ruled index under a two-tone heading; a small cover follows the pointer over each post.",
};

const c = (n: number) => `var(--color-chart-categorical-${n})`;

function Cover({ field, children }: { field: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 300" width={400} height={300} aria-hidden className="block size-full">
      <rect width="400" height="300" fill={field} />
      {children}
    </svg>
  );
}

const posts: JournalHoverIndexPost[] = [
  {
    title: "Why the bakery's new site sells out by noon",
    href: "#bakery",
    meta: <><time dateTime="2026-10-29">29 Oct</time> · Case study</>,
    cover: (
      <Cover field={c(4)}>
        <circle cx="290" cy="90" r="56" fill={c(1)} />
        <path d="M60 250c0-70 60-120 140-120s140 50 140 120z" fill={c(3)} />
      </Cover>
    ),
  },
  {
    title: "Five things to fix before you pay for ads",
    href: "#ads",
    meta: <><time dateTime="2026-10-21">21 Oct</time> · Guide</>,
    cover: (
      <Cover field={c(2)}>
        <path d="M40 300v-80a40 40 0 0 1 80 0v80z" fill={c(5)} />
        <path d="M150 300v-140a50 50 0 0 1 100 0v140z" fill={c(1)} />
        <path d="M280 300v-200a50 50 0 0 1 100 0v200z" fill={c(4)} />
      </Cover>
    ),
  },
  {
    title: "Shooting a week of video in one afternoon",
    href: "#video",
    meta: <><time dateTime="2026-10-14">14 Oct</time> · Behind the work</>,
    cover: (
      <Cover field={c(1)}>
        <path d="M30 260 150 90l120 170z" fill={c(3)} />
        <path d="M150 260 270 120l100 140z" fill={c(5)} />
      </Cover>
    ),
  },
  {
    title: "What a care plan actually covers",
    href: "#care",
    meta: <><time dateTime="2026-10-06">6 Oct</time> · Guide</>,
    cover: (
      <Cover field={c(3)}>
        <circle cx="200" cy="150" r="120" fill={c(2)} />
        <circle cx="200" cy="150" r="76" fill={c(4)} />
        <circle cx="200" cy="150" r="32" fill={c(1)} />
      </Cover>
    ),
  },
  {
    title: "Menus people can read on a phone",
    href: "#menus",
    meta: <><time dateTime="2026-09-28">28 Sep</time> · Case study</>,
    cover: (
      <Cover field={c(5)}>
        <circle cx="110" cy="90" r="42" fill={c(4)} />
        <path d="M0 300v-90l90-30h220l90 30v90z" fill={c(2)} />
      </Cover>
    ),
  },
  {
    title: "How we price a website, line by line",
    href: "#pricing",
    meta: <><time dateTime="2026-09-17">17 Sep</time> · Studio notes</>,
    cover: (
      <Cover field={c(2)}>
        <path d="M200 280 120 80l100 190z" fill={c(3)} />
        <path d="M200 280 280 70 180 270z" fill={c(5)} />
        <path d="M200 280 40 150l170 120z" fill={c(4)} />
      </Cover>
    ),
  },
];

export default function Example(props: Partial<JournalHoverIndexProps>) {
  return (
    <JournalHoverIndex
      lead="What's new"
      heading="in the studio."
      intro="Case studies, guides and notes from the work: what we tried, what worked and what it cost."
      actions={
        <Button role="outline" size="lg" render={<a href="#journal" />}>
          Read the journal
        </Button>
      }
      posts={posts}
      {...props}
    />
  );
}
