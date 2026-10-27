---
name: wmds-patterns
description: Page patterns built on WMDS (@thewhatmatters/wmds) to copy and adapt. Use whenever building or editing a landing page, marketing site, hero, footer, content box, feature section or any web page section with WMDS. Read the index, open only the pattern that fits, copy its code into the app and adapt it to the request.
---

# WMDS patterns

A pattern is a **starting point**: a page section composed from WMDS parts, in the base WMDS type, shapes and colours. Copy it into the app, then change it to fit the request (copy, logo count, a marquee instead of a logo row, no product visual, a different CTA). It is not a WMDS component: never import it from WMDS, and never ask WMDS to add props for a one-off change. Edit your copy.

## How to use

1. Pick a pattern from the index below by its purpose and "use when".
2. Open its folder. Read `README.md` (slots, props, knobs, how to adapt), look at `light.png`, `dark.png` and `mobile.png`.
3. Copy the pattern file (e.g. `HeroFeatureCenter.tsx`) into the app's components. `example.tsx` shows it filled in; copy from it too if useful.
4. The app needs `@thewhatmatters/wmds` and its styles (`import "@thewhatmatters/wmds/styles.css"`), and its Tailwind must scan the copied file.
5. Fill the slots. Leave optional slots empty rather than inventing content. **Never add a second nav:** if the page has a nav, leave the pattern's `nav` slot empty.
6. Brand differences go through WMDS knobs (brand.css), not per-component class overrides.

## Index

Patterns marked draft aren't approved yet: prefer approved ones, and say so if you use a draft.

| Pattern | Purpose | Use when | Don't use when | Folder |
|---|---|---|---|---|
| Hero — Feature Center | Centred pitch and CTAs over the product in a backlit frame, then a row of client logos | The first screen of a site that sells a product or service and has a product shot or site to show, with proof (logos) under it | The hero is mostly a photo or video, an article or app screen, or an editorial left-aligned layout is wanted | `patterns/hero/feature-center` |
| Hero — Phone Center | Centred pitch and CTAs over a wide photo or video, with an iPhone frame showing the app in the middle | An app or mobile-first service whose story is what happens on the phone, with a photo or video to set the mood | There's no phone to show, or the product is a desktop app or a website (use hero/feature-center) | `patterns/hero/phone-center` |
| Footer — Landscape | Calm footer on the muted background: brand, live world clocks, link columns, a fact strip, and a landscape drawn live in dots from a video | A product or studio site that wants a quiet footer with one memorable moment at the bottom | A dense sitemap footer with many columns, or a page with no room for motion | `patterns/footer/landscape` |
| Statement — Inline Pills | One big centred sentence with its key words in soft pills, each with a small picture that pops in on scroll (opt-in) | A playful hero (`as="h1"`) or an intro / what-we-do statement under the hero, for a brand with three or so things to name | Long copy, more than about four pills, or a serious product where the pop-in would feel flippant | `patterns/statement/inline-pills` |

## Conventions

- Folders are `patterns/<type>/<variant>/` (hero, statement, footer, content-box, …). A **statement** is a full-width section built around one big sentence: an intro under the hero, or the hero itself.
- Slots are `ReactNode` props for the parts that change per page (`nav`, `actions`, `visual`, `logos`). Optional slots render nothing when empty.
- **WMDS base colours only** (tokens like `text-fg`, `text-muted`, `--color-background-muted`); no hex tints from a reference. Brands change colours in their own stylesheet.
- **WMDS components first** (`Button`, `IconButton`, `TextLink`, `Status`, …). If a pattern needs a part WMDS doesn't have, it's a WMDS gap: raise it, don't hand-build a lookalike.
- **Sections are full viewport width** with consistent vertical padding: 64px (4rem) top and bottom on desktop, 48px on phones.
- Patterns import only from `@thewhatmatters/wmds` and React. Nothing animates by default; add motion in the page if the request asks for it.
- Each pattern is checked against the WMDS version in `README.md` (`npm run check`).
