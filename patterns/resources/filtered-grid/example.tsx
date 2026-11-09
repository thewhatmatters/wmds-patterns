/**
 * Example content for Resources — Filtered Grid: nine made-up resources under four categories. Their previews are
 * simple shapes drawn in SVG with WMDS chart colours (licence-free stand-ins), in a few different shapes so the
 * masonry packing shows. A real page passes screenshots through `renderImage` (e.g. next/image).
 */
import type { FilterPanelGroup } from "@thewhatmatters/wmds";
import { ResourcesFilteredGrid, type Resource, type ResourceImage, type ResourcesFilteredGridProps } from "./ResourcesFilteredGrid";

export const meta = {
  type: "Resources",
  name: "Resources — Filtered Grid",
  purpose: "A resources page: title with a live count, a filter rail (a sheet on phones), and a masonry grid of link tiles.",
};

const categories = [
  { value: "type", label: "Type" },
  { value: "colour", label: "Colour" },
  { value: "tools", label: "Tools" },
  { value: "reading", label: "Reading" },
];
const groups: FilterPanelGroup[] = [{ id: "category", label: "Category", options: categories }];

const item = (id: string, title: string, meta: string, width: number, height: number, category: string[], tag?: string): Resource => ({
  id,
  title,
  href: `#${id}`,
  meta,
  tag,
  image: { src: `#${id}`, alt: `Preview of ${title}`, width, height },
  facets: { category },
});

const exampleItems: Resource[] = [
  item("type-scale", "A type scale you can reason about", "typescale.example", 1200, 900, ["type", "tools"], "Free"),
  item("contrast", "Checking contrast on coloured fills", "contrast.example", 1200, 1500, ["colour", "tools"]),
  item("serif-guide", "A field guide to text serifs", "serifs.example", 1200, 800, ["type", "reading"]),
  item("palette", "Building a palette from one photo", "palette.example", 1200, 1200, ["colour"]),
  item("grid-notes", "Notes on a twelve-column grid", "grids.example", 1200, 900, ["reading"]),
  item("icons", "An icon set drawn on one grid", "icons.example", 1200, 1400, ["tools"], "Free"),
  item("pairing", "Pairing type for small brands", "pairing.example", 1200, 850, ["type", "reading"]),
  item("dark-mode", "Dark mode without the grey mush", "dark.example", 1200, 1100, ["colour", "reading"]),
  item("kerning", "A kerning game", "kern.example", 1200, 900, ["type", "tools"]),
];

const fills = [
  "var(--color-chart-categorical-1)",
  "var(--color-chart-categorical-2)",
  "var(--color-chart-categorical-3)",
  "var(--color-chart-categorical-4)",
  "var(--color-chart-categorical-5)",
];

/** A stand-in preview: a soft field with two shapes, at the image's own shape. */
function Preview({ image }: { image: ResourceImage }) {
  const seed = image.alt.length;
  const fill = fills[seed % fills.length];
  const { width: w, height: h } = image;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={image.alt} className="block h-auto w-full">
      <rect width={w} height={h} fill="color-mix(in srgb, var(--color-text-primary) 5%, var(--color-surface))" />
      <circle cx={w * 0.38} cy={h * 0.45} r={Math.min(w, h) * 0.24} fill={fill} />
      <rect x={w * 0.52} y={h * 0.3} width={w * 0.26} height={h * 0.4} rx={24} fill={fill} opacity={0.55} />
    </svg>
  );
}

/** The pattern filled with the example content. */
export default function Example(props: Partial<ResourcesFilteredGridProps>) {
  return (
    <ResourcesFilteredGrid
      title="Resources"
      caption="Things worth your time"
      items={exampleItems}
      groups={groups}
      renderImage={(image) => <Preview image={image} />}
      {...props}
    />
  );
}
