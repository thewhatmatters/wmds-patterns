# wmds-patterns

Page patterns built on [WMDS](https://github.com/thewhatmatters/wmds) (`@thewhatmatters/wmds`): heroes, footers, content boxes and other page sections that agents **copy and adapt**. A pattern is a starting point, not a component: it lives here, not in WMDS or its Storybook.

The repo is also a skill: `SKILL.md` is the index an agent reads first. It opens only the pattern it needs.

## Layout

```
SKILL.md                      the index: frontmatter + one row per pattern (purpose, use when, don't use when, folder)
patterns/<type>/<variant>/    one folder per pattern
  <Name>.tsx                  the code to copy; imports only @thewhatmatters/wmds and React
  example.tsx                 the pattern filled with placeholder content; exports `meta` and a default component
  README.md                   slots, props, knobs, how to adapt it, WMDS-GAPs, status
  light.png dark.png mobile.png   1440 light, 1440 dark, 390 light
gallery/                      what the gallery (wmds-gallery) reads from here: Copy code / Copy prompt helpers, the Measure overlay, the font list, the example media
check/                        the check (npm run check)
```

## See the patterns

In the gallery, **https://wmds-gallery.vercel.app** (repo `thewhatmatters/wmds-gallery`, private): every pattern on `main`, one page each, with light/dark, the six review widths (320 / 390 / 786 / 1024 / 1440 / 1920; 390 and 1440 are the screenshot widths), **Slots** (outlines each `data-slot` in pink with its name), **Measure** (padding green, margin orange, gap purple, with the class or WMDS token behind each value), the **Type** panel (any Google Font for headings, body and mono, set through the WMDS font knobs, so the pattern's code doesn't change) and a **Variant** control for patterns with `meta.variants`. The view lives in the address, so a link shares it.

This repo has no viewer of its own any more: one gallery, the one people see (Randy, 2026-10-31). To look at a branch before it merges, run it in the gallery: `npm run dev:local -- <path to this checkout>` in wmds-gallery serves your checkout live at `http://<mac>.local:5200`.

Each pattern has two buttons:
- **Copy code** copies the pattern's `.tsx` file as it is in the repo, under a three-line header: the pattern, `npm i @thewhatmatters/wmds@<pinned>`, and the styles import. It works pasted anywhere (v0, Lovable, a developer).
- **Copy prompt** copies a short brief for a Cadre teammate or Claude Code, with blanks for the client and page, the copy and the changes. It's generated from the pattern's folder and README, so nobody writes it by hand.

## How we add or change a pattern

Patterns are built and reviewed here, not in WMDS's Storybook.

**Who builds it**
- **Lead Engineer builds patterns alone**, after loading the house-taste and emil-design-eng skills.
- **Product Designer comes in only for:**
  - **a new type of pattern** (the first footer, the first content box): one short spec up front on its structure and parts;
  - **one review pass before Randy sees a new pattern:** break-ui with worst-case content, 390px and accessibility. Fix what it finds, then send Randy the gallery link.
- **Skip Product Designer** for small variants and changes to an existing pattern.
- **Randy gives the design direction** in the gallery. Keep teammate hand-offs to that one review (it stays clear of Cadre's bot-to-bot hop limit).

**The flow**
1. **Build:** one branch per new pattern or change, named `<type>/<variant>` (e.g. `hero/split-image`). Make `patterns/<type>/<variant>/` with:
   - the pattern file;
   - `example.tsx`, exporting `meta = { type, name, purpose, themes? }` and a default component;
   - `data-slot` (and `data-slot-optional`) on each slot's element, for the gallery's Slots view;
   - `README.md`, with `status: draft`, a "Slots and props" table and an "Adapt it" list, whose first item is the example Copy prompt uses;
   - the three screenshots.

   Add its row to the index in `SKILL.md`, and run `npm run check`. The gallery picks the folder up on its own.
2. **Review:** in wmds-gallery run `npm run dev:local -- <this checkout>` and give Randy the link (`http://Bos-Mac-mini.local:5200/<type>/<variant>`). He gives feedback there; change the code and he sees it live. Re-shoot the PNGs when the back-and-forth settles.
3. **Approve:** when Randy approves, set `status: approved` in the pattern's README and merge to `main` and push; then bump the wmds-patterns commit wmds-gallery pins, and Vercel publishes it.
4. **WMDS gaps:** if a pattern needs something WMDS can't do, mark it `WMDS-GAP` in the pattern's README. The fix goes into WMDS on its own branch and is reviewed in Storybook as usual. The pattern picks it up in the next WMDS release: bump the pinned version, and the check confirms it. Never patch around a gap in the pattern.

**Rules:**
- Import only from `@thewhatmatters/wmds` and React.
- Parts that change per page are slots (`ReactNode` props).
- Never bake in a nav: an optional `nav` slot at most.
- No animation by default.
- Base WMDS type, shapes and colours.

## The check

`npm run check` typechecks every pattern against the installed WMDS, renders each example (one `h1`, no nav when `nav` is left out), checks each folder ships its files, imports only WMDS and React, and is listed in `SKILL.md`.

## WMDS version

Checked against **@thewhatmatters/wmds 0.4.33**, pinned exactly in `package.json` and installed from npm (public, no token). When WMDS publishes a new version, bump the pin, run `npm run check`, and fix any pattern it breaks.
