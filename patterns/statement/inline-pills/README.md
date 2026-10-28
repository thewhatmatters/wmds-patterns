# Statement — Inline Pills

status: approved

After the inline icon chips in Graphical's hero sentence (Inspiration board; Randy's reference, 2026-10-27). Nothing copied but the idea.
**File:** `StatementInlinePills.tsx` (copy it; the pills are WMDS `InlinePill`, the pop-in WMDS `useInlinePillsPopIn`). **Example:** `example.tsx`, with simple glossy SVG icons drawn in WMDS chart colours (licence-free stand-ins).

One big centred sentence whose key words sit in soft pills, each with a small picture on its left. When the sentence scrolls into view, the pictures pop in one after another with a small tilt and overshoot. Playful, and it works with nothing but type and three icons.

The first **statement** pattern: a full-width section built around one sentence. Use it under the hero as an intro or "what we do" line, or as the hero itself (`as="h1"`).

| Light | Dark | Mobile (390) |
|---|---|---|
| ![](light.png) | ![](dark.png) | ![](mobile.png) |

## Use it

```tsx
import { Button, InlinePill } from "@thewhatmatters/wmds";
import { StatementInlinePills } from "./StatementInlinePills";

<StatementInlinePills animate actions={<Button role="primary" render={<a href="/start" />}>Start</Button>}>
  We build <InlinePill media={<img src="/icons/web.png" alt="" />}>websites</InlinePill>, shoot{" "}
  <InlinePill media={<img src="/icons/video.png" alt="" />}>video</InlinePill>, and run{" "}
  <InlinePill media={<img src="/icons/social.png" alt="" />}>social</InlinePill> for Austin businesses.
</StatementInlinePills>
```

## Slots and props

| Prop | Kind | Notes |
|---|---|---|
| `children` | ReactNode | The sentence: about 10–18 words, with 2–3 key words wrapped in `<InlinePill>`, one or two short words each (a long phrase splits into two half-pills across lines; at 4 or more pills it reads as a list). Keep punctuation outside the pills. WMDS `type-display-2`, about 18em wide, so it sets in 2–3 lines |
| `eyebrow` | slot, optional | 1–3 words above the sentence in sentence case, set as a plain `type-eyebrow` label (capitals from CSS) |
| `actions` | slot, optional | The CTA row under the sentence: one or two WMDS `<Button>`s |
| `as` | `"h2"` (default) or `"h1"` | `h1` when the statement is the page's hero; `h2` anywhere else |
| `animate` | boolean, default `false` | Pop the pills' pictures in when the sentence is 40% in view, once. Skipped under `prefers-reduced-motion` |

WMDS `InlinePill`: `media` (the picture: an `<img alt="">`, a 3D render or an SVG; it's decorative, the word carries the meaning) and `children` (the word or words). Pills are sized in em, so they scale with the sentence at every breakpoint.

## Motion

- **What:** each picture scales from 0 with a -24° tilt to 1.14 and 6°, then settles at 1 and 0°; pictures follow each other one WMDS beat apart (`--motion-beat`, 160ms; closer together past 4 pills, so the run stays under about half a second), over `--duration-medium-max` (550ms) on `--ease-standard`.
- **How:** WMDS `useInlinePillsPopIn` (the Web Animations API, no library), transform and opacity only. The pictures are hidden before the first paint, so they never flash in and then animate. Runs once.
- **Hover:** a picture tilts a little (-8°) when its pill is hovered, where motion is allowed.
- **Reduced motion:** no pop-in and no tilt; the pictures are simply there.
- **With Motion (motion.dev) in your app:** swap the hook for `whileInView` on each picture with WMDS `inlinePillPopInKeyframes` and a `staggerChildren` of 0.16.

## Knobs

- `--text-display-2-size`: the sentence uses WMDS `type-display-2`.
- The pill's fill is the text colour (`--color-fg`) at 4% (8% in dark), so it shows on any background and in both themes.
- The pill's shape is in `pillClasses` (em-based padding, fully round); the picture is 1em square in `mediaClasses`, sitting in the pill's left padding (out of the text flow, so it never parts from its word at a line break).

## Adapt it

The first item is the example the gallery's Copy prompt uses.

- **Different sentence:** change the words and the pills; keep it to 2–3 lines and 2–4 pills.
- **Real icons:** pass `<img src alt="">` with transparent PNG or SVG icons, or small 3D renders (Envato 3D has glossy icon sets); keep them square.
- **As the hero:** set `as="h1"`, and put the page's CTAs in `actions`.
- **No animation:** leave `animate` off; the pills are still the moment.
- **Left-aligned:** change `items-center text-center` in `innerClasses` to `items-start text-left`.

## Spacing

Full width; section padding 48 / 64 top and bottom (phone / tablet and up); eyebrow→sentence 12; sentence→CTAs 40.

## WMDS

- Built on **@thewhatmatters/wmds 0.4.28** (npm): `InlinePill` and `useInlinePillsPopIn` were added to WMDS for this pattern (Randy, 2026-10-27). No gap left.

**Alignment (Headings H8):** left-aligned on phones, where the centred sentence would run past 2 lines; centred from tablet up (2 lines). The CTA row follows it.

**Display copy (Rule 3, D7):** shorten, don't shrink. If your headline runs past 3 lines on phones, cut the words; keep the type step.
