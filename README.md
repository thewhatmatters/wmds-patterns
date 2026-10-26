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

Patterns are grouped by type, each with its name, purpose and folder, so you can say "use hero/feature-center with no product visual". Toggle light/dark and 390 / 768 / 1440.

## Add a pattern

1. Make `patterns/<type>/<variant>/` with the pattern file, `example.tsx` (export `meta = { type, name, purpose }` and a default component), `README.md`, and the three screenshots.
2. Add its row to the index in `SKILL.md`.
3. Run `npm run check`. The gallery picks the folder up on its own.

Rules: import only from `@thewhatmatters/wmds` and React; parts that change per page are slots (`ReactNode` props); never bake in a nav (an optional `nav` slot at most); no animation by default; base WMDS type, shapes and colours.

## The check

`npm run check` typechecks every pattern against the installed WMDS, renders each example (one `h1`, no nav when `nav` is left out), checks each folder ships its files, imports only WMDS and React, and is listed in `SKILL.md`, then builds the gallery for Pages (`dist-pages/`).

## WMDS version

Checked against **@thewhatmatters/wmds 0.4.27**, pinned exactly in `package.json` and installed from npm (public, no token). When WMDS publishes a new version, bump the pin, run `npm run check`, and fix any pattern it breaks.

## GitHub Pages

The gallery is published at https://thewhatmatters.github.io/wmds-patterns/ by `.github/workflows/pages.yml` on every push to `main`: `npm ci`, then `npm run check` (which builds the gallery with `--mode pages`, base `/wmds-patterns/`), then deploy. Only the built gallery is published, with no source maps.

Locally: `npm run build:pages && npm run preview:pages` serves it at http://127.0.0.1:5191/wmds-patterns/.
