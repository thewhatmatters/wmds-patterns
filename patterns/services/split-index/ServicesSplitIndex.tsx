/**
 * Services — Split Index: a ruled services section (after Heron AI's "Built to work the way you do"). A heading
 * row on top, then two ruled cells: the services as a WMDS `Accordion` on the right, and the open service's
 * picture in a dot-grid frame on the left that stays in view while the list scrolls. On phones the frame drops
 * away and each service's picture sits inside its own open row.
 *
 * Nothing animates beyond WMDS Accordion's own open and close. One service is open at a time.
 */
import { useId, useState, type ReactNode } from "react";
import { Accordion, SectionCaption, backgroundPatternDotGridClasses, cn } from "@thewhatmatters/wmds";

export interface ServicesSplitIndexService {
  /** The service's name, short: "Websites", "Brand identity". */
  title: ReactNode;
  /** What you get, in one or two sentences. */
  description: ReactNode;
  /** Slot: the service's picture: real work, a WMDS composition of its output, a photo or a loop. */
  visual: ReactNode;
  /** Slot, optional: short meta at the row's end, e.g. "From 6 weeks". */
  meta?: ReactNode;
  /** Slot, optional: a link under the description, e.g. a WMDS `<TextLink>` to the service page. */
  link?: ReactNode;
}

export interface ServicesSplitIndexProps {
  /** Slot, optional: the small mono caption over the section. Default "Services". */
  caption?: ReactNode;
  /** The section's heading, one short line or two. */
  heading: ReactNode;
  /** Optional: a sentence or two beside the heading. */
  intro?: ReactNode;
  /** Slot, optional: one CTA under the intro (a WMDS `<Button>`). */
  actions?: ReactNode;
  /** The services, 3–6 of them. */
  services: ServicesSplitIndexService[];
  /** The service open at first. Default 0. */
  defaultIndex?: number;
  className?: string;
}

/** Full width; content on the WMDS page grid; section padding 48 / 64 top and bottom. */
const gridClasses = "grid-page !pt-12 !pb-12 md:!pt-16 md:!pb-16";
/** Heading over the frame's columns; intro and CTA start on the list's first column, so the header lines up with the split below. */
const headingClasses = "col-span-full mt-6 text-balance type-display-3 text-fg md:col-span-4 lg:col-span-6";
const introClasses = "col-span-full mt-4 flex flex-col items-start gap-6 md:col-span-4 md:col-start-5 md:mt-6 lg:col-span-5 lg:col-start-7";
/** Two ruled cells on the page grid (subgrid): the frame's half and the list's half share the top rule and a centre rule. */
const cellsClasses = "col-span-full mt-10 grid border-t border-border md:mt-16 md:grid-cols-subgrid";
const frameCellClasses = "hidden border-r border-border md:col-span-4 md:block md:pr-8 md:pt-8 lg:col-span-6";
/** The frame stays in view while the list scrolls past it. */
const frameClasses = cn(
  "sticky top-8 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-border p-8",
  backgroundPatternDotGridClasses,
);
const listCellClasses = "pt-2 md:col-span-4 md:pt-6 lg:col-span-6";
const numberClasses = "font-mono text-xs tabular-nums text-muted";
const titleClasses = "type-heading-3 text-fg";
const metaClasses = "hidden font-mono text-xs uppercase tracking-wider text-muted sm:inline";
const panelClasses = "flex flex-col items-start gap-4 pb-6 pl-8";
const mobileFrameClasses = cn(
  "mt-2 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-border p-6 md:hidden",
  backgroundPatternDotGridClasses,
);

export function ServicesSplitIndex({
  caption = "Services",
  heading,
  intro,
  actions,
  services,
  defaultIndex = 0,
  className,
}: ServicesSplitIndexProps) {
  const headingId = useId();
  const [open, setOpen] = useState<number | null>(defaultIndex);
  // The frame keeps the last opened service's picture when every row is closed.
  const [shown, setShown] = useState(defaultIndex);

  return (
    <section className={cn("relative w-full", className)} aria-labelledby={headingId} data-pattern="services-split-index">
      <div className={gridClasses}>
        <SectionCaption as="p" className="col-span-full" rule={false}>
          {caption}
        </SectionCaption>
        <h2 id={headingId} className={headingClasses} data-slot="heading">
          {heading}
        </h2>
        {intro != null || actions != null ? (
          <div className={introClasses}>
            {intro != null ? (
              <p className="text-pretty text-muted" data-slot="intro" data-slot-optional="">
                {intro}
              </p>
            ) : null}
            {actions != null ? (
              <div data-slot="actions" data-slot-optional="">
                {actions}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={cellsClasses}>
          <div className={frameCellClasses}>
            <div className={frameClasses} data-slot="visual">
              {services[shown]?.visual}
            </div>
          </div>

          <div className={listCellClasses}>
            <Accordion variant="plain" flush>
              {services.map((service, index) => (
                <Accordion.Item
                  key={index}
                  open={open === index}
                  onOpenChange={(next) => {
                    setOpen(next ? index : null);
                    if (next) setShown(index);
                  }}
                  leading={<span className={numberClasses}>{String(index + 1).padStart(2, "0")}</span>}
                  label={<span className={titleClasses}>{service.title}</span>}
                  trailing={service.meta != null ? <span className={metaClasses}>{service.meta}</span> : undefined}
                >
                  <div className={panelClasses}>
                    <p className="max-w-[36em] text-pretty text-muted">{service.description}</p>
                    {service.link}
                    <div className={mobileFrameClasses}>{service.visual}</div>
                  </div>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
