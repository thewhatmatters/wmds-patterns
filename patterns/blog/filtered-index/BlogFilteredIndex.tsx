/**
 * Blog — Filtered Index (wmds-patterns, draft). Copy this file into your app and edit it freely.
 * A blog's own page: the title with a live count, a filter rail on the left (a sheet on phones), and the posts as a
 * ruled WMDS IndexList (date, title, one-line description). Taken from whatmatters.so/blog (Randy, 2026-11-07: "I like
 * that style"), which pastes WMDS's "Pattern — filtered index". Built only from @thewhatmatters/wmds parts.
 * Your Tailwind must scan this file (it does if it sits in your app's source folders).
 */
import { type ReactElement, type ReactNode } from "react";
import {
  FilterPanel,
  IndexList,
  countFilterOptions,
  matchesFilterSelection,
  useFilterSelection,
  type FilterFacets,
  type FilterPanelGroup,
  type FilterSelection,
} from "@thewhatmatters/wmds";

export interface BlogPost {
  slug: string;
  title: string;
  href: string;
  /** ISO date, for the time element. */
  date: string;
  /** The date as readers see it, e.g. "Sep 14, 2026". */
  dateLabel: string;
  /** One line under the title. */
  description: string;
  /** The post's options in each filter group, by group id: one or several, e.g. { topic: ["guides", "brand"] }. */
  facets: FilterFacets;
}

/** Every word the page shows or speaks, so a site can keep them in its copy file. */
export interface BlogFilteredIndexLabels {
  /** How a count reads: beside an option for screen readers, in the status line, on the phone sheet's Show button. */
  count: (count: number) => string;
  /** Caption over the rail, and the phone button and sheet that hold it. */
  filters: string;
  clear: string;
  /** The phone sheet's close button. `results` is count() of what's shown, e.g. "3 posts". */
  show: (results: string) => string;
  /** Spoken name of the list. */
  list: string;
  /** Captions over the date and title columns. */
  dateColumn: string;
  titleColumn: string;
  /** Shown when there are no posts at all, and when none match the filters. */
  empty: string;
  noMatch: string;
}

const defaultLabels: BlogFilteredIndexLabels = {
  count: (count) => (count === 1 ? "1 post" : `${count} posts`),
  filters: "Filters",
  clear: "Clear all",
  show: (results) => `Show ${results}`,
  list: "Posts",
  dateColumn: "Date",
  titleColumn: "Name",
  empty: "No posts yet.",
  noMatch: "No posts match these filters.",
};

export interface BlogFilteredIndexProps {
  /** The page's h1, e.g. "Blog". The count of shown posts follows it, muted. */
  title: ReactNode;
  posts: BlogPost[];
  /** Filter groups, e.g. [{ id: "topic", label: "Topic", options: [{ value: "guides", label: "Guides" }] }]. */
  groups: FilterPanelGroup[];
  /** The filters on when the page opens, e.g. { topic: ["guides"] } from /blog?topic=guides. */
  defaultSelection?: FilterSelection;
  /** The filters on, when the app holds them (e.g. in the URL). Pass with onSelectionChange. */
  selection?: FilterSelection;
  onSelectionChange?: (selection: FilterSelection) => void;
  /** The router's link for a post, in place of a plain anchor: (post) => <Link href={post.href} />. */
  renderLink?: (post: BlogPost) => ReactElement;
  /** Page-level layers inside the page grid, e.g. a grid overlay. */
  overlay?: ReactNode;
  labels?: Partial<BlogFilteredIndexLabels>;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

/** Page padding: 24 / 40 / 56 (phone / tablet / desktop). */
const bandClasses = "band py-6 md:py-10 lg:py-14";
/** Title row: the h1 and, on phones, the Filters button at its end. */
const headerClasses = "col-span-full mb-4 flex items-end justify-between gap-4 md:mb-8";
/** Rail: 3 columns from md (hidden on phones, where the sheet holds the filters). List: the rest. */
const railClasses = "hidden md:col-span-3 md:block";
const listClasses = "col-span-full md:col-span-5 lg:col-span-9";

export function BlogFilteredIndex({
  title,
  posts,
  groups,
  defaultSelection,
  selection: selectionProp,
  onSelectionChange,
  renderLink,
  overlay,
  labels: labelsProp,
}: BlogFilteredIndexProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const [selection, setSelection] = useFilterSelection({ defaultSelection, selection: selectionProp, onSelectionChange });
  const shown = posts.filter((post) => matchesFilterSelection(post.facets, selection));

  return (
    <FilterPanel
      groups={countFilterOptions(groups, posts, labels.count)}
      selection={selection}
      onSelectionChange={setSelection}
      resultsLabel={labels.count(shown.length)}
      labels={{ title: labels.filters, clear: labels.clear, show: labels.show }}
    >
      <main className="grid-page bg-body" data-pattern="blog-filtered-index">
        {overlay}
        <div className={bandClasses}>
          <header className={headerClasses}>
            <h1 className="type-display-2 text-fg">
              {title} <span className="tabular-nums text-muted">{shown.length}</span>
            </h1>
            <FilterPanel.Trigger className="md:hidden" />
          </header>
          {/* The count, read out when a filter changes it. */}
          <p role="status" className="sr-only">
            {labels.count(shown.length)}
          </p>

          <FilterPanel.Rail className={railClasses} />

          <div className={listClasses} data-slot="posts">
            <IndexList
              aria-label={labels.list}
              captions={{ meta: labels.dateColumn, title: labels.titleColumn }}
              empty={<p className="type-body text-muted">{posts.length === 0 ? labels.empty : labels.noMatch}</p>}
            >
              {shown.map((post) => (
                <IndexList.Item
                  key={post.slug}
                  title={post.title}
                  href={renderLink != null ? undefined : post.href}
                  render={renderLink?.(post)}
                  meta={<time dateTime={post.date}>{post.dateLabel}</time>}
                  preview={<p>{post.description}</p>}
                />
              ))}
            </IndexList>
          </div>
        </div>

        <FilterPanel.Sheet />
      </main>
    </FilterPanel>
  );
}
