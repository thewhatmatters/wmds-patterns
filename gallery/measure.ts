/**
 * Measure view (gallery only): tints every padding (green), margin (orange) and flex/grid gap (purple)
 * in the pattern and labels it in px. Hover an element to label all of its spacing with the class that
 * sets it (e.g. "64 · md:!pt-16", or "24 · grid-page --grid-margin"). Drawn in one fixed overlay, like
 * the Slots view, so the patterns' own code stays clean.
 */
import { useEffect } from "react";

type Side = "top" | "right" | "bottom" | "left";
type Kind = "padding" | "margin" | "gap";
type Box = { kind: Kind; x: number; y: number; w: number; h: number; px: number; token: string };

const sides: Side[] = ["top", "right", "bottom", "left"];
const sideLetter = { top: "t", right: "r", bottom: "b", left: "l" } as const;
const axisLetter = { top: "y", bottom: "y", right: "x", left: "x" } as const;
/** Tailwind's default breakpoints (WMDS doesn't change them), smallest first. */
const breakpoints = [
  ["sm", 40],
  ["md", 48],
  ["lg", 64],
  ["xl", 80],
  ["2xl", 96],
] as const;
/** WMDS classes that set spacing through a variable rather than a utility. */
const wmdsSpacing: Record<string, Partial<Record<Kind, Partial<Record<Side, string>>>>> = {
  "grid-page": {
    padding: { top: "--grid-pad", bottom: "--grid-pad", left: "--grid-margin", right: "--grid-margin" },
    margin: { left: "auto (--grid-max)", right: "auto (--grid-max)" },
    gap: { top: "--grid-row-gap", bottom: "--grid-row-gap", left: "--grid-column-gap", right: "--grid-column-gap" },
  },
};

/** The breakpoint prefixes active at this width, plus "" for unprefixed classes. */
function activePrefixes() {
  return ["", ...breakpoints.filter(([, rem]) => matchMedia(`(min-width: ${rem}rem)`).matches).map(([name]) => name)];
}

/**
 * The class that sets `kind` on `side`: the most specific utility (pt over py over p) at the largest
 * active breakpoint, or a WMDS class that sets it through a variable. Empty when none is found
 * (e.g. the value comes from a component's own CSS).
 */
function tokenFor(element: Element, kind: Kind, side: Side, prefixes: string[]) {
  const letter = kind === "padding" ? "p" : kind === "margin" ? "m" : "gap";
  const names =
    kind === "gap"
      ? [`gap-${side === "top" || side === "bottom" ? "y" : "x"}`, "gap"]
      : [`${letter}${sideLetter[side]}`, `${letter}${axisLetter[side]}`, letter];
  let best: { cls: string; rank: number } | undefined;
  for (const cls of element.classList) {
    const parts = cls.split(":");
    const utility = parts.pop()!.replace(/^!/, "").replace(/!$/, "");
    const prefix = parts.join(":");
    const bp = prefixes.indexOf(prefix);
    if (bp < 0) continue;
    const name = names.find((n) => utility.startsWith(`${n}-`) || utility.startsWith(`-${n}-`));
    if (!name) continue;
    const rank = bp * 10 + (names.length - names.indexOf(name));
    if (!best || rank > best.rank) best = { cls, rank };
  }
  if (best) return best.cls;
  for (const cls of element.classList) {
    const variable = wmdsSpacing[cls]?.[kind]?.[side];
    if (variable) return `${cls} ${variable}`;
  }
  return "";
}

