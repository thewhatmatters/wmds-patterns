# Hero — Feature Center

status: approved

Randy approved it in the gallery on 2026-10-27.
**File:** `HeroFeatureCenter.tsx` (copy it). **Example:** `example.tsx` (filled in with placeholder content).

A centred hero: an eyebrow pill, a 2-line headline, a subhead and a CTA row, then the product in a framed window lit from behind, then an optional row of client logos.

| Light | Dark | Mobile (390) |
|---|---|---|
| ![](light.png) | ![](dark.png) | ![](mobile.png) |

## Layout

**Centred** (Hero rule R7): use it when the headline holds **2 lines or fewer** at 1440 and the visual is the real thing (here the homepage sketch, with the glow behind it, never instead of it). It left-aligns below `lg`, where the headline runs 3 lines. For a services business with a picture of the work, prefer a **split** hero; for footage, an **over-media** hero with a scrim.

## Use it

```tsx
import { Button } from "@thewhatmatters/wmds";
import { HeroFeatureCenter, HeroFeatureCenterLogos } from "./HeroFeatureCenter";

// Under the page's existing nav: leave `nav` empty.
<HeroFeatureCenter
  eyebrow="Free sketch in 48 hours"
  headline="Websites, video and social that bring Austin in the door."
  subhead="We design, build and run the things your customers check before they visit."
  actions={
    <>
      <Button role="primary" size="lg" render={<a href="/sketch" />}>Get my free sketch</Button>
      <Button role="outline" size="lg" render={<a href="/work" />}>See our work</Button>
    </>
  }
  visual={<img src="/product.png" alt="" />}
  logos={<HeroFeatureCenterLogos logos={[{ name: "Cinder & Sotol", logo: <CinderMark /> }]} />}
/>
```

## Slots and props

| Prop | Kind | Notes |
|---|---|---|
| `nav` | slot, optional | Leave it empty when the page already has a nav (the usual case). For a standalone page pass a `<SiteNav>` |
| `eyebrow` | ReactNode, optional | 1–3 words (about 28 characters) in sentence case, 12px above the headline. Plain WMDS `type-eyebrow` label unless `eyebrowHref` is set |
| `eyebrowHref` | string, optional | Where the eyebrow links (an offer, an announcement). With it, the eyebrow is an outlined pill link (WMDS Badge `md`, 24px tall) with a trailing arrow; a pill never appears without a link (Eyebrow E10) |
| `headline` | ReactNode | The page's only H1. Static |
| `subhead` | ReactNode | Regular weight, about 42rem wide |
| `actions` | slot, optional | The CTA row: any buttons or links. When set, `primaryAction` / `secondaryAction` are ignored |
| `primaryAction` / `secondaryAction` | `{ label, href }` | Shorthand for a primary and an outline (secondary-level) button (Buttons U1, U4) |
| `visual` | slot, optional | What goes in the framed window: product shot, site, video. Decorative (`aria-hidden`) unless you change that |
| `logos` | slot, optional | Proof under the visual. `<HeroFeatureCenterLogos logos={[{ name, logo }]} />` (6 is typical; 3 per row on phones, 6 at desktop; a short row centres), or a marquee, a quote, a stats row |

## Knobs

- `--text-display-1-size`: the headline uses WMDS `type-display-1` (fluid 40px → 80px). About 58 characters take 2 lines from 1024px up, 3 on tablets, 4 on phones. Lower it for a longer headline.
- `--hero-glow`: the backlight colour. Default: a light tint of `--color-brand-outline` (follows light and dark).
- WMDS brand knobs as usual: `--radius-control`, `--radius-surface`, `--font-family-*`, `--color-primary`.

## Adapt it

The first item is the example the gallery's Copy prompt uses.

- **No product visual:** leave `visual` empty; the logos follow the CTAs.
- **Different copy:** change the props. If the headline runs past 2 lines at desktop, shorten it or lower `--text-display-1-size`.
- **More or fewer logos:** pass more or fewer to `HeroFeatureCenterLogos`. Over about 8, use a marquee in the `logos` slot instead of more rows.
- **Marquee:** put any marquee in the `logos` slot; nothing else changes.
- **One CTA, or three:** whatever you put in `actions`.
- **Animation:** none by default. Add it in your copy (e.g. wrap the headline in WMDS `TextSequence`, or ease the visual in with `motion`).

## Spacing

Section padding 48 / 64 top and bottom (phone / tablet and up), headline→subhead 24, subhead→CTAs 32, CTAs→visual 64, visual→logos 24 (the frame's faded foot already reads as space), logos→section bottom 48 / 64.

## WMDS-GAPs

- `--hero-glow` is a pattern knob, not an allow-listed WMDS knob.
- **No dark brand-surface version yet.** WMDS `Band` tones shipped in 0.4.28: for a dark hero on the brand surface, wrap the section in `<Band tone="inverse">` and give the CTA the light ink (a per-tone primary knob is also an open WMDS gap).
- CSS can't fit a headline to a line count; long headlines need a smaller size by hand.
- Checked against **@thewhatmatters/wmds 0.4.31** (npm).

**Alignment (Headings H8):** left-aligned on phones and tablets, where the centred headline would run past 2 lines; centred from desktop (`lg`), where it sets in 2. The subhead and CTA row follow it.

**Display copy (Rule 3, D7):** shorten, don't shrink. If your headline runs past 3 lines (2 on tablets) on phones, cut the words; keep the type step.
