# Stats — Pinned Counter

status: draft

After CoMinVi's pinned stats dial (details.so, https://www.details.so/inspo/cominvi-8bbec0). Nothing copied but the idea: the section pins around one large dial of ticks, and each key figure takes the hole in turn. The dial only builds: every figure is the same measure in one unit, shown lowest first, so each step sweeps it up from the last figure to the next (12% → 31% → 54% → 82% in the example) and the number counts up with it (Randy, 2026-11-03: never mix a percentage with a plain count, and never let the dial drop back).
**File:** `StatsPinnedCounter.tsx` (copy it). **Example:** `example.tsx`, a studio's four figures (made up).

The section takes one screen of scroll per figure. On the pinned screen: the heading as a small label top-left, the figure in the middle (WMDS `type-display-hero`) with its label under it, a mono "02 / 04" and the figure's category at the sides, and a WMDS `Chart.SegmentedBar` of 72 tall ticks along the bottom that fills to the figure as you scroll into it.

| Light | Dark | Mobile (390) |
|---|---|---|
| ![](light.png) | ![](dark.png) | ![](mobile.png) |

The screenshots are single moments of the scroll; frames are in the night's report.

## Use it

```tsx
import { StatsPinnedCounter } from "./StatsPinnedCounter";

<StatsPinnedCounter
  heading="What a new site does"
  unit={{ suffix: "%", max: 100 }}
  stats={[
    { value: 12, label: "More enquiries after one month", category: "Month 1" },
    { value: 31, label: "More enquiries after three months", category: "Month 3" },
    // 3–5 figures, one measure, lowest first
  ]}
/>
```

The app needs `motion` (the WMDS peer) installed.

## Slots and props

| Prop | Kind | Notes |
|---|---|---|
| `heading` | ReactNode | The section's `h2`, short, set as a small label at the top of the pinned screen |
| `stats` | array | 3–5 figures of one measure: `value`, `label` (this step, e.g. "After three months"), optional `category` (side label). Shown lowest first, whatever order you pass |
| `unit` | object, optional | The one unit every figure shares: `prefix`, `suffix`, `decimals`, `max` (a full dial). Default `{ suffix: "%", max: 100 }`; for a count, e.g. `{ max: 200 }` |
| `tone` | `"default"` (default), `"inverse"`, `"field"` | The WMDS Band tone |

## Motion

- **Scroll:** one screen of scroll per figure; the screen stays pinned (CSS `position: sticky`) for the whole section. Scroll position (Motion `useScroll`) picks the figure, and the meter fills to it over the first 40% of the figure's stretch, then holds.
- **Number:** counts from the last figure to the new one over 0.8s, easing out (`animate` on a Motion value, rendered as text through `useTransform`). A tween rather than a spring, so it always lands on the exact figure.
- **Reduced motion:** the number and the meter jump straight to each figure (measured: the right figure 80ms after scrolling).
- **Screen readers:** every figure is in a visually hidden `dl` (label, then figure), so nothing depends on scrolling; the moving figure and the meter are `aria-hidden`.

## Knobs

- `meterHeight` (64px tall ticks) and `segments={72}` on the meter; `tone="primary"` for the lit ticks.
- `0.4` in the scroll handler: how much of each figure's stretch the meter takes to fill. `0.8` and the ease on the count.

## Adapt it

The first item is the example the gallery's Copy prompt uses.

- **Your own figures:** 3–5 steps of one measure (all percentages, or all counts of the same thing), each with a real source; set `unit.max` so a full dial means something (a goal, the scale's top). Different kinds of figure belong in a different stats pattern, not on one dial.
- **On the brand's dark surface:** `tone="inverse"`.
- **Shorter scroll:** change `count * 100` (svh per figure) to `count * 70`.

## Spacing

Full width; the pinned screen has 48px top and bottom (Band `md`); the side labels sit at mid-height from md and 144px above the bottom on phones (just above the meter).

## WMDS

Built on **@thewhatmatters/wmds 0.4.35** (npm): `Band`, `Chart.Frame` (`segmentHeight`), `Chart.SegmentedBar`. Motion **13.5.1** (the WMDS peer).

- **Check change:** `npm run check` allows `motion/react` imports (the same change as on `work/pinned-parallax` and `steps/stacked-cards`), has a rule for the new Stats type (one h2, no h1, no nav, every figure in a `dl`), and lists this pattern as centred on phones (the centred text is the figure; the h2 is left-aligned).
- **Chart.SegmentedRing `size="fluid"` + `animate="always"`** (WMDS branch `lead-engineer/ring-fluid`, after 0.4.44): the dial fills its box and sweeps from each value to the next. Until that's released, this pattern only builds against the local WMDS build; the pin bump follows the release.
- **WMDS-GAP: no count-up figure.** Every stats pattern will rebuild the eased count and the reduced-motion jump. Proposed: a WMDS `CountUp` (or a `Stat` `animate` option) on the Motion peer.
