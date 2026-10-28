/**
 * Example content for Statement — Inline Pills. The pictures are simple glossy SVG icons drawn in WMDS
 * chart colours, so the example is licence-free; a client page swaps in its own icons or 3D renders.
 */
import { Button, InlinePill } from "@thewhatmatters/wmds";
import { StatementInlinePills, type StatementInlinePillsProps } from "./StatementInlinePills";

export const meta = {
  type: "Statement",
  name: "Statement — Inline Pills",
  purpose: "One big centred sentence with its key words in pills, each with a small picture that pops in.",
};

/** A soft top-left highlight, so the flat shapes read as glossy objects. */
function Gloss({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

/** A browser window: websites. */
function WebIcon() {
  return (
    <svg viewBox="0 0 48 48">
      <Gloss id="gloss-web" />
      <rect x="4" y="8" width="40" height="32" rx="9" fill="var(--color-chart-categorical-1)" />
      <rect x="4" y="8" width="40" height="32" rx="9" fill="url(#gloss-web)" />
      <circle cx="12" cy="16" r="2.5" fill="#fff" fillOpacity="0.9" />
      <circle cx="19" cy="16" r="2.5" fill="#fff" fillOpacity="0.6" />
      <rect x="10" y="23" width="28" height="11" rx="4" fill="var(--color-chart-categorical-3)" />
    </svg>
  );
}

/** A play button on a frame: video. */
function VideoIcon() {
  return (
    <svg viewBox="0 0 48 48">
      <Gloss id="gloss-video" />
      <rect x="6" y="6" width="36" height="36" rx="12" fill="var(--color-chart-categorical-2)" />
      <rect x="6" y="6" width="36" height="36" rx="12" fill="url(#gloss-video)" />
      <path d="M20 16.5v15a1.5 1.5 0 0 0 2.3 1.3l11.6-7.5a1.5 1.5 0 0 0 0-2.6l-11.6-7.5A1.5 1.5 0 0 0 20 16.5z" fill="#fff" />
    </svg>
  );
}

/** A chat bubble with a heart: social. */
function SocialIcon() {
  return (
    <svg viewBox="0 0 48 48">
      <Gloss id="gloss-social" />
      <path d="M24 6c10.5 0 19 7.2 19 16.5S34.5 39 24 39c-2.4 0-4.6-.4-6.7-1L9 42l2-7.5C7.3 31.5 5 27.2 5 22.5 5 13.2 13.5 6 24 6z" fill="var(--color-chart-categorical-4)" />
      <path d="M24 6c10.5 0 19 7.2 19 16.5S34.5 39 24 39c-2.4 0-4.6-.4-6.7-1L9 42l2-7.5C7.3 31.5 5 27.2 5 22.5 5 13.2 13.5 6 24 6z" fill="url(#gloss-social)" />
      <path d="M24 30s-8-4.8-8-10a4.4 4.4 0 0 1 8-2.5 4.4 4.4 0 0 1 8 2.5c0 5.2-8 10-8 10z" fill="#fff" />
    </svg>
  );
}

export function StatementInlinePillsExample(props: Partial<StatementInlinePillsProps>) {
  return (
    <StatementInlinePills
      animate
      eyebrow="What we do"
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
      {...props}
    >
      We build <InlinePill media={<WebIcon />}>websites</InlinePill>, shoot <InlinePill media={<VideoIcon />}>video</InlinePill>, and
      run <InlinePill media={<SocialIcon />}>social</InlinePill> for Austin businesses.
    </StatementInlinePills>
  );
}

export default StatementInlinePillsExample;
