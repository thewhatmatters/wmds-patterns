# Journal — Hover Index

status: draft

After United Carriers' "What's moving in your industry" (details.so, https://www.details.so/inspo/unitedcarriers-702f7b), with the two-tone heading from Atlas (Inspiration board). Nothing copied but the idea: the latest posts as a quiet ruled index. Laid out like a table (Randy, 2026-11-06): the date in its own columns, the title across the width, the post's tags and an arrow at the end, and a hover state on every row.
**File:** `JournalHoverIndex.tsx` (copy it). **Example:** `example.tsx`, six made-up posts, one on another site.

A WMDS `Band`: a two-tone heading on the left half (a muted first line, then the rest in ink), an intro and one action on the right half (column 7), then the posts as a WMDS `IndexList` on the page grid (`columns="page"`): the date in the first two columns, the title (`h3`, `type-heading-3`) across the width, then the tags (WMDS `Badge`s) and an arrow, → for a post here, ↗ for one elsewhere (opens a new tab). Each row is one link with a quiet fill on hover and keyboard focus.

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
    { title: "Why the bakery's new site sells out by noon", href: "/journal/bakery", date: <time dateTime="2026-10-29">29 Oct</time>, tags: ["Case study"] },
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
| `posts` | array | 4–8 posts: `title`, `href`, `date` (a `<time>`), optional `tags` (one or two short words each, shown as badges at the row's end) and `external` (the post is on another site: ↗, opens a new tab) |
| `tone` | `"default"` (default), `"inverse"`, `"field"` | The WMDS Band tone |

## Rows

- **Layout:** on the page grid, like a table: date in columns 1–2 (from md), title across, tags and arrow in the last three columns at desktop (two on tablets). On phones the date and tags sit on one line over the title, the arrow at the end.
- **Hover and focus:** the whole row is one link (one hit area); a quiet fill lights the row under the pointer and on keyboard focus, and the arrow nudges toward where it goes. Nothing moves under reduced motion beyond that fill.

## Knobs

- `size="sm"` on the IndexList (titles two steps under the h2); badge `emphasis` (outline by default).

## Adapt it

The first item is the example the gallery's Copy prompt uses.

- **Your posts:** 4–8 latest, each with its date and one tag (two at most); mark posts on other sites `external`.
- **One-tone heading:** pass the whole heading in `heading` and an empty `lead`.

## Spacing

Full width; Band `md` spacing (48 top and bottom); header → list 40 / 64 (phone / md and up); IndexList rows as WMDS sets them.

## WMDS

Built on **@thewhatmatters/wmds** with `IndexList` `columns="page"` and `IndexList.Item` `tags`, `arrow`, `external` (WMDS branch `lead-engineer/indexlist-rows`, after 0.4.47; the pin bump follows its release): `Band`, `IndexList`, `Badge`; the example adds `Button`. No Motion import.

- **Check change:** `npm run check` has a rule for the new Journal type (one h2, every post title an `h3` link, no h1, no nav).
