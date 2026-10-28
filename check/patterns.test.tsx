/**
 * Every pattern folder (patterns/<type>/<variant>/) must render with the installed WMDS, ship its files,
 * import only WMDS and React, and have a row in SKILL.md. A WMDS change that breaks a pattern fails here.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..");
const patternsDir = join(root, "patterns");
const skill = readFileSync(join(root, "SKILL.md"), "utf8");

type ExampleModule = { default: ComponentType<{ nav?: undefined; as?: "h1" | "h2" }>; meta: { name: string; purpose: string; type: string } };
const examples = import.meta.glob<ExampleModule>("../patterns/*/*/example.tsx");

const folders = readdirSync(patternsDir).flatMap((type) =>
  readdirSync(join(patternsDir, type)).map((variant) => `${type}/${variant}`),
);

describe.each(folders)("patterns/%s", (folder) => {
  const dir = join(patternsDir, folder);
  const files = readdirSync(dir);

  it("ships example.tsx, README.md and light, dark and mobile screenshots", () => {
    for (const file of ["example.tsx", "README.md", "light.png", "dark.png", "mobile.png"]) {
      expect(files, `${folder}/${file}`).toContain(file);
    }
  });

  it("imports only @thewhatmatters/wmds, React and its own files", () => {
    for (const file of files.filter((name) => name.endsWith(".tsx"))) {
      const source = readFileSync(join(dir, file), "utf8");
      for (const [, from] of source.matchAll(/from "([^"]+)"/g)) {
        expect(from, `${folder}/${file}`).toMatch(/^(@thewhatmatters\/wmds|react|\.\/)/);
      }
    }
  });

  it("is listed in SKILL.md", () => {
    expect(skill).toContain(`patterns/${folder}`);
  });

  it("renders its example with the installed WMDS, with the landmarks its type needs", async () => {
    const load = examples[`../patterns/${folder}/example.tsx`];
    expect(load, `${folder}/example.tsx`).toBeDefined();
    const mod = await load();
    expect(mod.meta.name).toBeTruthy();
    expect(mod.meta.purpose).toBeTruthy();
    const Example = mod.default;
    const html = renderToString(<Example />);
    if (mod.meta.type === "Footer") {
      // A footer is the page's contentinfo landmark and never holds the page's h1.
      expect(html).toMatch(/<footer[\s>]/);
      expect(html).not.toMatch(/<h1[\s>]/);
    } else if (mod.meta.type === "Statement") {
      // A statement is a section with one heading (h2 by default, h1 when used as the hero) and no nav.
      expect(html).toMatch(/<section[\s>]/);
      expect(html.match(/<h[12][\s>]/g)).toHaveLength(1);
      expect(html).not.toMatch(/<nav[\s>]/);
      expect(renderToString(<Example as="h1" />).match(/<h1[\s>]/g)).toHaveLength(1);
    } else if (mod.meta.type === "Services") {
      // A services section sits further down the page: one h2 that names it, no h1 and no nav.
      expect(html).toMatch(/<section[^>]*aria-labelledby=/);
      expect(html.match(/<h2[\s>]/g)).toHaveLength(1);
      expect(html).not.toMatch(/<h1[\s>]/);
      expect(html).not.toMatch(/<nav[\s>]/);
    } else {
      // A hero holds the page's one h1, and renders no site nav when `nav` is left out.
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
      const bare = renderToString(<Example nav={undefined} />);
      expect(bare).not.toMatch(/<header[\s>]/);
      expect(bare).not.toMatch(/<nav[\s>]/);
    }
  });

  it("follows the Headings and Eyebrow rules that code can check", async () => {
    for (const file of files.filter((name) => name.endsWith(".tsx"))) {
      const source = readFileSync(join(dir, file), "utf8");
      // H5: no hyphenation in headings.
      expect(source, `${folder}/${file}: hyphens-auto`).not.toMatch(/\bhyphens-auto\b/);
      // E3: capitals track 0.08–0.12em (type-eyebrow carries its own).
      for (const [classList] of source.matchAll(/"[^"]*\buppercase\b[^"]*"/g)) {
        if (!/(^|\s)(type|font|text|tracking)-/.test(classList) || /type-eyebrow/.test(classList)) continue;
        const tracking = Number(classList.match(/tracking-\[([\d.]+)em\]/)?.[1]);
        expect(tracking >= 0.08 && tracking <= 0.12, `${folder}/${file}: ${classList}`).toBe(true);
      }
    }
    const Example = (await examples[`../patterns/${folder}/example.tsx`]()).default;
    const html = renderToString(<Example />);
    // H1: heading levels never skip.
    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map(([, level]) => Number(level));
    levels.forEach((level, i) => expect(level - (levels[i - 1] ?? level - 1), `${folder}: h${levels[i - 1]} → h${level}`).toBeLessThanOrEqual(1));
    // D3: display type is fluid — no one-off pixel or rem font sizes.
    for (const file of files.filter((name) => name.endsWith(".tsx"))) {
      const source = readFileSync(join(dir, file), "utf8");
      expect(source, `${folder}/${file}: one-off font size`).not.toMatch(/\btext-\[\d+(\.\d+)?(px|rem)\]/);
      // B2: running text is ragged right, never justified.
      expect(source, `${folder}/${file}: justified text`).not.toMatch(/\btext-justify\b|text-align:\s*justify/);
    }
    // E6: an eyebrow is never a heading element.
    expect(html, `${folder}: eyebrow as heading`).not.toMatch(/<h[1-6][^>]*data-slot="eyebrow"/);
    // D9: one display block per pattern at most (a page holds two display moments: the hero and one closing moment).
    const pattern = files.find((name) => name.endsWith(".tsx") && name !== "example.tsx");
    if (pattern) {
      const source = readFileSync(join(dir, pattern), "utf8");
      expect((source.match(/"[^"\n]*\btype-display-(?:hero|xl|[123])\b[^"\n]*"/g) ?? []).length, `${folder}: display steps`).toBeLessThanOrEqual(1);
      // D2: no pattern tracks display type tighter than -0.03em (the steps carry their own).
      for (const [, em] of source.matchAll(/tracking-\[(-[\d.]+)em\]/g)) expect(Number(em), `${folder}: tracking ${em}em`).toBeGreaterThanOrEqual(-0.03);
    }
    // B7: running text people read (a paragraph of 80+ characters) isn't set in 14px type-body or type-supporting;
    // those are for app UI and small print.
    for (const [, cls, text] of html.matchAll(/<p[^>]*class="([^"]*)"[^>]*>([^<]{80,})/g)) {
      expect(/\btype-(body|supporting)\b/.test(cls), `${folder}: running text on ${cls}: "${text.slice(0, 40)}…"`).toBe(false);
    }
    // E10: a pill eyebrow always links. The eyebrow is either a plain <p> label or holds an <a href>.
    for (const match of html.matchAll(/data-slot="eyebrow"[^>]*>\s*<([a-z]+)/g)) {
      if (match[1] === "p") continue;
      const slot = html.slice(match.index, match.index + 1500);
      expect(slot, `${folder}: eyebrow pill without a link`).toMatch(/<a [^>]*href="[^"]+"/);
    }
    // H8: a heading is centred on phones (a bare `text-center`, not `md:text-center`) only in patterns
    // measured to stay within 2 lines at 390 (2026-10-28). Others left-align below md.
    const centredOnPhones = ["hero/phone-center", "footer/over-image"];
    if (/<h[12][\s>]/.test(html) && !centredOnPhones.includes(folder)) {
      expect(html, `${folder}: heading centred on phones`).not.toMatch(/class="[^"]*(?<![:\w-])text-center\b/);
    }
  });
});

it("finds at least one pattern", () => {
  expect(folders.length).toBeGreaterThan(0);
  expect(existsSync(join(patternsDir, "hero", "feature-center"))).toBe(true);
});
