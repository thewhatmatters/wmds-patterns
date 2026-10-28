/**
 * Example content for Footer — Over Image. The video is Envato's "Blurred Restaurant Interior With
 * Bartender in Background" (guyswhoshoot, Randy's pick, 2026-10-27). Until the licensed file is in, it plays from
 * gallery/public/local/ (not committed). Replace the copy, links, logo and video with the client's own.
 */
import { Button, IconButton } from "@thewhatmatters/wmds";
import { FooterOverImage, type FooterOverImageProps } from "./FooterOverImage";

const base = import.meta.env.BASE_URL;

export const meta = {
  type: "Footer",
  name: "Footer — Over Image",
  purpose: "A closing call to action on a full-width picture or loop, with the footer as a contained card floating over it.",
};

/** The WhatMatters "W" as a heavy two-stroke mark, in the text colour. */
function Mark() {
  return (
    <svg viewBox="0 0 120 80" aria-label="WhatMatters" role="img">
      <path d="M0 0h28l12 44L52 0h16l12 44L92 0h28L96 80H70L60 40 50 80H24z" fill="currentColor" />
    </svg>
  );
}

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path d={d} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

const instagram =
  "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.2 5.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3 0-4.1.1C4.4 2.3 2.3 4.4 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.5 2.3 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.5-.2 5.6-2.3 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-3.5-2.3-5.6-5.8-5.8C15 2 14.7 2 12 2z";
const linkedin = "M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM2.5 8.5h3V21h-3zM9 8.5h2.9v1.7h.1c.4-.8 1.4-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8V21h-3v-6.8c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V21H9z";

export function FooterOverImageExample(props: Partial<FooterOverImageProps>) {
  return (
    <FooterOverImage
      video={{ src: `${base}local/footer-over-image.mp4`, poster: `${base}local/footer-over-image.jpg` }}
      headline="Let's get Austin in the door"
      subhead="Websites, video and social that make the first visit easy."
      actions={
        <Button role="primary" render={<a href="#sketch" />}>
          Get my free sketch
        </Button>
      }
      columns={[
        { label: "Services", links: [{ label: "Websites", href: "#web" }, { label: "Video", href: "#video" }, { label: "Social", href: "#social" }, { label: "Care plans", href: "#care" }] },
        { label: "Work", links: [{ label: "Restaurants", href: "#food" }, { label: "Retail", href: "#retail" }, { label: "Health", href: "#health" }] },
        { label: "Studio", links: [{ label: "About", href: "#about" }, { label: "Process", href: "#process" }, { label: "Pricing", href: "#pricing" }] },
        { label: "Contact", links: [{ label: "hello@whatmatters.studio", href: "mailto:hello@whatmatters.studio" }, { label: "(512) 555 0142", href: "tel:+15125550142" }] },
      ]}
      follow={
        <>
          <p className="mb-3 text-muted type-eyebrow">Follow us</p>
          <div className="-ml-2.5 flex gap-1">
            <IconButton aria-label="WhatMatters on Instagram" size="sm" icon={<Glyph d={instagram} />} render={<a href="#instagram" />} />
            <IconButton aria-label="WhatMatters on LinkedIn" size="sm" icon={<Glyph d={linkedin} />} render={<a href="#linkedin" />} />
          </div>
        </>
      }
      more={[
        { label: "Case studies", links: [{ label: "Cinder & Sotol", href: "#cinder" }, { label: "Barton Books", href: "#barton" }, { label: "Pecan Dental", href: "#pecan" }] },
        {
          label: "Journal",
          wide: true,
          links: [
            { label: "What a homepage sketch in 48 hours looks like", href: "#post-1" },
            { label: "Five things your customers check before they visit", href: "#post-2" },
          ],
        },
      ]}
      logo={<Mark />}
      copyright="WhatMatters © 2026"
      legal={[
        { label: "Terms", href: "#terms" },
        { label: "Privacy", href: "#privacy" },
        { label: "Accessibility", href: "#a11y" },
      ]}
      {...props}
    />
  );
}

export default FooterOverImageExample;
