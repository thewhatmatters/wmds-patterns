/**
 * Footer — Over Image: a full-width picture or looping video, an optional closing call to action set on
 * it, and the footer itself as a contained WMDS Card floating over the picture (after Unify's footer).
 *
 * The picture is decorative: no controls, hidden from screen readers, paused off-screen, and held on its
 * poster under reduced motion (ux-best-practices → Media). Text on the picture sits in a dark-theme scope
 * over a scrim, so it takes the WMDS dark tokens and stays readable on any footage.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { Card, cn, TextLink } from "@thewhatmatters/wmds";

export interface FooterOverImageLink {
  label: string;
  href: string;
  /** Marks another site with WMDS TextLink's external icon (same tab from WMDS 0.4.30, Links K9). */
  external?: boolean;
}

export interface FooterOverImageColumn {
  label: string;
  links: FooterOverImageLink[];
  /** Columns in the second row can take two grid columns, for longer link text (post titles). */
  wide?: boolean;
}

export interface FooterOverImageProps {
  /** Slot: the picture behind everything, a decorative `<img alt="">`. Ignored when `video` is set. */
  media?: ReactNode;
  /** A decorative looping video instead of `media`: muted, no controls, still on `poster` under reduced motion. */
  video?: { src: string; poster?: string };
  /** Slot, optional: the closing headline on the picture (an h2). */
  headline?: ReactNode;
  /** Slot, optional: one or two short lines under the headline. */
  subhead?: ReactNode;
  /** Slot, optional: the call to action, usually one WMDS `<Button>`. */
  actions?: ReactNode;
  /** The link columns in the card's first row (3–5). */
  columns: FooterOverImageColumn[];
  /** Slot, optional: a last column in the first row, e.g. "Follow us" with WMDS `IconButton`s. */
  follow?: ReactNode;
  /** Optional second row of columns (case studies, latest posts); `wide` ones take two grid columns. */
  more?: FooterOverImageColumn[];
  /** Slot: the big brand mark at the card's bottom left (an SVG or `<img>`, about 80px tall on desktop). */
  logo: ReactNode;
  /** Slot: the copyright line, bottom right. */
  copyright: ReactNode;
  /** Small legal links at the bottom right (Terms, Privacy…). */
  legal?: FooterOverImageLink[];
  className?: string;
}

/** Full width; the picture fills it. Section padding 48 / 64 at the top; the card closes 24 / 40 above the page edge. */
const rootClasses = "relative isolate w-full overflow-hidden";
const mediaClasses = "absolute inset-0 -z-10 size-full object-cover";
/** Dark behind the call to action (AA on bright footage), clear by three quarters down so the picture shows around the card. */
const scrimClasses =
  "pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-[color-mix(in_srgb,var(--color-background-body)_82%,transparent)] via-[color-mix(in_srgb,var(--color-background-body)_55%,transparent)] via-35% to-transparent to-75%";
const gridClasses = "grid-page !pt-12 !pb-6 md:!pt-16 md:!pb-10";
const ctaClasses = "col-span-full flex flex-col items-center text-center text-fg";
/** A long word breaks instead of running off a phone (Display rule D5). */
const headlineClasses = "min-w-0 max-w-[min(16em,100%)] text-balance [overflow-wrap:anywhere] type-display-2 font-medium tracking-tight";
const subheadClasses = "mt-4 max-w-[34rem] text-pretty font-normal text-muted type-large";
const actionsClasses = "mt-8 flex flex-wrap items-center justify-center gap-3";
/** The card: contained to 10 of 12 columns on desktop, full width with the page margin on phones. */
const cardWrapClasses = "col-span-full lg:col-start-2 lg:col-end-12";
const cardGapClasses = "mt-16 md:mt-24";
const columnsClasses = "grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-5";
const moreClasses = "mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-5";
/** Column labels: the library's one label style, caps `type-eyebrow` (Eyebrow E9), as in Footer — Landscape. */
const labelClasses = "mb-3 text-muted type-eyebrow";
/** A 44px tap row on phones; tighter where there's a pointer. */
const linkItemClasses = "type-body text-fg [overflow-wrap:anywhere]";
const linkClasses = "inline-block py-3 md:py-1";
const bottomClasses = "mt-16 flex flex-col gap-8 md:mt-24 md:flex-row md:items-end md:justify-between";
const logoClasses = "h-12 w-auto md:h-20 [&>svg]:h-full [&>svg]:w-auto [&>img]:h-full [&>img]:w-auto";
const legalClasses = "flex flex-col gap-1 text-muted type-caption md:items-end";

