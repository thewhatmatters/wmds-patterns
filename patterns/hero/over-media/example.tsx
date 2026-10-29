/**
 * Example content for Hero — Over Media: a restaurant on East 6th. The video is Randy's Envato pick for
 * Footer — Over Image ("Blurred Restaurant Interior With Bartender in Background"), kept in
 * gallery/public/local and never committed (licensed preview); without it the gallery shows the dark page
 * colour behind the scrim. Replace it with the client's own footage or photo.
 */
import { Button, SiteNav } from "@thewhatmatters/wmds";
import { HeroOverMedia, type HeroOverMediaProps } from "./HeroOverMedia";

const base = import.meta.env.BASE_URL;

/** An example site nav, to show the hero under one. A real page keeps its own nav. */
export const exampleNav = (
  <SiteNav
    placement="inline"
    state="expanded"
    start={<SiteNav.Brand href="#home">Cinder &amp; Sotol</SiteNav.Brand>}
    middle={
      <SiteNav.Links>
        <SiteNav.Link href="#menu">Menu</SiteNav.Link>
        <SiteNav.Link href="#bar">Bar</SiteNav.Link>
        <SiteNav.Link href="#events">Events</SiteNav.Link>
        <SiteNav.Link href="#visit">Visit</SiteNav.Link>
      </SiteNav.Links>
    }
    end={
      <Button role="primary" size="sm" render={<a href="#book" />} className="whitespace-nowrap">
        Book a table
      </Button>
    }
    mobile={
      <>
        <SiteNav.MobileLink href="#menu">Menu</SiteNav.MobileLink>
        <SiteNav.MobileLink href="#bar">Bar</SiteNav.MobileLink>
        <SiteNav.MobileLink href="#events">Events</SiteNav.MobileLink>
        <SiteNav.MobileLink href="#visit">Visit</SiteNav.MobileLink>
      </>
    }
    mobileAction={
      <Button role="primary" size="lg" render={<a href="#book" />}>
        Book a table
      </Button>
    }
  />
);

/** Read by the gallery and the check. Keep it in step with this pattern's row in SKILL.md. */
export const meta = {
  type: "Hero",
  name: "Hero — Over Media",
  purpose: "Atmosphere first: the pitch at the bottom left of a full-width photo or looping video, over a scrim.",
};

/** The pattern filled with the example content. Leave `nav` out when the page already has one. */
export function HeroOverMediaExample(props: Partial<HeroOverMediaProps>) {
  return (
    <HeroOverMedia
      nav={exampleNav}
      eyebrow="East 6th · Austin"
      headline="Wood-fired Sonoran food on East 6th."
      lead="Open late Thursday to Saturday."
      primaryAction={
        <Button role="primary" size="lg" render={<a href="#book" />}>
          Book a table
        </Button>
      }
      secondaryAction={
        <Button role="outline" size="lg" render={<a href="#menu" />}>
          See the menu
        </Button>
      }
      video={{ src: `${base}local/footer-over-image.mp4`, poster: `${base}local/footer-over-image.jpg` }}
      {...props}
    />
  );
}

export default HeroOverMediaExample;
