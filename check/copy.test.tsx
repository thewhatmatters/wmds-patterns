/** The gallery's Copy code and Copy prompt text, built from each pattern's own files. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { dependencies } from "../package.json";
import { patternCode, patternPrompt, repoUrl, textSlots } from "../gallery/copy";

const patternsDir = join(import.meta.dirname, "..", "patterns");
const folders = readdirSync(patternsDir).flatMap((type) =>
  readdirSync(join(patternsDir, type)).map((variant) => `${type}/${variant}`),
);
const version = dependencies["@thewhatmatters/wmds"];

describe.each(folders)("patterns/%s", (folder) => {
  const dir = join(patternsDir, folder);
  const file = readdirSync(dir).find((name) => name.endsWith(".tsx") && name !== "example.tsx")!;
  const source = readFileSync(join(dir, file), "utf8");
  const readme = readFileSync(join(dir, "README.md"), "utf8");

  it("Copy code is the pattern file exactly, under an install-and-styles header", () => {
    const code = patternCode(folder, source, version);
    expect(code.startsWith(`// WMDS pattern: ${folder} (wmds-patterns)\n// npm i @thewhatmatters/wmds@${version}\n`)).toBe(true);
    expect(code.slice(code.length - source.length)).toBe(source);
  });

  it("Copy prompt names the folder, links to it on GitHub, and lists the text slots", () => {
    const prompt = patternPrompt(folder, readme);
    expect(prompt).toContain(`\`${folder}\``);
    expect(prompt).toContain(`${repoUrl}/tree/main/patterns/${folder}`);
    const slots = textSlots(readme);
    expect(slots.length).toBeGreaterThan(0);
    for (const slot of slots) expect(prompt).toContain(`${slot}: …`);
    expect(prompt).toMatch(/Changes: \[e\.g\. .+\]/);
  });
});
