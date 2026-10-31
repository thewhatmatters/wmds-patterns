# Hero — Stage

status: draft

One hero for two jobs (Randy, 2026-10-30). It replaces **Hero — Feature Center** and **Hero — Over Media**, which stay in the gallery marked as replaced until this one is approved.
**File:** `HeroStage.tsx` (copy it). **Example:** `example.tsx`, in six variants (the gallery's **Variant** control). The backdrop variants use Randy's Envato pick ("Blurred Restaurant Interior With Bartender in Background"), licensed for the private gallery and kept in `gallery/public/local/`, never committed here; without it the hero shows the dark page colour under the scrim.

Two choices make the layouts:

- **`backdrop`**: none (the page colour), or a full-width `image` or looping `video` behind the copy under a scrim, in the dark-theme scope.
- **`align`**: the copy at the `start`, `center` or `end`. `end` only over a backdrop, for a photo whose subject sits on the left: on a plain page right-aligned copy is hard to read (every line starts somewhere else), so `end` falls back to `start` there. Phones and tablets are always `start` (a centred headline runs 3–4 lines there, Headings H8).

The framed product window (`visual`, lit from behind) and the proof row (`logos`) are optional with or without a backdrop.

| Light | Dark | Mobile (390) |
|---|---|---|
| ![](light.png) | ![](dark.png) | ![](mobile.png) |

## When to use it (Hero R7)

- **Page, centred, with a window and logos:** a product or service with a screen or site to show, and proof under it (was Feature Center).
- **Page, start:** the same, set editorially left.
- **Backdrop, start:** food, places, a room people come to: when the atmosphere is the pitch (was Over Media).
- **Backdrop, centre or end:** the same, when the picture's subject sits on the other side.

For a services business with real work beside the pitch, use **Hero — Split**; for an app, **Hero — Phone Center**.

## Use it

```tsx
import { Button } from "@thewhatmatters/wmds";
import { HeroStage } from "./HeroStage";

<HeroStage
  eyebrow="East 6th · Austin"
  headline="Wood-fired Sonoran food on East 6th."
  lead="Open late Thursday to Saturday."
  actions={
    <>
      <Button role="primary" size="lg" render={<a href="/book" />}>Book a table</Button>
      <Button role="outline" size="lg" render={<a href="/menu" />}>See the menu</Button>
    </>
  }
  backdrop={{ kind: "video", src: "/room.mp4", poster: "/room.jpg", focus: "50% 40%" }}
  // or backdrop={{ kind: "image", media: <img src="/room.jpg" alt="" width={2400} height={1600} /> }}
  align="start"
/>
```

## Slots and props

| Prop | Kind | Notes |
|---|---|---|
| `nav` | slot, optional | Leave it empty when the page already has a nav |
| `eyebrow` | ReactNode | Optional. 1–3 words in sentence case, 12px above the headline. Plain `type-eyebrow` unless `eyebrowHref` is set (then one outlined pill link with an arrow, E10) |
| `eyebrowHref` | string, optional | Where the eyebrow links |
| `headline` | ReactNode | The page's only H1: 12 words at most, 2 lines at desktop. WMDS `type-display-1` |
| `lead` | ReactNode | Optional. 1–2 sentences, in ink |
| `actions` | slot | The CTA row: one WMDS `<Button role="primary" size="lg">` and at most one `role="outline"` (R2, U7). Over a backdrop the outline's border is the light ink, 3:1 or more |
| `backdrop` | `{ kind: "image", media, focus? }` or `{ kind: "video", src, poster?, focus? }`, optional | Leave it out for the page colour. `media` is a decorative `<img alt="">` with width and height, cropped to fill. The video is muted, loops, plays only on screen and holds its poster under reduced motion. `focus` keeps a part of the picture in view as it crops |
| `align` | `"start"` \| `"center"` \| `"end"` | Default `center` on a plain page, `start` over a backdrop. From desktop the copy takes 8 columns (2 headline lines): start = 1–8, centre = 3–10, end = 5–12. `end` needs a backdrop |
| `visual` | slot, optional | What goes in the framed window (a product shot, a site). Over a backdrop the copy moves to the top of the picture and the scrim covers evenly |
| `logos` | slot, optional | Usually `<HeroStageLogos logos={…} />`: one muted row, 3 per row on phones and 6 from desktop |
| `fullHeight` | boolean, default `false` | Backdrop only: the screen height less 64px, with a scroll cue (R9, R4) |

## Contrast (D8, R5)

Over a backdrop the scrim is the dark page colour, 90% at the bottom, 74% halfway, clear at the top; with a `visual` the copy sits at the top and the scrim is an even 80%. Worst pixel behind each part on the example picture (one frame of the video, 2026-10-30):

| Variant | Headline 1440 / 390 | Lead 1440 / 390 |
|---|---|---|
| Video · start | 6.0 / 3.7 | 11.3 / 8.9 |
| Photo · centre | 4.7 / 3.7 | 13.9 / 12.8 |
| Photo · end | 4.7 / 3.7 | 12.5 / 12.8 |
| Video · window | 10.4 / 11.3 | 10.4 / 15.6 |

The headline is display type, so 3:1 is the floor (WCAG 1.4.3 large text); the lead needs 4.5:1. For your own footage, check the brightest frame, not the poster; if the headline drops under 3:1, raise the scrim's middle stop.

## Adapt it

The first item is the example the gallery's Copy prompt uses.

- **Restaurant over its room:** `backdrop={{ kind: "video", … }}`, `align="start"`, no `visual` or `logos`.
- **Product with proof:** no backdrop, `align="center"`, `visual={<YourScreen />}`, `logos={<HeroStageLogos logos={clients} />}`.
- **Subject on the left of the photo:** `align="end"` with a backdrop, and `focus` to keep the subject in view on phones.
- **Animation:** none beyond the video. A video over 5 seconds that a page needs paused should get a pause control in your page (WCAG 2.2.2).

## WMDS-GAPs

- **Media component:** no WMDS image or video component with a focal point, a poster under reduced motion and a pause control; the pattern carries its own small player until WMDS has one.
- Checked against **@thewhatmatters/wmds 0.4.35** (npm).
