/**
 * Example content for Hero — Stage, in four variants (the gallery's Variant control): the plain page with the
 * framed site sketch and logos, centred or at the start (the window follows the copy), and the restaurant over its video,
 * at the start or centred, under a transparent nav (WMDS `SiteNav overMedia`). The picture is Randy's Envato pick ("Blurred Restaurant Interior With Bartender in
 * Background"), licensed for the private gallery and kept in gallery/public/local, never committed here; without
 * it the hero shows the dark page colour under the scrim. Replace every part with the client's own.
 */
import { Button, SiteNav } from "@thewhatmatters/wmds";
import { HeroStage, HeroStageLogos, type HeroStageLogo, type HeroStageProps } from "./HeroStage";

const base = import.meta.env.BASE_URL;

/**
 * Placeholder client marks: each a different wordmark (weight, case, a simple symbol on some), drawn in
 * currentColor at 24px tall with text no smaller than 14px. Not real logos.
 */
type MarkSpec = { name: string; text: string; width: number; weight: number; caps?: boolean; italic?: boolean; symbol?: "circle" | "flame" | "book" | "bar" };
const marks: MarkSpec[] = [
  { name: "Cinder & Sotol", text: "Cinder&Sotol", width: 120, weight: 700, symbol: "flame" },
  { name: "Barton Bakehouse", text: "BARTON", width: 80, weight: 800, caps: true },
  { name: "Eastside Tire", text: "eastside", width: 90, weight: 500, symbol: "circle" },
  { name: "Lone Star Yoga", text: "Lone Star", width: 74, weight: 400, italic: true },
  { name: "Pecan St. Dental", text: "PECAN", width: 84, weight: 600, caps: true, symbol: "bar" },
  { name: "Mueller Books", text: "Mueller", width: 90, weight: 700, symbol: "book" },
  { name: "Rainey Records", text: "rainey", width: 56, weight: 800 },
  { name: "Zilker Bikes", text: "ZILKER", width: 90, weight: 500, caps: true, symbol: "circle" },
  { name: "Bouldin Florals", text: "Bouldin", width: 62, weight: 600, italic: true },
  { name: "Holly St. Coffee", text: "HOLLY ST", width: 92, weight: 700, caps: true },
  { name: "Tarrytown Vet", text: "Tarrytown", width: 100, weight: 500, symbol: "bar" },
  { name: "Govalle Gym", text: "GOVALLE", width: 90, weight: 800, caps: true },
];
const symbols = {
  circle: <circle cx="8" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />,
  flame: <path d="M8 2c3 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 3-6 0 3 1 4 3 4-1-3 0-6 0-9z" fill="currentColor" />,
  book: <path d="M1 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H1zM15 4H9a2 2 0 0 0-2 2" fill="none" stroke="currentColor" strokeWidth="2" />,
  bar: <rect x="1" y="4" width="5" height="16" fill="currentColor" />,
};
function Wordmark({ spec }: { spec: MarkSpec }) {
  const offset = spec.symbol ? 20 : 0;
  return (
    <svg viewBox={`0 0 ${spec.width} 24`} role="img" aria-label={spec.name}>
      {spec.symbol ? symbols[spec.symbol] : null}
      <text
        x={offset}
        y="17.5"
        fill="currentColor"
        fontFamily="inherit"
        fontSize="16"
        fontWeight={spec.weight}
        fontStyle={spec.italic ? "italic" : undefined}
        letterSpacing={spec.caps ? "1" : "-0.4"}
      >
        {spec.text}
      </text>
    </svg>
  );
}
export const exampleLogos = (count: number): HeroStageLogo[] =>
  marks.slice(0, count).map((spec) => ({ name: spec.name, logo: <Wordmark spec={spec} /> }));

/** Placeholder product visual: a still, hairline sketch of a small site (nav, headline, image, button). */
export function SiteSketch() {
  const line = "border border-[var(--ruled-rule,var(--color-border-emphasized))]";
  return (
    <div className="flex min-h-72 flex-col gap-6 bg-surface p-5 lg:min-h-96 lg:p-8">
      <div className="flex items-center justify-between">
        <div className={`h-3 w-20 ${line}`} />
        <div className="flex gap-3">
          <div className={`h-2 w-10 ${line}`} />
          <div className={`h-2 w-10 ${line}`} />
          <div className={`h-2 w-10 ${line}`} />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className={`h-5 w-3/4 ${line}`} />
        <div className={`h-5 w-1/2 ${line}`} />
      </div>
      <div className={`h-32 w-full lg:h-48 ${line} [background:linear-gradient(to_top_right,transparent_calc(50%-0.5px),var(--color-border-emphasized)_50%,transparent_calc(50%+0.5px))]`} />
      <div className={`h-9 w-36 ${line}`} />
    </div>
  );
}

