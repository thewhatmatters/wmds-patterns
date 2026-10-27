/**
 * Example content for Footer — Landscape. The band plays a mountain flyover from Envato ("Abstract Mountain
 * Range Flyover Animation"), cropped to the ridges. Until the licensed file is in, it plays from
 * gallery/public/local/ (not committed). Replace the brand, copy, links and clip with the client's own.
 */
import { TextLink } from "@thewhatmatters/wmds";
import { FooterAsciiBand, FooterClocks, FooterLandscape, type FooterLandscapeProps } from "./FooterLandscape";

const base = import.meta.env.BASE_URL;

export const meta = {
  type: "Footer",
  name: "Footer — Landscape",
  purpose: "Calm footer on tinted paper: brand, live world clocks, link columns, a fact strip, and a landscape drawn live in dots.",
};

export function FooterLandscapeExample(props: Partial<FooterLandscapeProps>) {
  return (
    <div className="flex min-h-svh flex-col justify-end">
      <FooterLandscape
        brand={<span className="type-large font-semibold tracking-tight">WhatMatters</span>}
        pitch={
          <>
            Websites, video and social for Austin businesses. Built in Austin at <TextLink href="#studio">WhatMatters Studio</TextLink>.
          </>
        }
        clocks={
          <FooterClocks
            cities={[
              { city: "Austin", region: "Texas", timeZone: "America/Chicago" },
              { city: "New York", region: "N. America", timeZone: "America/New_York" },
              { city: "London", region: "Europe", timeZone: "Europe/London" },
              { city: "Tokyo", region: "Asia", timeZone: "Asia/Tokyo" },
            ]}
          />
        }
        links={[
          { label: "Studio", links: [{ label: "Work", href: "#work" }, { label: "Pricing", href: "#pricing" }, { label: "Instagram", href: "#ig", external: true }] },
          { label: "Legal", links: [{ label: "Privacy", href: "#privacy" }, { label: "Terms", href: "#terms" }] },
        ]}
        facts={["© 2026 WhatMatters", "whatmatters.studio", <TextLink href="mailto:hello@whatmatters.studio">hello@whatmatters.studio</TextLink>, "Built in Austin"]}
        status="All systems operational"
        moment={<FooterAsciiBand src={`${base}local/footer-landscape.mp4`} focusY={1} />}
        {...props}
      />
    </div>
  );
}

export default FooterLandscapeExample;
