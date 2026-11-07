# Journal — Hover Index

status: approved

After United Carriers' "What's moving in your industry" (details.so, https://www.details.so/inspo/unitedcarriers-702f7b), with the two-tone heading from Atlas (Inspiration board). Nothing copied but the idea: the latest posts as a quiet ruled index. Laid out like a table (Randy, 2026-11-06): the date in its own columns, the title across the width, the post's tags at the end, a fill on the hovered row, and a small cover that follows the mouse over the row it's on. No arrows.
**File:** `JournalHoverIndex.tsx` (copy it). **Example:** `example.tsx`, six made-up posts (one on another site) with cut-paper SVG covers in WMDS chart colours (licence-free).

A WMDS `Band`: a two-tone heading on the left half (a muted first line, then the rest in ink), an intro and one action on the right half (column 7), then the posts as a WMDS `IndexList` on the page grid (`columns="page"`): the date in the first two columns, the title (`h3`, `type-heading-3`) across the width, then the tags (WMDS `Badge`s). Each row is one link (`rowLink`) with a quiet fill on hover and keyboard focus; a post elsewhere opens a new tab. With a mouse, a 360px, 16:9 cover of the post under the pointer trails beside it on a spring.

| Light | Dark | Mobile (390) |
|---|---|---|
| ![](light.png) | ![](dark.png) | ![](mobile.png) |

## Use it

```tsx
import { Button } from "@thewhatmatters/wmds";
import { JournalHoverIndex } from "./JournalHoverIndex";

<JournalHoverIndex
  lead="What's new"
  heading="in the studio."
  actions={<Button role="outline" size="lg" render={<a href="/journal" />}>Read the journal</Button>}
  posts={[
    { title: "Why the bakery's new site sells out by noon", href: "/journal/bakery", date: <time dateTime="2026-10-29">29 Oct</time>, tags: ["Case study"], cover: <img src="/covers/bakery.jpg" alt="" /> },
    // 4–8 posts
  ]}
/>
```


## Slots and props

| Prop | Kind | Notes |
|---|---|---|
| `lead` | ReactNode | The heading's first, quiet part ("What's new"), muted |
| `heading` | ReactNode | The heading's second part ("in the studio."), ink. Both make the section's `h2` |
| `intro` | ReactNode | Optional: one sentence on the right half (`type-lead`) |
| `actions` | slot, optional | One action under the intro: a WMDS outline `<Button size="lg">` to the full journal |
| `posts` | array | 4–8 posts: `title`, `href`, `date` (a `<time>`), optional `tags` (one or two short words each, shown as badges at the row's end), `external` (the post is on another site: opens a new tab) and `cover` (slot: an `<img alt="">`, decorative, follows the pointer) |
| `tone` | `"default"` (default), `"inverse"`, `"field"` | The WMDS Band tone |

## Rows and motion

- **Layout:** on the page grid, like a table: date in columns 1–2 (from md), title across, tags in the last three columns at desktop (two on tablets). On phones the date and tags sit on one line over the title.
- **Hover and focus:** the whole row is one link (one hit area); a quiet fill lights the row under the pointer and on keyboard focus.
- **Cover:** while a mouse is over a row with a cover, the cover sits 32px right of the pointer, centred on it, and trails it on a spring (stiffness 260, damping 28); it scales and fades in and out over 180ms. Only with a fine pointer that can hover, never under reduced motion; it's `aria-hidden` and never catches clicks.

The app needs `motion` (the WMDS peer) installed.

## Knobs

- `size="sm"` on the IndexList (titles two steps under the h2); badge `emphasis` (outline by default); `w-90` (cover width), `aspect-video`, `translate-x-8` (gap from the pointer), the spring values.

## Adapt it

The first item is the example the gallery's Copy prompt uses.

- **Your posts:** 4–8 latest, each with its date, one tag (two at most) and its cover image (`alt=""`; it's cropped to 16:9); mark posts on other sites `external`. Leave `cover` out and the rows stand on their own.
- **One-tone heading:** pass the whole heading in `heading` and an empty `lead`.

## Spacing

Full width; Band `md` spacing (48 top and bottom); header → list 40 / 64 (phone / md and up); IndexList rows as WMDS sets them.

## WMDS

Built on **@thewhatmatters/wmds 0.4.48** (npm, IndexList `columns="page"`, Item `tags` and `rowLink` new in 0.4.48): `Band`, `IndexList`, `Badge`; the example adds `Button`. Motion **13.5.1** (the WMDS peer).

- **Check change:** `npm run check` has a rule for the new Journal type (one h2, every post title an `h3` link, no h1, no nav).
