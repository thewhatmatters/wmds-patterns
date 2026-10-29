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
    } else if (mod.meta.type === "Header") {
      // A header is the page's banner landmark with its nav; it never holds the page's h1.
      expect(html).toMatch(/<header[\s>]/);
      expect(html).toMatch(/<nav[\s>]/);
      expect(html).not.toMatch(/<h1[\s>]/);
    } else if (mod.meta.type === "Testimonial") {
      // A testimonial section: one h2 that names it, no h1 and no nav; each quote is a figure with its caption.
      expect(html.match(/<h2[\s>]/g)).toHaveLength(1);
      expect(html).not.toMatch(/<h1[\s>]/);
      expect(html).not.toMatch(/<nav[\s>]/);
      expect(html).toMatch(/<figure[\s>][\s\S]*<blockquote[\s>][\s\S]*<figcaption[\s>]/);
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
    const mod = await examples[`../patterns/${folder}/example.tsx`]();
    const Example = mod.default;
    const html = renderToString(<Example />);
    // H1: heading levels never skip.
    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map(([, level]) => Number(level));
    levels.forEach((level, i) => expect(level - (levels[i - 1] ?? level - 1), `${folder}: h${levels[i - 1]} → h${level}`).toBeLessThanOrEqual(1));
    // D3: display type is fluid — no one-off pixel or rem font sizes.
    for (const file of files.filter((name) => name.endsWith(".tsx"))) {
      const source = readFileSync(join(dir, file), "utf8");
      expect(source, `${folder}/${file}: one-off font size`).not.toMatch(/\btext-\[\d+(\.\d+)?(px|rem)\]/);
      // W5 / W4: the page keeps the default --grid-max (reading it, as a bleed does, is fine; setting it isn't),
      // and nothing has a fixed width wider than a phone.
      expect(source, `${folder}/${file}: --grid-max override`).not.toMatch(/--grid-max\s*:/);
      expect(source, `${folder}/${file}: fixed width`).not.toMatch(/(?<![\w-])(?:min-)?w-\[(?:3[2-9]\d|[4-9]\d\d|\d{4,})px\]/);
      // G7: the page keeps one column count; a pattern never sets --grid-cols on a section.
      expect(source, `${folder}/${file}: --grid-cols override`).not.toMatch(/--grid-cols/);
      // G4: a responsive col-span doesn't silently reset a col-start set at a smaller breakpoint.
      for (const [classList] of source.matchAll(/"[^"\n]*col-(?:span|start)-[^"\n]*"/g)) {
        const tokens = classList.slice(1, -1).split(/\s+/);
        const at = (kind: string) => new Set(tokens.filter((t) => new RegExp(`^(\\w+:)?col-${kind}-`).test(t)).map((t) => t.match(/^(\w+:)/)?.[1] ?? ""));
        const order = ["", "sm:", "md:", "lg:", "xl:", "2xl:"];
        const starts = at("start");
        if (starts.size === 0) continue;
        const lowest = Math.min(...[...starts].map((bp) => order.indexOf(bp)));
        for (const bp of at("span")) {
          if (order.indexOf(bp) > lowest) expect(starts.has(bp), `${folder}/${file}: ${bp}col-span without ${bp}col-start in ${classList}`).toBe(true);
        }
      }
      // S1: spacing comes from the scale or a token, never a one-off pixel value.
      expect(source, `${folder}/${file}: one-off spacing`).not.toMatch(/(?<![\w-])-?(?:p|m|gap|space)[xytrblse]?(?:-[xy])?-\[-?\d+(\.\d+)?px\]/);
      // B2: running text is ragged right, never justified.
      expect(source, `${folder}/${file}: justified text`).not.toMatch(/\btext-justify\b|text-align:\s*justify/);
    }
    // K1 / K8 / K9: links go somewhere, say where, and a new tab says so.
    for (const [, anchor, inner] of html.matchAll(/<a\b((?:"[^"]*"|'[^']*'|[^>"'])*)>([\s\S]*?)<\/a>/g)) {
      expect(anchor, `${folder}: link without href`).toMatch(/\shref="[^"]+"/);
      const text = inner.replace(/<(?:"[^"]*"|'[^']*'|[^>"'])*>/g, "").trim();
      expect(text, `${folder}: generic link text`).not.toMatch(/^(learn more|read more|click here|more)$/i);
      if (/target="_blank"/.test(anchor)) expect(text, `${folder}: new tab not announced`).toMatch(/opens in a new tab/i);
    }
    // U2 / U9: every button has a type, and labels aren't vague or shouted.
    // Attribute values may hold ">" (Tailwind's `[&>svg]`), so tags are matched quote-aware.
    const stripTags = (markup: string) => markup.replace(/<(?:"[^"]*"|'[^']*'|[^>"'])*>/g, "").trim();
    for (const [, tag, inner] of html.matchAll(/<button\b((?:"[^"]*"|'[^']*'|[^>"'])*)>([\s\S]*?)<\/button>/g)) {
      expect(tag, `${folder}: button without type`).toMatch(/\stype="(button|submit|reset)"/);
      const label = stripTags(inner);
      expect(label, `${folder}: vague button label`).not.toMatch(/^(submit|ok|click here|go)$/i);
      expect(label, `${folder}: exclamation in a button`).not.toMatch(/!/);
    }
    if (mod.meta.type === "Hero") {
      // Hero R2: one primary action at most (plus a secondary), not counting the site header.
      const heroOnly = html.replace(/<header[\s\S]*?<\/header>/g, "");
      expect((heroOnly.match(/data-role="primary"/g) ?? []).length, `${folder}: primaries`).toBeLessThanOrEqual(1);
      for (const file of files.filter((name) => name.endsWith(".tsx"))) {
        const source = readFileSync(join(dir, file), "utf8");
        // Hero R3: no auto-rotating slides or text.
        expect(source, `${folder}/${file}: auto-rotation`).not.toMatch(/setInterval|aria-roledescription="carousel"|<Carousel\b/);
        // Hero R9: content height plus Band padding; full-screen heights only for over-media heroes.
        if (!/over-media|overMedia/.test(folder)) expect(source, `${folder}/${file}: full-screen hero`).not.toMatch(/\b(min-)?h-(screen|svh|dvh|lvh)\b|100s?vh/);
      }
    }
    // Logo strip O4: every logo in a logos slot carries the company name as text (not only aria-label);
    // O5: no auto-moving marquee without a Pause button.
    const logos = html.match(/data-slot="logos"[\s\S]*?<\/ul>/)?.[0];
    if (logos != null) {
      for (const [item] of logos.matchAll(/<li\b[\s\S]*?<\/li>/g)) {
        expect(item, `${folder}: logo without a text name`).toMatch(/class="sr-only">[^<]+</);
      }
      if (/marquee|animate-/.test(logos)) expect(logos, `${folder}: marquee without Pause`).toMatch(/>Pause</);
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
    // L8: a lead (type-lead) sits in ink; muted only as a one-line tagline, in patterns measured to stay on
    // one line at 390 (2026-10-28).
    const mutedTaglines = ["hero/phone-center"];
    if (!mutedTaglines.includes(folder)) {
      expect(html, `${folder}: muted lead`).not.toMatch(/class="[^"]*\btype-lead\b[^"]*\btext-muted\b|class="[^"]*\btext-muted\b[^"]*\btype-lead\b/);
    }
    // U1/U4: the secondary level is role="outline" (a 3:1 edge). WMDS's filled `secondary` pill sits near 1:1 on the page.
    for (const file of files.filter((name) => name.endsWith(".tsx"))) {
      expect(readFileSync(join(dir, file), "utf8"), `${folder}/${file}: role="secondary"`).not.toMatch(/role="secondary"/);
    }
    // U5: a CTA (primary or outline Button) is size="lg", 48px on every pointer; size="sm" only in the example nav.
    for (const file of files.filter((name) => name.endsWith(".tsx"))) {
      for (const [tag] of readFileSync(join(dir, file), "utf8").matchAll(/<Button role="(?:primary|outline)".*$/gm)) {
        expect(/size="(lg|sm)"/.test(tag), `${folder}/${file}: CTA without size="lg"`).toBe(true);
      }
    }
    // P5: layout changes only at WMDS breakpoints (md, lg, xl): no `sm:` and no one-off min-[…]/max-[…] widths.
    // One allowed exception (PD, 2026-10-28): `max-[359px]:hidden` on the example nav CTA, which the open menu repeats.
    for (const file of files.filter((name) => name.endsWith(".tsx"))) {
      const source = readFileSync(join(dir, file), "utf8").replaceAll("max-[359px]:hidden", "");
      expect(source, `${folder}/${file}: sm: breakpoint`).not.toMatch(/(?<![\w-])sm:/);
      expect(source, `${folder}/${file}: one-off breakpoint`).not.toMatch(/(?<![\w-])(min|max)-\[\d+px\]:/);
    }
    // K6: a 36px IconButton (size="sm") gets an invisible 44px hit area on phones (`before:-inset-1`).
    for (const file of files.filter((name) => name.endsWith(".tsx"))) {
      const source = readFileSync(join(dir, file), "utf8");
      for (const [tag] of source.matchAll(/<IconButton\b.*size="sm".*$/gm)) {
        expect(/HitArea|before:-inset-1/.test(tag), `${folder}/${file}: small IconButton without a phone hit area`).toBe(true);
      }
    }
    if (mod.meta.type === "Hero") {
      // R2: one primary action in the hero itself (the example nav's CTA aside).
      const bare = renderToString(<Example nav={undefined} />);
      expect((bare.match(/data-role="primary"/g) ?? []).length, `${folder}: primary actions`).toBeLessThanOrEqual(1);
      for (const file of files.filter((name) => name.endsWith(".tsx"))) {
        const source = readFileSync(join(dir, file), "utf8");
        // R3: nothing in a hero advances on a timer (no auto-rotating slides or headlines).
        expect(source, `${folder}/${file}: timer`).not.toMatch(/\bset(Interval|Timeout)\(/);
        // R9: no bare full-screen height; only a screen height less a visible edge, e.g. calc(100svh-4rem).
        expect(source, `${folder}/${file}: full-screen height`).not.toMatch(/(?<![\w-])(min-)?h-(screen|svh|dvh|lvh)\b|100[sdl]?vh(?!\s*-)/);
      }
    }
    // E10: a pill eyebrow always links. The eyebrow is either a plain <p> label or holds an <a href>.
    for (const match of html.matchAll(/data-slot="eyebrow"[^>]*>\s*<([a-z]+)/g)) {
      if (match[1] === "p") continue;
      const slot = html.slice(match.index, match.index + 1500);
      expect(slot, `${folder}: eyebrow pill without a link`).toMatch(/<a [^>]*href="[^"]+"/);
    }
    // H8: a heading is centred on phones (a bare `text-center`, not `md:text-center`) only in patterns
    // measured to stay within 2 lines at 390 (2026-10-28). Others left-align below md.
    const centredOnPhones = ["footer/over-image"];
    if (/<h[12][\s>]/.test(html) && !centredOnPhones.includes(folder)) {
      expect(html, `${folder}: heading centred on phones`).not.toMatch(/class="[^"]*(?<![:\w-])text-center\b/);
    }
  });
});

it("finds at least one pattern", () => {
  expect(folders.length).toBeGreaterThan(0);
  expect(existsSync(join(patternsDir, "hero", "feature-center"))).toBe(true);
});
