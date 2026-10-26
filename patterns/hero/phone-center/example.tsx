/**
 * Example content for Hero — Phone Center. The media here is an abstract SVG gradient standing in for
 * the photo or video a real page passes; replace it, the copy and the caption with real content.
 */
import { Button } from "@thewhatmatters/wmds";
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

export const meta = {
  type: "Hero",
  name: "Hero — Phone Center",
  purpose: "Centred pitch and CTAs over a wide photo or video, with an iPhone frame showing the app in the middle.",
};

/** The pattern filled with the example content. */
export function HeroPhoneCenterExample(props: Partial<HeroPhoneCenterProps>) {
  return (
    <HeroPhoneCenter
      eyebrow="New · Free homepage sketch in 48 hours"
      headline="Your site, sketched on your phone by tomorrow"
      subhead="Tell us about your business. We send back a homepage you can tap through."
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
      media={<ExampleMedia />}
      screen="Sketch in progress…"
      {...props}
    />
  );
}

export default HeroPhoneCenterExample;
