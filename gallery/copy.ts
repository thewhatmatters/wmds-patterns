/**
 * What the gallery's Copy code and Copy prompt buttons put on the clipboard. Pure functions over the
 * repo's own files (read with Vite `?raw`), so the copied text can't drift from the code or the README.
 */

export const repoUrl = "https://github.com/thewhatmatters/wmds-patterns";

/** The pattern file with a header that makes it work wherever it's pasted. */
export function patternCode(folder: string, source: string, wmdsVersion: string): string {
  return [
    `// WMDS pattern: ${folder} (wmds-patterns)`,
    `// npm i @thewhatmatters/wmds@${wmdsVersion}`,
    `// import "@thewhatmatters/wmds/styles.css"; and let Tailwind scan this file`,
    "",
    source,
  ].join("\n");
}

/** The lines of a README section, from its `## Title` to the next `## `. */
function section(readme: string, title: string): string[] {
  const lines = readme.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${title}`);
  if (start === -1) return [];
  const end = lines.findIndex((line, index) => index > start && line.startsWith("## "));
  return lines.slice(start + 1, end === -1 ? undefined : end);
}

/**
 * Text props from "Slots and props": rows whose kind is ReactNode (copy), or a list of `{ label, … }`
 * items (a header's link labels), not slots or shorthands.
 */
export function textSlots(readme: string): string[] {
  return section(readme, "Slots and props")
    .filter((line) => line.startsWith("| `"))
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter(([, , kind]) => kind === "ReactNode" || /^`\{ label\b/.test(kind))
    .map(([, prop]) => prop.replace(/`/g, ""));
}

/** The first item of "Adapt it", e.g. "No product visual: leave `visual` empty…" → "no product visual". */
export function adaptExample(readme: string): string {
  const item = section(readme, "Adapt it").find((line) => line.startsWith("- "));
  const label = item?.match(/\*\*(.+?):?\*\*/)?.[1] ?? "";
  return label.replace(/:$/, "").toLowerCase();
}

/** The short brief to paste into a teammate or Claude Code. Blanks only for what to build. */
export function patternPrompt(folder: string, readme: string): string {
  const type = folder.split("/")[0];
  const slots = textSlots(readme).map((slot) => `${slot}: …`).join("; ");
  const example = adaptExample(readme);
  return (
    `Build the ${type} with the wmds-patterns pattern \`${folder}\` (${repoUrl}/tree/main/patterns/${folder}). ` +
    `Adapt it for: [client / page]. Copy: [${slots}]. ` +
    `Changes: [e.g. ${example}]. Use the client's brand through WMDS knobs.`
  );
}

/** `status: draft` or `status: approved` from the README; draft when missing. */
export function patternStatus(readme: string): "draft" | "approved" {
  return /^status:\s*approved\s*$/m.test(readme) ? "approved" : "draft";
}
