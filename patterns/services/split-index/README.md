# Services — Split Index

status: draft

After Heron AI's services section, "Built to work the way you do" (Inspiration board #9; also on details.so, https://www.details.so/inspo/heronaiapp-90cbbe). Nothing copied but the structure: a ruled split with the services listed on one side and the open one's picture on the other.
**File:** `ServicesSplitIndex.tsx` (copy it). **Example:** `example.tsx`, whose pictures are small WMDS compositions of each service's output (licence-free; swap in real work).

A small mono caption, a heading with a short intro and one CTA beside it, then two cells under a hairline: the open service's picture in a dot-grid frame on the left, which stays in view while the list scrolls, and the services as a numbered WMDS `Accordion` on the right. One service is open at a time; opening another swaps the picture. On phones the frame drops away and each picture sits inside its own open row.

| Light | Dark | Mobile (390) |
|---|---|---|
| ![](light.png) | ![](dark.png) | ![](mobile.png) |

## Use it

```tsx
import { TextLink } from "@thewhatmatters/wmds";
import { ServicesSplitIndex } from "./ServicesSplitIndex";

<ServicesSplitIndex
  heading="Everything a small business needs to be found, and chosen."
  intro="Four services, one team."
  services={[
    { title: "Websites", meta: "From 6 weeks", description: "A fast site you can edit yourself.", link: <TextLink href="/websites">How we build sites</TextLink>, visual: <img src="/work/site.jpg" alt="The Eastside Bakery site on a laptop" /> },
    // …
  ]}
/>
```

## Slots and props

| Prop | Kind | Notes |
|---|---|---|
| `heading` | ReactNode | The section's `h2`, one or two lines (WMDS `type-display-3`) |
| `intro` | ReactNode | Optional: a sentence or two beside the heading, muted |
| `caption` | slot, optional | The small mono caption over the section (WMDS `SectionCaption`). Default "Services" |
| `actions` | slot, optional | One CTA under the intro, usually a WMDS `<Button role="secondary">` |
| `services` | array | 3–6 services: `title`, `description`, `visual` (slot), optional `meta` (short, e.g. "Monthly"; hidden under 640px) and `link` (a WMDS `<TextLink>`) |
| `defaultIndex` | number, default `0` | The service open at first |

## Behaviour

- **Rows** are WMDS `Accordion` (plain, flush): buttons with `aria-expanded`, keyboard and focus from WMDS. Opening a row closes the others; closing the open row leaves the frame on its picture.
- **The frame** is `position: sticky` (top 32px), 4:3, on the WMDS dot-grid background. It shows only the open service's `visual`, so a picture that carries meaning needs its own `alt` or `aria-label`.
- **Phones (< 768px):** the frame is hidden and the open row shows its picture under the description.
- **Motion:** only the Accordion's own open and close. To cross-fade the picture, wrap the frame's child in `AnimatePresence` in your page.

## Knobs

- `--text-display-3-size` (heading), WMDS `type-heading-3` (row titles).
- Rules and the frame use `border-border`; the frame fill is `wmds-pattern-dot-grid` on the page background.

## Adapt it

The first item is the example the gallery's Copy prompt uses.

- **Real work as pictures:** pass an `<img>` or `<video>` per service (fill the frame: `className="size-full object-cover"` and drop the frame's padding in your copy).
- **No CTA:** leave `actions` empty.
- **Picture on the right:** swap the two cells' order and move the centre rule (`border-r` → `border-l` on the frame cell, `md:pl-8` → `md:pr-8` on the list).
- **More services:** up to six; past that, use a plain list or split into two sections.

## Spacing

Full width; section padding 48 / 64 top and bottom (phone / tablet and up); caption→heading 24; header→cells 40 / 64; 32 each side of the centre rule.

## WMDS

Built on **@thewhatmatters/wmds 0.4.28** (npm): `SectionCaption`, `Accordion`, `backgroundPatternDotGridClasses`; the example adds `Card`, `Stat`, `Status`, `Badge`, `ChartRankedBars`, `TextLink`, `Button`.

- **WMDS-GAP: no selected-row emphasis.** Heron marks the open service with an inverted ink band across the row; WMDS `Accordion` has no selected or inverse state for an item, and a pattern can't restyle it (its `className` is layout-only). Left out rather than patched. Proposed: `Accordion.Item` `emphasis="inverse"` when open (the `data-tone="inverse"` remap Band already uses).
- **WMDS-GAP: no large index size for Accordion.** Rows are fixed at `h-11`; the pattern sets the title in `type-heading-3` inside the label slot, which fits but leaves no room for a bigger index (IndexList has `size="lg"`, but no single-open preview with a linked picture). Proposed: `Accordion` `size="lg"` for editorial lists.
