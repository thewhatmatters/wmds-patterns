# Testimonial — Tilted Cards

status: approved

After Griflan's "Client Confessions" (details.so, https://www.details.so/inspo/griflan-99d0f7), and the claim tickets stacked at slight angles on Buck's Sauce (Inspiration board). Nothing copied but the idea: quotes as cards laid down at small, uneven angles, in a row you drag.
**File:** `TestimonialTiltedCards.tsx` (copy it). **Example:** `example.tsx`, with made-up clients and quotes and no photos. Second pass after Randy's notes, approved 2026-10-29: closer to Griflan.

A WMDS `Band` (the inverse field by default) with a centred eyebrow, heading and one CTA, then the quotes in a WMDS `Carousel` that runs to the page edges and drifts slowly on its own. The cards alternate two colours (WMDS Card `tone`: `field`, then `light` paper), dropped at uneven angles and heights and overlapping a little. Each card holds the quote, centred between two quotation marks (top right, bottom left), and a small byline: the name in bold over the role. No photos.

| Light | Dark | Mobile (390) |
|---|---|---|
| ![](light.png) | ![](dark.png) | ![](mobile.png) |

The section sits on the brand's inverse surface in both themes, so light and dark look the same; pass `tone="default"` to follow the page theme.

## Use it

```tsx
import { Button } from "@thewhatmatters/wmds";
import { TestimonialTiltedCards } from "./TestimonialTiltedCards";

<TestimonialTiltedCards
  eyebrow="Clients"
  heading="What our clients say."
  actions={<Button role="outline" size="lg" render={<a href="/work" />}>See the work</Button>}
  quotes={[
    { quote: "Now people book a cake on the site…", name: "Maria Delgado", role: "Owner, Eastside Bakery" },
    // an even number, 4–8
  ]}
/>
```

## Slots and props

| Prop | Kind | Notes |
|---|---|---|
| `heading` | ReactNode | The section's `h2`, one short line, centred (WMDS `type-display-2`) |
| `eyebrow` | ReactNode | Optional: a short label above the heading (`type-eyebrow`) |
| `actions` | slot, optional | One CTA under the heading: a WMDS outline `<Button size="lg">` |
| `quotes` | array | An even number of quotes, 4–8, so the two card colours keep alternating where the loop joins: `quote` (20–45 words, no quotation marks), `name`, optional `role` |
| `tone` | `"inverse"` (default), `"field"`, `"default"` | The WMDS Band tone; everything inside re-skins with it |
| `cardTones` | `[CardTone, CardTone]` | The two card colours the row alternates (WMDS Card `tone`). Default `["field", "light"]` |
| `autoplay` | boolean, default `true` | The row drifts slowly on its own (WMDS Carousel `autoplay`); see Behaviour |
| `cursor` | slot, optional | What the badge following a mouse over the row shows. Default: a hand. `null` hides it |

## Behaviour

- **The row** is WMDS `Carousel` (`bleed`, `loop`): the quotes repeat seamlessly, so the row never ends (Randy 2026-10-29). Drag, trackpad, touch and keyboard from WMDS, named by the heading; no scrubber, since a loop has no end. Cards are 85% of the row on phones, 46% on tablet, 30% on desktop.
- **Drift** (`autoplay`): about 24px a second, one way, wrapping invisibly. It holds on hover, on focus inside the row, during a drag, off screen and in a hidden tab; a Pause / Play button sits under the row (WCAG 2.2.2: anything that moves on its own for more than 5 seconds needs a way to stop it); it never moves under reduced motion.
- **Drag:** the row stays where it's let go (no snap), and keeps a little momentum.
- **Lean:** while the row moves, the cards tip toward the way it's going (up to 8°, from WMDS Carousel's `--carousel-velocity`, smoothed by a Motion spring) and ease back upright when it stops. The row doesn't select text, so a drag never paints selection over the cards. None under reduced motion.
- **Cursor:** a hand badge follows a mouse over the row (devices with a fine pointer that can hover only); decorative.
- **Each quote** is an `article` card with a `figure`, `blockquote` and `figcaption` (name, role). The two quotation marks are decorative (`aria-hidden`).
- **Centred on phones** (Headings H8): the heading holds 1 line at 390 and each quote is short, so both stay centred (measured 2026-10-29).
- **Lay** (tilt and height) is a still transform on each card, with 32px of room above and below so the corners clear the row's clip.

## Knobs

- The Band tone sets the field, card surface (`bg-surface`), borders and text; brands change them through WMDS colour knobs.
- `lays` in the file: six angle-and-height steps, repeating. `cardTones`: the two card colours. Brands set the field colour through WMDS's `--color-field` knob (e.g. their red).

## Adapt it

The first item is the example the gallery's Copy prompt uses.

- **No tilt:** empty the `lays` array's values (`""`) for a calm, straight row.
- **No drift:** `autoplay={false}`; the row moves only when the visitor moves it.
- **On the page background:** `tone="default"`.
- **Brand colours:** set `--color-field` (and `--color-on-field`) in your brand stylesheet; the field cards follow.
- **Three quotes or fewer:** don't use a row; put them in a grid of three instead.

## Spacing

Full width; WMDS Band `md` spacing (48 top and bottom); eyebrow→heading 12; heading→CTA 24; heading block→cards 40 on phones, 64 from md (cards' 32px clearance included); card padding 48 top and bottom, 32 / 40 at the sides; quote→byline 24.

## WMDS

Checked against **@thewhatmatters/wmds 0.4.35** (npm), which added Card `tone`, Carousel `autoplay`, `loop`, `cursor` and `--carousel-velocity` for this pattern. Uses `Band`, `Card`, `Carousel`; the example adds `Button`.

- **Card tones: built.** WMDS 0.4.33 adds Card `tone` (`inverse`, `field`, `light`) and a scoped light palette (`[data-theme="light"]`), so a paper card sits on a dark band.
- **WMDS-GAP: no quote part.** There's no WMDS `Quote` / testimonial atom (marks, quote, attribution), so the pattern composes `figure` + `blockquote` + `figcaption`. Worth a WMDS part if a second testimonial pattern needs the same.
