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
gallery/                      a plain viewer for people (npm run gallery)
check/                        the check (npm run check)
```

## See the patterns

```sh
npm install
npm run gallery     # http://127.0.0.1:5190
```

Patterns are grouped by type, each with its name, purpose, folder and status (draft or approved), so you can say "use hero/feature-center with no product visual". Toggle light/dark, 390 / 768 / 1440, and **Slots**: on, it outlines every slot in pink with its name (`Slot: nav (optional)`), so you can see what an agent fills. A pattern marks its slots with `data-slot="name"` (and `data-slot-optional`); the gallery draws the outlines, so copied code stays clean. **Measure**: on, it tints every padding (green), margin (orange) and gap (purple) with its size in px; hover an element to see its size and the class or WMDS token behind each value (`64 · md:!pt-16`, `24 · grid-page --grid-margin`). **Fonts**: pick any Google Font for headings, body and mono (type to search ~1,800 families); it sets the WMDS font knobs (`--font-family-heading`, `--font-family-body`, `--font-family-code`) inside the preview only, so the pattern's code doesn't change. Only the picked families load; the list itself (`gallery/fonts.json`, refresh with `node scripts/google-fonts.mjs`) loads when the panel opens. The choice stays in the address, so a link shares it. A pattern whose example suits one theme sets `themes` in its `meta` and shows in that theme only.

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
2. **Review:** run `npm run gallery` from that branch and give Randy the Cadre preview link. He gives feedback there; change the code and he sees it live. Re-shoot the PNGs when the back-and-forth settles.
3. **Approve:** when Randy approves, set `status: approved` in the pattern's README and tell Claude Code on the Mini, which merges to `main` and pushes, and GitHub Pages publishes it. Teammates never push.
4. **WMDS gaps:** if a pattern needs something WMDS can't do, mark it `WMDS-GAP` in the pattern's README. The fix goes into WMDS on its own branch and is reviewed in Storybook as usual. The pattern picks it up in the next WMDS release: bump the pinned version, and the check confirms it. Never patch around a gap in the pattern.

**Rules:**
- Import only from `@thewhatmatters/wmds` and React.
- Parts that change per page are slots (`ReactNode` props).
- Never bake in a nav: an optional `nav` slot at most.
- No animation by default.
- Base WMDS type, shapes and colours.

## The check

`npm run check` typechecks every pattern against the installed WMDS, renders each example (one `h1`, no nav when `nav` is left out), checks each folder ships its files, imports only WMDS and React, and is listed in `SKILL.md`, then builds the gallery for Pages (`dist-pages/`).

## WMDS version

Checked against **@thewhatmatters/wmds 0.4.28**, pinned exactly in `package.json` and installed from npm (public, no token). When WMDS publishes a new version, bump the pin, run `npm run check`, and fix any pattern it breaks.

## GitHub Pages

The gallery is published at https://thewhatmatters.github.io/wmds-patterns/ by `.github/workflows/pages.yml` on every push to `main`: `npm ci`, then `npm run check` (which builds the gallery with `--mode pages`, base `/wmds-patterns/`), then deploy. Only the built gallery is published, with no source maps.

Locally: `npm run build:pages && npm run preview:pages` serves it at http://127.0.0.1:5191/wmds-patterns/.
