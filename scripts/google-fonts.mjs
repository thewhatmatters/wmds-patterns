// Refresh gallery/fonts.json from Google Fonts' public metadata (no API key): `node scripts/google-fonts.mjs`.
// Each entry: [family, category, weights, variable]. Weights are the upright weights ("400,700"), or "100..900"
// for a variable font. Latin families only, most popular first.
import { writeFileSync } from "node:fs";

const res = await fetch("https://fonts.google.com/metadata/fonts");
const text = await res.text();
const data = JSON.parse(text.slice(text.indexOf("{")));
const categories = { "Sans Serif": "sans", Serif: "serif", Display: "display", Handwriting: "handwriting", Monospace: "mono" };
const fonts = data.familyMetadataList
  .filter((f) => f.subsets.includes("latin"))
  .sort((a, b) => a.popularity - b.popularity)
  .map((f) => {
    const wght = f.axes.find((a) => a.tag === "wght");
    const weights = wght ? `${wght.min}..${wght.max}` : Object.keys(f.fonts).filter((k) => !k.endsWith("i")).join(",");
    return [f.family, categories[f.category] ?? "sans", weights];
  });
writeFileSync(new URL("../gallery/fonts.json", import.meta.url), JSON.stringify(fonts));
console.log(`gallery/fonts.json: ${fonts.length} families`);
