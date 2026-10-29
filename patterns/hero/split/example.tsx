/**
 * Example content for Hero — Split: WhatMatters' own pitch, and a homepage sketch in a browser frame with
 * the same sketch on a phone over its corner (the real thing a client gets, Hero R8). Hairline sketches, so
 * the example is licence-free; replace them with the client's real work.
 */
import { Button, SiteNav } from "@thewhatmatters/wmds";
import { HeroSplit, type HeroSplitProps } from "./HeroSplit";

const rule = "border border-[var(--color-border-emphasized)]";

/** A homepage sketch: nav, headline, picture, button. `compact` is the phone's version. */
function HomepageSketch({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex h-full flex-col gap-3 p-3" : "flex h-full flex-col gap-5 p-5 lg:p-7"}>
      <div className="flex items-center justify-between">
        <div className={`h-2.5 w-14 ${rule}`} />
        {compact ? <div className={`h-2.5 w-4 ${rule}`} /> : (
          <div className="flex gap-2">
            <div className={`h-2 w-8 ${rule}`} />
            <div className={`h-2 w-8 ${rule}`} />
            <div className={`h-2 w-8 ${rule}`} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className={`h-4 w-4/5 ${rule}`} />
        <div className={`h-4 w-3/5 ${rule}`} />
      </div>
      <div className={`min-h-16 flex-1 ${rule} [background:linear-gradient(to_top_right,transparent_calc(50%-0.5px),var(--color-border-emphasized)_50%,transparent_calc(50%+0.5px))]`} />
      <div className={compact ? "h-5 w-3/4 rounded-full bg-[var(--color-primary)]" : "h-7 w-24 rounded-full bg-[var(--color-primary)]"} />
    </div>
  );
}

/** The visual: the sketch in a browser window, and on a phone over its lower right corner. */
export function SketchInFrames() {
  return (
    <div className="relative pb-10 pr-6 md:pb-12 md:pr-10" aria-hidden>
      <div className="h-full min-h-60 overflow-hidden rounded-[var(--radius-surface)] border border-border bg-surface shadow-soft-sm">
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-2.5">
          <span className="size-2 rounded-full bg-[var(--color-border-emphasized)]" />
          <span className="size-2 rounded-full bg-[var(--color-border-emphasized)]" />
          <span className="size-2 rounded-full bg-[var(--color-border-emphasized)]" />
          <span className="ml-3 h-4 w-40 max-w-[50%] rounded-full bg-[var(--color-fill-selected,var(--color-border))]" />
        </div>
        <div className="h-[calc(100%-2.25rem)] min-h-52">
          <HomepageSketch />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 aspect-[9/19] w-[26%] min-w-24 overflow-hidden rounded-[1.25rem] border-4 border-[var(--color-fg)] bg-surface shadow-soft-card">
        <HomepageSketch compact />
      </div>
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
        <SiteNav.Link href="#contact">Contact</SiteNav.Link>
      </SiteNav.Links>
    }
    end={
      <Button role="primary" size="sm" render={<a href="#sketch" />} className="whitespace-nowrap">
        Get my free sketch
      </Button>
    }
    mobile={
      <>
        <SiteNav.MobileLink href="#services">Services</SiteNav.MobileLink>
        <SiteNav.MobileLink href="#work">Work</SiteNav.MobileLink>
        <SiteNav.MobileLink href="#pricing">Pricing</SiteNav.MobileLink>
        <SiteNav.MobileLink href="#contact">Contact</SiteNav.MobileLink>
      </>
    }
    mobileAction={
      <Button role="primary" size="lg" render={<a href="#sketch" />}>
        Get my free sketch
      </Button>
    }
  />
);

/** Read by the gallery and the check. Keep it in step with this pattern's row in SKILL.md. */
export const meta = {
  type: "Hero",
  name: "Hero — Split",
  purpose: "The default services hero: left-aligned pitch and actions beside the real work in a frame.",
};

/** The pattern filled with the example content. Leave `nav` out when the page already has one. */
export function HeroSplitExample(props: Partial<HeroSplitProps>) {
  return (
    <HeroSplit
      nav={exampleNav}
      eyebrow="Austin · websites, video, social"
      headline="Websites that bring Austin in the door."
      lead="We build what your customers check before they visit. Live in about two weeks, from $750."
      primaryAction={
        <Button role="primary" size="lg" render={<a href="#sketch" />}>
          Get my free sketch
        </Button>
      }
      secondaryAction={
        <Button role="outline" size="lg" render={<a href="#work" />}>
          See our work
        </Button>
      }
      visual={<SketchInFrames />}
      {...props}
    />
  );
}

export default HeroSplitExample;
