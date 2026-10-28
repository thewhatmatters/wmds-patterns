/**
 * Example content for Hero — Feature Center: placeholder client marks (not real logos), a hairline site
 * sketch for the visual, and a nav. Shows the pattern filled in; replace all of it with real content.
 */
import { Button, SiteNav } from "@thewhatmatters/wmds";
import { HeroFeatureCenter, HeroFeatureCenterLogos, type HeroFeatureCenterLogo, type HeroFeatureCenterProps } from "./HeroFeatureCenter";

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
export const exampleLogos = (count: number): HeroFeatureCenterLogo[] =>
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
export const exampleNav = (
  <SiteNav
    placement="inline"
    state="expanded"
    start={<SiteNav.Brand href="#home">WhatMatters</SiteNav.Brand>}
    middle={
      <SiteNav.Links>
        <SiteNav.Link href="#services">Services</SiteNav.Link>
        <SiteNav.Link href="#work">Work</SiteNav.Link>
        <SiteNav.Link href="#pricing">Pricing</SiteNav.Link>
        <SiteNav.Link href="#process">Process</SiteNav.Link>
      </SiteNav.Links>
    }
    end={
      <div className="flex items-center gap-2">
        <span className="max-md:hidden">
          <Button role="ghost" size="sm" render={<a href="#contact" />}>
            Contact
          </Button>
        </span>
        <Button role="primary" size="sm" render={<a href="#sketch" />} className="whitespace-nowrap">
          Get a free sketch
        </Button>
      </div>
    }
    mobile={
      <>
        <SiteNav.MobileLink href="#services">Services</SiteNav.MobileLink>
        <SiteNav.MobileLink href="#work">Work</SiteNav.MobileLink>
        <SiteNav.MobileLink href="#pricing">Pricing</SiteNav.MobileLink>
        <SiteNav.MobileLink href="#process">Process</SiteNav.MobileLink>
        <SiteNav.MobileLink href="#contact">Contact</SiteNav.MobileLink>
      </>
    }
  />
);

/** Read by the gallery and the check. Keep it in step with this pattern's row in SKILL.md. */
export const meta = {
  type: "Hero",
  name: "Hero — Feature Center",
  purpose: "Centred pitch and CTAs over the product in a backlit frame, then a row of client logos.",
};

/** The pattern filled with the example content. Leave `nav` out when the page already has one. */
export function HeroFeatureCenterExample(props: Partial<HeroFeatureCenterProps>) {
  return (
    <HeroFeatureCenter
      nav={exampleNav}
      eyebrow="Free sketch in 48 hours"
      eyebrowHref="#sketch"
      headline="Websites that bring Austin in the door."
      subhead={
        <>
          We design, build and run what your customers check before they visit.
          <br />
          Live in about two weeks, from $750.
        </>
      }
      actions={
        <>
          <Button role="primary" render={<a href="#sketch" />}>
            Get my free sketch
          </Button>
          <Button role="secondary" render={<a href="#work" />}>
            See our work
          </Button>
        </>
      }
      visual={<SiteSketch />}
      logos={<HeroFeatureCenterLogos logos={exampleLogos(6)} />}
      {...props}
    />
  );
}

export default HeroFeatureCenterExample;