function measure(root: Element, hovered: Element | null) {
  const prefixes = activePrefixes();
  const boxes: Box[] = [];
  const hoverBoxes: Box[] = [];
  for (const element of [root, ...root.querySelectorAll("*")]) {
    if (element.closest("svg") && element.tagName !== "svg") continue;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.position === "fixed") continue;
    const out = element === hovered ? hoverBoxes : boxes;
    const n = (v: string) => Math.round(parseFloat(v) || 0);
    const border = { top: n(style.borderTopWidth), right: n(style.borderRightWidth), bottom: n(style.borderBottomWidth), left: n(style.borderLeftWidth) };
    for (const side of sides) {
      const pad = n(style.getPropertyValue(`padding-${side}`));
      if (pad > 0) {
        const inner = { x: rect.left + border.left, y: rect.top + border.top, w: rect.width - border.left - border.right, h: rect.height - border.top - border.bottom };
        const box =
          side === "top" ? { x: inner.x, y: inner.y, w: inner.w, h: pad }
          : side === "bottom" ? { x: inner.x, y: inner.y + inner.h - pad, w: inner.w, h: pad }
          : side === "left" ? { x: inner.x, y: inner.y, w: pad, h: inner.h }
          : { x: inner.x + inner.w - pad, y: inner.y, w: pad, h: inner.h };
        out.push({ kind: "padding", ...box, px: pad, token: tokenFor(element, "padding", side, prefixes) });
      }
      const margin = n(style.getPropertyValue(`margin-${side}`));
      if (margin > 0) {
        const box =
          side === "top" ? { x: rect.left, y: rect.top - margin, w: rect.width, h: margin }
          : side === "bottom" ? { x: rect.left, y: rect.bottom, w: rect.width, h: margin }
          : side === "left" ? { x: rect.left - margin, y: rect.top, w: margin, h: rect.height }
          : { x: rect.right, y: rect.top, w: margin, h: rect.height };
        out.push({ kind: "margin", ...box, px: margin, token: tokenFor(element, "margin", side, prefixes) });
      }
    }
    // Gaps: the space between consecutive in-flow children of a flex or grid container.
    const rowGap = n(style.rowGap);
    const columnGap = n(style.columnGap);
    if ((rowGap > 0 || columnGap > 0) && /flex|grid/.test(style.display)) {
      const kids = [...element.children]
        .filter((kid) => !["absolute", "fixed"].includes(getComputedStyle(kid).position))
        .map((kid) => kid.getBoundingClientRect())
        .filter((r) => r.width > 0 || r.height > 0);
      for (let i = 1; i < kids.length; i++) {
        const a = kids[i - 1];
        const b = kids[i];
        const below = b.top - a.bottom;
        const beside = b.left - a.right;
        if (rowGap > 0 && Math.abs(below - rowGap) <= 1) {
          out.push({ kind: "gap", x: Math.min(a.left, b.left), y: a.bottom, w: Math.max(a.right, b.right) - Math.min(a.left, b.left), h: rowGap, px: rowGap, token: tokenFor(element, "gap", "top", prefixes) });
        } else if (columnGap > 0 && Math.abs(beside - columnGap) <= 1) {
          out.push({ kind: "gap", x: a.right, y: Math.min(a.top, b.top), w: columnGap, h: Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top), px: columnGap, token: tokenFor(element, "gap", "left", prefixes) });
        }
      }
    }
  }
  return { boxes, hoverBoxes };
}

function draw(layer: HTMLElement, boxes: Box[], detailed: boolean) {
  return boxes.map((box) => {
    const el = document.createElement("div");
    el.dataset.measure = box.kind;
    if (detailed) el.dataset.measureHover = "";
    el.style.cssText = `transform:translate(${box.x}px,${box.y}px);width:${box.w}px;height:${box.h}px`;
    // Label only what has room; on hover, every box gets its class.
    if (detailed || Math.min(box.w, box.h) >= 12) {
      const label = document.createElement("span");
      label.textContent = detailed && box.token ? `${box.px} · ${box.token}` : `${box.px}`;
      el.append(label);
    }
    layer.append(el);
    return el;
  });
}

export function useMeasure(on: boolean) {
  useEffect(() => {
    if (!on) return;
    const root = document.getElementById("root")?.firstElementChild?.firstElementChild;
    if (!root) return;
    const layer = document.createElement("div");
    layer.dataset.measureLayer = "";
    document.body.append(layer);
    let hovered: Element | null = null;
    const place = () => {
      const { boxes, hoverBoxes } = measure(root, hovered);
      layer.replaceChildren();
      draw(layer, boxes, false);
      draw(layer, hoverBoxes, true);
      if (hovered) {
        const r = hovered.getBoundingClientRect();
        const outline = document.createElement("div");
        outline.dataset.measureOutline = "";
        outline.style.cssText = `transform:translate(${r.left}px,${r.top}px);width:${r.width}px;height:${r.height}px`;
        const size = document.createElement("span");
        size.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
        outline.append(size);
        layer.append(outline);
      }
    };
    const onMove = (event: PointerEvent) => {
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const next = target && root.contains(target) ? target : null;
      if (next !== hovered) {
        hovered = next;
        place();
      }
    };
    place();
    const timer = setInterval(place, 400); // follows scrolling, resizing and content that mounts later
    addEventListener("scroll", place, { passive: true });
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      clearInterval(timer);
      removeEventListener("scroll", place);
      removeEventListener("pointermove", onMove);
      layer.remove();
    };
  }, [on]);
}
