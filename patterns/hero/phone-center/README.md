# Hero — Phone Center

status: draft

Structure from lovi.care's hero (Randy's reference, 2026-10-26); nothing copied but the idea.
**File:** `HeroPhoneCenter.tsx` (copy it). **Example:** `example.tsx` (abstract gradient standing in for a real photo or video).

A centred hero for an app or a mobile-first service: an eyebrow pill, a headline, a subhead and a CTA row, then a wide photo or video that fades into the page, with an iPhone frame over its centre. The media shows through the phone's glass screen, and a caption can sit on the screen. The whole stage fades out at its foot, like a fold.

| Light | Dark | Mobile (390) |
|---|---|---|
| ![](light.png) | ![](dark.png) | ![](mobile.png) |

## Use it

```tsx
import { Button } from "@thewhatmatters/wmds";
import { HeroPhoneCenter } from "./HeroPhoneCenter";

// Under the page's existing nav: leave `nav` empty.
<HeroPhoneCenter
  eyebrow="Winner · Beauty Innovation Award"
  headline="Science-backed skin care you can trust"
  subhead="Focused on you and your skin."
  actions={<Button role="primary" render={<a href="/app" />}>Get the app</Button>}
  media={<video src="/hero.mp4" poster="/hero.jpg" autoPlay muted loop playsInline />}
  screen={<p className="type-large font-normal">Face scan in progress…</p>}
/>
```

## Slots and props

| Prop | Kind | Notes |
|---|---|---|
| `nav` | slot, optional | Leave it empty when the page already has a nav (the usual case). For a standalone page pass a `<SiteNav>` |
| `eyebrow` | ReactNode | A short line shown as a pill (Badge) |
| `headline` | ReactNode | The page's only H1. Static. Set in 2–3 lines (about 12em wide) |
| `subhead` | ReactNode | Regular weight, about 36rem wide |
| `actions` | slot, optional | The CTA row: buttons, links or app-store badges |
| `media` | slot | The photo or video behind the phone: an `<img>` or a muted, looping, `playsInline` `<video>` with a `poster`. Cropped to fill the stage (`object-cover`) and faded at every edge. Decorative unless you give it a text alternative |
| `screen` | slot, optional | What sits on the phone's screen over the media: a caption, a status line, or a real app screen |

## Knobs

- `--text-display-1-size`: the headline uses WMDS `type-display-1` (fluid 40px → 80px).
- The phone's width is `clamp(15rem, 24vw, 20rem)` and the stage's height `clamp(26rem, 52vw, 40rem)`, in `phoneClasses` and `stageClasses`: change them together.
- The phone frame takes its bezel from `--color-surface` and its outline from `--color-border-emphasized`, so it follows the theme and the brand kit.

## Adapt it

The first item is the example the gallery's Copy prompt uses.

- **App screen instead of a caption:** put a screenshot or a live UI in `screen`, and drop or dim `media`.
- **Different copy:** change the props; keep the headline to about three lines.
- **Video:** pass a muted, looping, `playsInline` `<video>` with a `poster`. Pause it under `prefers-reduced-motion` in your page (the pattern can't).
- **No media:** leave `media` empty; the phone stands on the page alone.
- **App-store badges:** put them in `actions` (official badge artwork, each a link with an accessible name).
- **Animation:** none by default. Add it in your copy (e.g. ease the phone up into place with `motion`).

## Spacing

Nav→eyebrow 48 / 96 (phone / desktop), headline→subhead 24, subhead→CTAs 32, CTAs→stage 64. The stage is `clamp(26rem, 52vw, 40rem)` tall and fades out over its last 28%.

## WMDS-GAPs

- No WMDS media component (image or video with poster, reduced-motion pause); the `media` slot takes plain `<img>` / `<video>`.
- No WMDS device frame; the iPhone outline is SVG inside the pattern.
- Checked against **@thewhatmatters/wmds 0.4.27** (npm). In 0.4.27 `type-large` is semibold, so the subhead sets `font-normal` itself.
