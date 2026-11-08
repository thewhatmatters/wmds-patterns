/**
 * Example content for Blog — Filtered Index: eight made-up studio posts under four topics. Replace them with the
 * site's posts (read from its content files) and the topics they use.
 */
import type { FilterPanelGroup } from "@thewhatmatters/wmds";
import { BlogFilteredIndex, type BlogFilteredIndexProps, type BlogPost } from "./BlogFilteredIndex";

export const meta = {
  type: "Blog",
  name: "Blog — Filtered Index",
  purpose: "A blog's own page: title with a live count, a filter rail (a sheet on phones), and the posts as a ruled index.",
};

const topics = [
  { value: "guides", label: "Guides" },
  { value: "brand", label: "Brand" },
  { value: "site", label: "Site" },
  { value: "studio-notes", label: "Studio notes" },
];
const groups: FilterPanelGroup[] = [{ id: "topic", label: "Topic", options: topics }];

const post = (slug: string, title: string, date: string, dateLabel: string, description: string, topic: string[]): BlogPost => ({
  slug,
  title,
  href: `#${slug}`,
  date,
  dateLabel,
  description,
  facets: { topic },
});

export const examplePosts: BlogPost[] = [
  post("pricing-page", "What a pricing page owes the person reading it", "2026-11-04", "Nov 4, 2026", "Three questions every visitor asks before they scroll.", ["guides", "site"]),
  post("bakery-relaunch", "The bakery that sells out by noon", "2026-10-29", "Oct 29, 2026", "How a two-week site changed the morning rush.", ["studio-notes"]),
  post("type-pairing", "Pairing a serif with a working sans", "2026-10-21", "Oct 21, 2026", "One for the voice, one for the forms.", ["guides", "brand"]),
  post("naming", "Naming a business you can say on the phone", "2026-10-12", "Oct 12, 2026", "If it needs spelling twice, it needs another pass.", ["brand"]),
  post("first-screen", "The first screen does one job", "2026-10-02", "Oct 2, 2026", "A headline, a reason and a next step. Nothing else.", ["site"]),
  post("photo-day", "Planning a photo day for a small team", "2026-09-24", "Sep 24, 2026", "A shot list that fits in an afternoon.", ["guides", "brand"]),
  post("studio-week", "A week in the studio", "2026-09-15", "Sep 15, 2026", "Sketches, calls and one very long Friday.", ["studio-notes"]),
  post("care-plans", "Why every site needs a care plan", "2026-09-03", "Sep 3, 2026", "Launch is the start of the work, not the end.", ["site", "guides"]),
];

/** The pattern filled with the example content. */
export default function Example(props: Partial<BlogFilteredIndexProps>) {
  return <BlogFilteredIndex title="Blog" posts={examplePosts} groups={groups} {...props} />;
}