function Column({ column, id }: { column: FooterOverImageColumn; id: string }) {
  return (
    <div className={column.wide ? "col-span-2" : undefined}>
      <p id={id} className={labelClasses}>
        {column.label}
      </p>
      <ul aria-labelledby={id}>
        {column.links.map((link) => (
          <li key={link.label} className={linkItemClasses}>
            <TextLink href={link.href} variant="quiet" external={link.external} className={linkClasses}>
              {link.label}
            </TextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Decorative looping video: plays only on-screen, holds the poster under reduced motion. */
function BackgroundVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => (visible && !motion.matches ? video.play().catch(() => {}) : video.pause());
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      sync();
    });
    observer.observe(video);
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
    };
  }, []);
  return <video ref={ref} className={mediaClasses} src={src} poster={poster} muted loop playsInline preload="metadata" aria-hidden />;
}

export function FooterOverImage({ media, video, headline, subhead, actions, columns, follow, more, logo, copyright, legal, className }: FooterOverImageProps) {
  const hasCta = headline != null || subhead != null || actions != null;
  return (
    <footer className={cn(rootClasses, className)} data-pattern="footer-over-image">
      {video ? (
        <BackgroundVideo src={video.src} poster={video.poster} />
      ) : media != null ? (
        <div aria-hidden className={cn(mediaClasses, "[&>*]:size-full [&>*]:object-cover")} data-slot="media">
          {media}
        </div>
      ) : null}
      {hasCta ? <div className={scrimClasses} data-theme="dark" /> : null}
      <div className={gridClasses}>
        {hasCta ? (
          // Dark-theme scope: the WMDS tokens (text, muted, Button) take their dark values on the picture.
          <div className={ctaClasses} data-theme="dark">
            {headline != null ? (
              <h2 className={headlineClasses} data-slot="headline" data-slot-optional="">
                {headline}
              </h2>
            ) : null}
            {subhead != null ? (
              <p className={subheadClasses} data-slot="subhead" data-slot-optional="">
                {subhead}
              </p>
            ) : null}
            {actions != null ? (
              <div className={actionsClasses} data-slot="actions" data-slot-optional="">
                {actions}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className={cn(cardWrapClasses, hasCta && cardGapClasses)}>
          <Card padding="lg">
            <nav aria-label="Footer">
              <div className={columnsClasses} data-slot="columns">
                {columns.map((column, i) => (
                  <Column key={column.label} column={column} id={`footer-over-image-c${i}`} />
                ))}
                {follow != null ? (
                  <div data-slot="follow" data-slot-optional="">
                    {follow}
                  </div>
                ) : null}
              </div>
              {more && more.length > 0 ? (
                <div className={moreClasses} data-slot="more" data-slot-optional="">
                  {more.map((column, i) => (
                    <Column key={column.label} column={column} id={`footer-over-image-m${i}`} />
                  ))}
                </div>
              ) : null}
            </nav>
            <div className={bottomClasses}>
              <div className={logoClasses} data-slot="logo">
                {logo}
              </div>
              <div className={legalClasses}>
                <p data-slot="copyright">{copyright}</p>
                {legal && legal.length > 0 ? (
                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {legal.map((link) => (
                      <li key={link.label}>
                        <TextLink href={link.href} variant="quiet" className="inline-block py-3 md:-my-1 md:py-1">
                          {link.label}
                        </TextLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </footer>
  );
}
