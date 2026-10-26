/**
 * Example content for Hero — Phone Center. The video is Mixkit's free clip "A girl's face in detail
 * while smiling" (Mixkit License, free to use, no attribution), loaded from Mixkit; replace it, the copy
 * and the caption with the client's own. `ExampleMedia` is a still stand-in for when there's no media yet.
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
      subhead="A homepage you can tap through, free."
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
      video={{ src: "https://assets.mixkit.co/videos/4883/4883-720.mp4", poster: "https://assets.mixkit.co/videos/4883/4883-thumb-720-0.jpg" }}
      screen="Sketch in progress…"
      {...props}
    />
  );
}

export default HeroPhoneCenterExample;
