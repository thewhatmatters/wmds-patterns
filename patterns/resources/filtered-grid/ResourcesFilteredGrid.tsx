/**
 * Resources — Filtered Grid (wmds-patterns, draft). Copy this file into your app and edit it freely.
 * A resources page: the title with a live count, a filter rail on the left (a sheet on phones), a caption, and a
 * grid of WMDS LinkTiles that keep each preview's own shape (masonry) or a 4:3 crop (uniform). Taken from
 * whatmatters.so/resources (Randy, 2026-11-07: "I like that style"), which pastes WMDS's "Pattern — filtered grid".
 * Built only from @thewhatmatters/wmds parts. Your Tailwind must scan this file.
 */
import { useId, type ReactElement, type ReactNode } from "react";
import {
  Badge,
  FilterPanel,
  LinkTile,
  SectionCaption,
  TileGrid,
  countFilterOptions,
  matchesFilterSelection,
  useFilterSelection,
  type FilterFacets,
  type FilterPanelGroup,
  type FilterSelection,
  type TileGridColumns,
  type TileGridLayout,
} from "@thewhatmatters/wmds";

export interface ResourceImage {
  src: string;
  alt: string;
  /** The image's own size in px: it holds the tile's space before the image loads. */
  width: number;
  height: number;
}

export interface Resource {
  id: string;
  title: string;
  /** Where the tile goes: the resource's page in your app (e.g. /resources/type-scale), or another site. */
  href: string;
  /** Only for a tile that links straight to another site: it shows the external mark and opens a new tab. */
  external?: boolean;
  image: ResourceImage;
  /** One line under the title, e.g. the domain. */
  meta?: string;
  /** A short label over the image, e.g. "Free". */
  tag?: string;
  /** The resource's options in each filter group, by group id, e.g. { category: ["type", "tools"] }. */
  facets: FilterFacets;
}

/** Every word the page shows or speaks, so a site can keep them in its copy file. */
export interface ResourcesFilteredGridLabels {
  count: (count: number) => string;
  filters: string;
  clear: string;
  show: (results: string) => string;
  /** Spoken while the placeholder tiles show. */
  loading: string;
  empty: string;
  noMatch: string;
}

const defaultLabels: ResourcesFilteredGridLabels = {
  count: (count) => (count === 1 ? "1 resource" : `${count} resources`),
  filters: "Filters",
  clear: "Clear all",
  show: (results) => `Show ${results}`,
  loading: "Loading resources",
  empty: "No resources yet.",
  noMatch: "No resources match these filters.",
};

export interface ResourcesFilteredGridProps {
  /** The page's h1, e.g. "Resources". The count of shown resources follows it, muted. */
  title: ReactNode;
  /** The caption over the grid, in sentence case; it names the list. */
  caption: string;
  items: Resource[];
  groups: FilterPanelGroup[];
  /** `masonry` (default): tiles keep their image's height and pack. `uniform`: every image is 4:3. */
  layout?: TileGridLayout;
  /** Columns per breakpoint. Default: 1 on phones, 2 from sm, 3 from lg. */
  columns?: TileGridColumns;
  /** Placeholder tiles while the items are on their way. */
  loading?: boolean;
  defaultSelection?: FilterSelection;
  selection?: FilterSelection;
  onSelectionChange?: (selection: FilterSelection) => void;
  /** The router's link for a tile: (item) => <Link href={item.href} />. Not used for external items. */
  renderLink?: (item: Resource) => ReactElement;
  /** Your image component in place of img: (image) => <Image {...image} sizes="…" />. */
  renderImage?: (image: ResourceImage) => ReactNode;
  /** Page-level layers inside the page grid, e.g. a grid overlay. */
  overlay?: ReactNode;
  labels?: Partial<ResourcesFilteredGridLabels>;
}

/* Every class is written out in full (never interpolated) so Tailwind sees it. */

/** Page padding: 24 / 40 / 56 (phone / tablet / desktop). */
const bandClasses = "band py-6 md:py-10 lg:py-14";
const headerClasses = "col-span-full mb-4 flex items-end justify-between gap-4 md:mb-8";
const railClasses = "hidden md:col-span-3 md:block";
const gridClasses = "col-span-full md:col-span-5 lg:col-span-9";

/** The image's shape in a uniform grid, and the placeholders' while loading, as width / height. */
const uniformRatio = 4 / 3;
const loadingTiles = ["one", "two", "three", "four", "five", "six"];

export function ResourcesFilteredGrid({
  title,
  caption,
  items,
  groups,
  layout = "masonry",
  columns,
  loading = false,
  defaultSelection,
  selection: selectionProp,
  onSelectionChange,
  renderLink,
  renderImage,
  overlay,
  labels: labelsProp,
}: ResourcesFilteredGridProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const gridHeadingId = useId();
  const [selection, setSelection] = useFilterSelection({ defaultSelection, selection: selectionProp, onSelectionChange });
  const shown = items.filter((item) => matchesFilterSelection(item.facets, selection));

  return (
    <FilterPanel
      groups={countFilterOptions(groups, items, labels.count)}
      selection={selection}
      onSelectionChange={setSelection}
      resultsLabel={labels.count(shown.length)}
      labels={{ title: labels.filters, clear: labels.clear, show: labels.show }}
    >
      <main className="grid-page bg-body" data-pattern="resources-filtered-grid">
        {overlay}
        <div className={bandClasses}>
          <header className={headerClasses}>
            <h1 className="type-display-2 text-fg">
              {title} {loading ? null : <span className="tabular-nums text-muted">{shown.length}</span>}
            </h1>
            <FilterPanel.Trigger className="md:hidden" />
          </header>
          <p role="status" className="sr-only">
            {loading ? labels.loading : labels.count(shown.length)}
          </p>

          <FilterPanel.Rail className={railClasses} />

          <div className={gridClasses} data-slot="items">
            <SectionCaption id={gridHeadingId}>{caption}</SectionCaption>
            <TileGrid
              aria-labelledby={gridHeadingId}
              layout={layout}
              columns={columns}
              busy={loading}
              empty={<p className="type-body text-muted">{items.length === 0 ? labels.empty : labels.noMatch}</p>}
              className="mt-6"
            >
              {loading
                ? loadingTiles.map((key) => (
                    <TileGrid.Item key={key}>
                      <LinkTile loading ratio={uniformRatio} />
                    </TileGrid.Item>
                  ))
                : shown.map((item) => {
                    const routed = renderLink != null && !item.external;
                    return (
                      <TileGrid.Item key={item.id}>
                        <LinkTile
                          title={item.title}
                          href={routed ? undefined : item.href}
                          render={routed ? renderLink(item) : undefined}
                          external={item.external}
                          meta={item.meta}
                          ratio={layout === "uniform" ? uniformRatio : undefined}
                          tag={item.tag != null ? <Badge>{item.tag}</Badge> : undefined}
                          media={
                            renderImage != null ? (
                              renderImage(item.image)
                            ) : (
                              <img src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} loading="lazy" decoding="async" />
                            )
                          }
                        />
                      </TileGrid.Item>
                    );
                  })}
            </TileGrid>
          </div>
        </div>

        <FilterPanel.Sheet />
      </main>
    </FilterPanel>
  );
}
