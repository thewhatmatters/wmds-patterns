/**
 * Example content for Hero — Phone Center. Behind the phone: Mixkit's free clip "Brunette skincare model
 * smiles on white background" (Mixkit 9101, Mixkit License: free to use, no attribution), loaded from Mixkit.
 * In the phone: Motion Designer's see-through chat with Cami, an alpha video in two formats (HEVC first, for
 * Safari). Replace both and the copy with the client's own. `ExampleMedia` is a still stand-in for when there's no media yet.
 */
import { Button, SiteNav } from "@thewhatmatters/wmds";
import { HeroPhoneCenter, type HeroPhoneCenterProps } from "./HeroPhoneCenter";

/** Stand-in media: soft light in the brand's tones. A real page passes an <img> or a looping <video>. */
export function ExampleMedia() {
  return (
    <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
      <defs>
        <radialGradient id="phone-example-a" cx="0.5" cy="0.38" r="0.6">
          <stop offset="0" stopColor="var(--color-brand-outline)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--color-brand-outline)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="phone-example-b" cx="0.28" cy="0.7" r="0.5">
          <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="phone-example-c" cx="0.76" cy="0.62" r="0.45">
          <stop offset="0" stopColor="var(--color-brand-outline)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-brand-outline)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="700" fill="var(--color-surface)" />
      <rect width="1200" height="700" fill="url(#phone-example-a)" />
      <rect width="1200" height="700" fill="url(#phone-example-b)" />
      <rect width="1200" height="700" fill="url(#phone-example-c)" />
    </svg>
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
        <Button role="primary" size="sm" render={<a href="#sketch" />} className="whitespace-nowrap max-[359px]:hidden">
          Get my free sketch
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

export const meta = {
  type: "Hero",
  name: "Hero — Phone Center",
  purpose: "Centred pitch and CTAs over a wide photo or video, with an iPhone frame showing the app in the middle.",
  // The example's footage is shot on white, so it's shown in light only (see README → Light and dark).
  themes: ["light"],
};

/** Where the gallery serves the example's files (`/` locally, `/wmds-patterns/` on GitHub Pages). */
const base = import.meta.env.BASE_URL;

/** The pattern filled with the example content. */
export function HeroPhoneCenterExample(props: Partial<HeroPhoneCenterProps>) {
  return (
    <HeroPhoneCenter
      edgeBlur
      nav={exampleNav}
      eyebrow="Free sketch in 48 hours"
      eyebrowHref="#sketch"
      eyebrowIcon={
        <svg viewBox="0 0 16 16" aria-hidden focusable="false">
          <path fill="currentColor" d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13l-1.6-4.4L2 7l4.4-1.6z" />
        </svg>
      }
      headline="Your site, sketched on your phone by tomorrow"
      subhead="A homepage you can tap through, free."
      actions={
        <>
          <Button role="primary" size="lg" render={<a href="#sketch" />}>
            Get my free sketch
          </Button>
          <Button role="outline" size="lg" render={<a href="#work" />}>
            See our work
          </Button>
        </>
      }
      video={{ src: "https://assets.mixkit.co/videos/9101/9101-720.mp4", poster: "https://assets.mixkit.co/videos/9101/9101-thumb-720-0.jpg" }}
      app={
        <video autoPlay muted loop playsInline aria-hidden poster={`${base}examples/phone-center/cami-chat-poster.png`}>
          <source src={`${base}examples/phone-center/cami-chat.mov`} type='video/mp4; codecs="hvc1"' />
          <source src={`${base}examples/phone-center/cami-chat.webm`} type="video/webm" />
        </video>
      }
      {...props}
    />
  );
}

export default HeroPhoneCenterExample;
