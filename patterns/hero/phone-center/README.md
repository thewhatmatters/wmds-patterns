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
  video={{ src: "/hero.mp4", poster: "/hero.jpg" }}   // or media={<img src="/hero.jpg" alt="" />}
  screen="Face scan in progress…"
/>
```

## Slots and props

| Prop | Kind | Notes |
|---|---|---|
| `nav` | slot, optional | Leave it empty when the page already has a nav (the usual case). For a standalone page pass a `<SiteNav>` |
| `eyebrow` | ReactNode | A short line shown as a pill (Badge). About 30 characters; longer is cut with an ellipsis |
| `headline` | ReactNode | The page's only H1, narrow like the phone: WMDS `type-display-2` (32px → 50px) set tight (-0.035em, line height 1.05), about 11em wide, 2–3 lines. Static. `hyphens-auto` needs the page's `lang` |
| `subhead` | ReactNode | One short line, about 40 characters (like Lovi's). Regular weight |
| `actions` | slot, optional | The CTA row: at most two buttons (make a third a text link) or app-store badges. On phones they stack full width |
| `media` | slot | The picture behind the phone, usually decorative: `<img src alt="">` (give real alt text only if it carries meaning). Cropped to fill the stage (`object-cover`) and faded at every edge |
| `video` | `{ src, poster? }`, optional | A looping background video instead of `media`: muted, `playsInline`, hidden from screen readers, with a **Pause / Play** button (WCAG 2.2.2). It doesn't start on its own under `prefers-reduced-motion` |
| `screen` | slot, optional | A short caption on the phone's screen: about 40 characters, 3 lines at most, on a scrim so it reads over any picture. If it changes (a status), wrap it in `aria-live="polite"` |

## Knobs

- `--text-display-2-size`: the headline uses WMDS `type-display-2` (fluid 32px → 50px).
- The phone's width is `clamp(15rem, 24vw, 20rem)` and the stage's height `clamp(26rem, 52vw, 40rem)`, in `phoneClasses` and `stageClasses`: change them together.
- The phone frame takes its bezel from `--color-surface` and its outline from `--color-border-emphasized`, so it follows the theme and the brand kit.

## Adapt it

The first item is the example the gallery's Copy prompt uses.

- **App screen instead of a caption:** put a screenshot or a live UI in `screen`, and drop or dim `media`.
- **Different copy:** change the props; keep the headline to about three lines.
- **Video:** pass `video={{ src, poster }}`; the pattern adds the Pause / Play button and holds it still under reduced motion.
- **No media:** leave `media` and `video` empty; the phone stands on the page alone, its screen filled.
- **App-store badges:** put them in `actions` (official badge artwork, each a link with an accessible name).
- **Animation:** none by default. Add it in your copy (e.g. ease the phone up into place with `motion`).

## Spacing

Nav→eyebrow 48 / 96 (phone / desktop), headline→subhead 24, subhead→CTAs 32, CTAs→stage 40 / 64. The stage is `clamp(26rem, 52vw, 40rem)` tall and fades out over its last 28%.

## WMDS-GAPs

- No WMDS media component (image or video with poster, a pause control, reduced-motion handling); the pattern carries its own small video player until WMDS has one.
- No WMDS device frame; the iPhone outline is SVG inside the pattern.
- Checked against **@thewhatmatters/wmds 0.4.27** (npm). In 0.4.27 `type-large` is semibold, so the subhead sets `font-normal` itself.
