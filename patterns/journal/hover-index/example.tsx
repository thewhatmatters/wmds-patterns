/**
 * Example content for Journal — Hover Index: a studio's six latest posts, one of them on another site (an
 * interview), to show the out-arrow. Titles are made up.
 */
import { Button } from "@thewhatmatters/wmds";
import { JournalHoverIndex, type JournalHoverIndexPost, type JournalHoverIndexProps } from "./JournalHoverIndex";

export const meta = {
  type: "Journal",
  name: "Journal — Hover Index",
  purpose: "Latest posts as a ruled table on the page grid: date, title, tags and an arrow, each row one link with a hover state.",
};

const posts: JournalHoverIndexPost[] = [
  {
    title: "Why the bakery's new site sells out by noon",
    href: "#bakery",
    date: <time dateTime="2026-10-29">29 Oct</time>,
    tags: ["Case study"],
  },
  {
    title: "Five things to fix before you pay for ads",
    href: "#ads",
    date: <time dateTime="2026-10-21">21 Oct</time>,
    tags: ["Guide"],
  },
  {
    title: "Shooting a week of video in one afternoon",
    href: "https://example.com/interviews/one-afternoon",
    external: true,
    date: <time dateTime="2026-10-14">14 Oct</time>,
    tags: ["Behind the work"],
  },
  {
    title: "What a care plan actually covers",
    href: "#care",
    date: <time dateTime="2026-10-06">6 Oct</time>,
    tags: ["Guide"],
  },
  {
    title: "Menus people can read on a phone",
    href: "#menus",
    date: <time dateTime="2026-09-28">28 Sep</time>,
    tags: ["Case study"],
  },
  {
    title: "How we price a website, line by line",
    href: "#pricing",
    date: <time dateTime="2026-09-17">17 Sep</time>,
    tags: ["Studio notes"],
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
