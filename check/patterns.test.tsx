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

type ExampleModule = { default: ComponentType<{ nav?: undefined }>; meta: { name: string; purpose: string; type: string } };
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
    } else {
      // A hero holds the page's one h1, and renders no site nav when `nav` is left out.
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
      const bare = renderToString(<Example nav={undefined} />);
      expect(bare).not.toMatch(/<header[\s>]/);
      expect(bare).not.toMatch(/<nav[\s>]/);
    }
  });

});

it("finds at least one pattern", () => {
  expect(folders.length).toBeGreaterThan(0);
  expect(existsSync(join(patternsDir, "hero", "feature-center"))).toBe(true);
});