/** An example site nav, to show the hero under one. A real page keeps its own nav. */
/** An example site nav, to show the hero under one. A real page keeps its own nav. Over the video, `overMedia`. */
export function ExampleNav({ overMedia = false }: { overMedia?: boolean }) {
  const brand = overMedia ? "Cinder & Sotol" : "WhatMatters";
  const links = overMedia ? ["Menu", "Bar", "Events", "Visit"] : ["Services", "Work", "Pricing", "Process"];
  const cta = overMedia ? { href: "#book", label: "Book a table" } : { href: "#sketch", label: "Get my free sketch" };
  return (
    <SiteNav
      placement="inline"
      state="expanded"
      overMedia={overMedia}
      start={<SiteNav.Brand href="#home">{brand}</SiteNav.Brand>}
      middle={
        <SiteNav.Links>
          {links.map((link) => (
            <SiteNav.Link key={link} href={`#${link.toLowerCase()}`}>
              {link}
            </SiteNav.Link>
          ))}
        </SiteNav.Links>
      }
      end={
        <Button role="primary" size="sm" render={<a href={cta.href} />} className="whitespace-nowrap">
          {cta.label}
        </Button>
      }
      mobile={
        <>
          {links.map((link) => (
            <SiteNav.MobileLink key={link} href={`#${link.toLowerCase()}`}>
              {link}
            </SiteNav.MobileLink>
          ))}
        </>
      }
      mobileAction={
        <Button role="primary" size="lg" render={<a href={cta.href} />}>
          {cta.label}
        </Button>
      }
    />
  );
}

/** Read by the gallery and the check. Keep it in step with this pattern's row in SKILL.md. */
export const meta = {
  type: "Hero",
  name: "Hero — Stage",
  purpose: "The pitch on the page or over a photo or video, at the start, centre or end, with an optional product window and logos.",
  variants: [
    { id: "plain-center", label: "Page · centre" },
    { id: "plain-start", label: "Page · start" },
    { id: "video-start", label: "Video · start" },
    { id: "video-center", label: "Video · centre" },
  ],
};

const studioActions = (
  <>
    <Button role="primary" size="lg" render={<a href="#sketch" />}>
      Get my free sketch
    </Button>
    <Button role="outline" size="lg" render={<a href="#work" />}>
      See our work
    </Button>
  </>
);
const restaurantActions = (
  <>
    <Button role="primary" size="lg" render={<a href="#book" />}>
      Book a table
    </Button>
    <Button role="outline" size="lg" render={<a href="#menu" />}>
      See the menu
    </Button>
  </>
);
const studio: Partial<HeroStageProps> = {
  eyebrow: "Free sketch in 48 hours",
  eyebrowHref: "#sketch",
  headline: "Websites that bring Austin in the door.",
  lead: "We build what customers check first. Live in two weeks, from $750.",
  actions: studioActions,
  visual: <SiteSketch />,
  logos: <HeroStageLogos logos={exampleLogos(6)} />,
};
const restaurant: Partial<HeroStageProps> = {
  eyebrow: "East 6th · Austin",
  headline: "Wood-fired Sonoran food on East 6th.",
  lead: "Open late Thursday to Saturday.",
  actions: restaurantActions,
};
const video = { kind: "video", src: `${base}local/footer-over-image.mp4`, poster: `${base}local/footer-over-image.jpg` } as const;

export const variants: Record<string, Partial<HeroStageProps>> = {
  "plain-center": { ...studio, align: "center" },
  "plain-start": { ...studio, align: "start" },
  "video-start": { ...restaurant, backdrop: video, align: "start" },
  "video-center": { ...restaurant, backdrop: video, align: "center" },
};

/** The pattern filled with the example content, in one of the variants (the gallery passes `variant`). Leave `nav` out when the page already has one. */
export function HeroStageExample({ variant = "plain-center", ...props }: Partial<HeroStageProps> & { variant?: string }) {
  const chosen = variants[variant] ?? variants["plain-center"];
  return <HeroStage nav={<ExampleNav overMedia={chosen.backdrop != null} />} headline="" {...chosen} {...props} />;
}

export default HeroStageExample;
